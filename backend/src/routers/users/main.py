from . import models
from . import schemas
from . import controller
from fastapi import Body,Query,UploadFile ,File,BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
from src.utils.jwt import create_access_token, get_email_from_token,create_refresh_token
from fastapi.security import OAuth2PasswordBearer
from src.database import Database
from fastapi import APIRouter, Depends, HTTPException,status,Request
from sqlalchemy.exc import IntegrityError
from loguru import logger as logging
from src.routers.users.schemas import LoginSchema, TokenResponse,OTPVerificationRequest
import bcrypt
import jwt
from datetime import datetime,timedelta
import boto3
from src.config import GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET
from google.auth.transport import requests
from google.oauth2 import id_token
import httpx
from fastapi.responses import RedirectResponse


import random
import string


from fastapi_mail import FastMail, MessageSchema, MessageType
from src.config import (
    MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM,
    MAIL_PORT, MAIL_SERVER, MAIL_STARTTLS,
    MAIL_SSL_TLS, USE_CREDENTIALS
)
from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_STARTTLS=MAIL_STARTTLS,
    MAIL_SSL_TLS=MAIL_SSL_TLS,
    USE_CREDENTIALS=USE_CREDENTIALS,
    TEMPLATE_FOLDER='src/email/templates'
)

async def send_welcome_email(user_name: str, user_email: str):
    """Send welcome email to newly registered user"""
    try:
        message = MessageSchema(
            subject="Welcome to Our Platform!",
            recipients=[user_email],
            template_body={
                "name": user_name,
                "email": user_email
            },
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message, template_name="welcome.html")
        logging.info(f"Welcome email sent successfully to {user_email}")
    except Exception as e:
        logging.error(f"Failed to send welcome email to {user_email}: {str(e)}")

async def send_otp_email(email: str, otp: str):
    """Send OTP email to user"""
    try:
        message = MessageSchema(
            subject="Your Login OTP",
            recipients=[email],
            template_body={
                "otp": otp,
                "expires_in": "10 minutes"
            },
            subtype=MessageType.html,
            template_name="otp_email.html"
        )

        fm = FastMail(conf)
        await fm.send_message(message, template_name="otp_email.html")
        logging.info(f"OTP email sent successfully to {email}")
    except Exception as e:
        logging.error(f"Failed to send OTP email: {str(e)}")
        raise

# Dependency to get database session
db_util = Database()

def get_db():
    db = db_util.get_session()
    try:
        yield db
    finally:
        db.close()

def verify_password(raw_password: str,password:str) -> bool:
        """Verifies the provided password against the stored hash."""
        return bcrypt.checkpw(raw_password.encode('utf-8'), password.encode('utf-8'))

# Defining the router
router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
    responses={404: {"description": "Not found"}},
)

@router.post("/login", response_model=TokenResponse)
async def login(user_credentials: LoginSchema = Body(...), db: Session = Depends(get_db)):
    """
    Login endpoint for users to authenticate and obtain both an access token and a refresh token.
    """
    logging.debug("Login function called")

    try:
        # Log the email for debugging (avoid logging plaintext passwords in production)
        logging.info(f"Login attempt for email: {user_credentials.email}")

        # Validate credentials
        
        user = db.query(models.User).filter(
            models.User.email == user_credentials.email
        ).first()

        if not user or not verify_password(user_credentials.password, user.password):
            return {
                "success": False,
                "status": 401,
                "message": "Invalid credentials",
                "data": None
            }

        # Generate OTP
        otp = ''.join(random.choices(string.digits, k=6))
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        # Clear any existing unverified OTPs for this user
        db.query(models.OTPVerification).filter(
            models.OTPVerification.user_id == user.id,
            models.OTPVerification.status == "pending"
        ).delete()

        # Create new OTP record
        otp_verification = models.OTPVerification(
            user_id=user.id,
            otp_code=otp,
            expires_at=expires_at
        )
        db.add(otp_verification)
        db.commit()

        # Send OTP email
        await send_otp_email(user.email, otp)

        return {
            "success": True,
            "status": 200,
             "isActive": True,  # Add this field
            "message": "OTP sent to your email",
            "data": {
                "email": user.email,
                "requires_otp": True
            }
        }

    except Exception as e:
        logging.error(f"Login error: {e}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred during login"
        )

@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(
    verification: OTPVerificationRequest,
    db: Session = Depends(get_db)
):
    try:
        user = db.query(models.User).filter(
            models.User.email == verification.email
        ).first()

        if not user:
            return {
                "success": False,
                "status": 404,
                "message": "User not found",
                "data": None
            }

        # Get latest unverified OTP
        otp_record = db.query(models.OTPVerification).filter(
            models.OTPVerification.user_id == user.id,
            models.OTPVerification.status == models.OTPStatus.pending,
            models.OTPVerification.expires_at > datetime.utcnow()
        ).order_by(models.OTPVerification.created_at.desc()).first()

        if not otp_record or otp_record.otp_code != verification.otp_code:
            return {
                "success": False,
                "status": 401,
                "message": "Invalid or expired OTP",
                "data": None
            }

        # Mark OTP as verified
        otp_record.status = models.OTPStatus.verified
        db.commit()


        # Generate tokens
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token(data={"sub": user.email})

        return {
            "success": True,
            "status": 200,
            "isActive": True, 
            "message": "Login successful",
            "data": {
                "email": user.email,
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
            }
        }

    except Exception as e:
        logging.error(f"OTP verification error: {e}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="An error occurred during OTP verification"
        )

@router.get("/google_login")
async def login(request: Request):
    try:
        if not GOOGLE_CLIENT_ID:
            raise ValueError("GOOGLE_CLIENT_ID is not set in environment variables")

        redirect_uri = request.url_for('auth_callback')

        if not redirect_uri:
            raise ValueError("Failed to generate redirect URI")

        google_auth_url = (
            f"https://accounts.google.com/o/oauth2/auth"
            f"?client_id={GOOGLE_CLIENT_ID}"
            f"&redirect_uri={redirect_uri}"
            f"&response_type=code"
            f"&scope=openid email profile"
        )

        return RedirectResponse(url=google_auth_url)

    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    

@router.get("/callback")
async def auth_callback(code: str, request: Request):
    try:
        token_request_uri = "https://oauth2.googleapis.com/token"
        redirect_uri = "http://localhost:5001/api/users/callback"

        data = {
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
        }

        logging.debug(f"Requesting token with data: {data}")

        async with httpx.AsyncClient() as client:
            response = await client.post(token_request_uri, data=data)
            response.raise_for_status()  # Raise an error for non-200 responses
            token_response = response.json()

        logging.debug(f"Token response: {token_response}")

        id_token_value = token_response.get('id_token')
        if not id_token_value:
            raise HTTPException(status_code=400, detail="Missing id_token in response.")

        # Verify the ID token
        try:
            request_adapter = requests.Request()
            id_info = id_token.verify_oauth2_token(id_token_value, request_adapter, GOOGLE_CLIENT_ID)
            logging.debug(f"ID Token info: {id_info}")

            # Extract user details
            name = id_info.get('name', 'Unknown')
            email = id_info.get('email', 'Unknown')
            phone_number = id_info.get('phone_number', None)  # Google may not provide this
            profile_path = id_info.get('picture', None)  # Profile image URL
            role = "user"  # Default role


            # Store user session
            request.session['user'] = {
                "name": name,
                "email": email,
                "phone_number": phone_number,
                "role": role,
                "profile_path": profile_path
            }
            

            logging.debug(f"User Session: {request.session['user']}")

            return RedirectResponse(url='http://localhost:5173/dashboard')

        except ValueError as e:
            logging.error(f"Invalid ID Token: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Invalid id_token: {str(e)}")

    except httpx.HTTPStatusError as e:
        logging.error(f"HTTP Error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"OAuth2 Token Request Failed: {e.response.text}")

    except Exception as e:
        logging.error(f"Unexpected Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/info", response_model=schemas.UserResponse)
def get_user_info(request: Request, db: Session = Depends(get_db)):
    """
    Endpoint to fetch user information using the JWT token.
    """
    try:
        # Get the token from the Authorization header
        token = request.headers.get("Authorization")

        # Check if the token is missing
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is missing",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Ensure the token follows the "Bearer <token>" format
        if not token.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token format. Token must start with 'Bearer'.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Extract the actual token part
        token = token.split(" ")[1]

        # Get the email from the token
        email = get_email_from_token(token)

        # Fetch the user from the database using the email
        user = db.query(models.User).filter(models.User.email == email).first()

        # Check if the user exists in the database
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Please ensure the token is valid.",
            )

        # Check if the user account is active
        if not user.status:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account is inactive. Please contact support.",
            )

        # Log the user's role
        logging.info(f"User role for {user.email}: {user.role}")

        # Return the structured response with the user's role included
        return {
            "success": True,
            "status": 200,
            "isActive": True,
            "message": "User found successfully",
            "data": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "phone_number": user.phone_number,
                "profile_path": user.profile_path,
                "role": user.role,  # Convert Enum (if applicable) to its value
                "status": user.status,
            },
        }

    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later.",
        )


    
@router.post("/create", status_code=201)
def create_user(user: schemas.CreateUserSchema, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Endpoint to create a new user.
    """
    try:
        # Log the user creation attempt
        logging.info(f"User creation attempt for email: {user.email}, phone: {user.phone_number}")

        # Check if a user with the same email already exists
        email_exists = db.query(models.User).filter(models.User.email == user.email).first()
        if email_exists:
            logging.warning(f"User creation failed: Email {user.email} already exists")
            return {
                "success": False,
                "status": 400,
                "isActive": False,
                "message": "A user with this email address already exists. Please use a different email.",
                "data": None,
            }

        # Check if a user with the same phone number already exists
        phone_exists = db.query(models.User).filter(models.User.phone_number == user.phone_number).first()
        if phone_exists:
            logging.warning(f"User creation failed: Phone number {user.phone_number} already exists")
            return {
                "success": False,
                "status": 400,
                "isActive": False,
                "message": "A user with this phone number already exists. Please use a different phone number.",
                "data": None,
            }

        # Ensure all required fields are provided
        if not user.name or not user.email or not user.phone_number or not user.password:
            logging.warning(f"User creation failed: Missing required fields for email {user.email}")
            return {
                "success": False,
                "status": 422,
                "isActive": False,
                "message": "Missing required fields. Ensure that name, email, phone number, and password are provided.",
                "data": None,
            }

        # Create a new User instance (role set to "user" by default)
        new_user = models.User(
            name=user.name,
            email=user.email,
            phone_number=user.phone_number,
            role="user",  # Default role
            profile_path=user.profile_path,
            status=user.status,
        )

        # Hash and set the password
        new_user.set_password(user.password)

        # Add the new user to the database
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Generate the JWT token for the user
        access_token = create_access_token(data={"sub": new_user.email})

        # Schedule welcome email to be sent in the background
        background_tasks.add_task(
            send_welcome_email,
            user_name=new_user.name,
            user_email=new_user.email
        )

        # Return the structured response
        logging.info(f"User {new_user.email} created successfully with role 'user'")
        return {
            "success": True,
            "status": 201,
            "isActive": True,
            "message": "User created successfully. Welcome!",
            "data": {
                "email_id": new_user.email,
                "access_token": access_token,
                "token_type": "bearer",
            }
        }

    except ValueError as ve:
        # Handle specific validation errors
        logging.error(f"Validation error during user creation: {ve}")
        return {
            "success": False,
            "status": 422,
            "isActive": False,
            "message": f"Invalid input: {str(ve)}",
            "data": None,
        }

    except Exception as e:
        # Rollback the transaction in case of an error
        logging.error(f"An unexpected error occurred during user creation: {e}")
        db.rollback()
        return {
            "success": False,
            "status": 500,
            "isActive": False,
            "message": "An unexpected error occurred. Please try again later.",
            "data": None,
        }



@router.get("/get-profile-path", response_model=schemas.UserProfilePathResponse)
def get_user_profile_path(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Get the user's profile path from the database and verify its existence in S3.
    """
    try:
        # Decode email from the token
        try:
            email = get_email_from_token(token)
        except Exception as e:
            logging.error(f"Token decoding failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Fetch the user from the database using the decoded email
        user = db.query(models.User).filter(models.User.email == email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Ensure the token is valid and try again.",
            )

        # Check if the profile path exists in S3
        profile_path = user.profile_path
        logging.info(f"Profile path: {profile_path}")
        if not profile_path:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No profile path found for the user.",
            )

        # if not controller.s3_file_exists(profile_path):
        #     raise HTTPException(
        #         status_code=status.HTTP_404_NOT_FOUND,
        #         detail="Profile path does not exist in S3.",
        #     )

        # Generate a pre-signed URL for the profile path
        source_bucket = "ai-interview-bot"  # Replace with your S3 bucket name
        presigned_url = controller.generate_presigned_url(source_bucket, profile_path)

        # Return the user's profile path and pre-signed URL
        return schemas.UserProfilePathResponse(
            success=True,
            status=200,
            message="User profile path fetched successfully.",
            data={
                "profile_path": profile_path,
                "presigned_url": presigned_url
            },
        )

    except HTTPException as http_exc:
        logging.warning(f"HTTP exception: {http_exc.detail}")
        raise http_exc

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later.",
        )

@router.put("/update-profile-path", response_model=schemas.UserResponse)
async def update_user_profile_path(
    profile_picture: UploadFile = File(...),  # Accept the uploaded file
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Upload the profile picture to S3 and update the profile path in the database.
    """
    try:
        # Decode email from the token
        try:
            email = get_email_from_token(token)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Fetch the user from the database using the decoded email
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Ensure the token is valid and try again.",
            )

        # Validate user's role and permissions
        if user.email != email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to update another user's profile path.",
            )

        # Validate uploaded file
        if profile_picture.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only JPEG and PNG are allowed.",
            )

        # Construct the S3 key
        bucket_name = "ai-interview-bot"
        file_key = f"profile_pictures/{email}/{profile_picture.filename}"

        # Upload the file to S3
        s3_client = boto3.client("s3", region_name="us-east-1")
        try:
            # Read file content
            file_content = await profile_picture.read()

            # Upload file to S3
            s3_client.put_object(
                Bucket=bucket_name,
                Key=file_key,
                Body=file_content,
                ContentType=profile_picture.content_type,
            )
            logging.info(f"Profile picture uploaded to S3: {file_key}")

            # Construct the S3 URL
            s3_url = f"{file_key}"

        except Exception as s3_error:
            logging.error(f"Error uploading profile picture to S3: {s3_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload the profile picture to S3. Please try again.",
            )

        # Update the profile path in the database
        user.profile_path = s3_url

        # Commit the changes
        try:
            db.commit()
            db.refresh(user)
        except Exception as db_error:
            db.rollback()
            logging.error(f"Database commit error: {db_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while updating the profile path. Please try again.",
            )

        # Return updated user info
        return schemas.UserResponse(
            success=True,
            status=200,
            isActive=user.status == schemas.UserStatus.active,
            message="User profile path updated successfully.",
            data=schemas.UserData(
                id=user.id,
                name=user.name,
                email=user.email,
                phone_number=user.phone_number or "",
                profile_path=user.profile_path,
                status=user.status,
                role=user.role,
            ),
        )

    except HTTPException as http_exc:
        logging.warning(f"HTTP exception: {http_exc.detail}")
        raise http_exc

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later.",
        )

@router.put("/update-user-info", response_model=schemas.UserResponse)
def update_user_info(
    updated_info: schemas.UserResponseData = Body(...),  # Optional fields for update
    token: str = Depends(oauth2_scheme),  # Automatically extracts Bearer token
    db: Session = Depends(get_db),
):
    """
    Update user information.
    Admins can update all fields.
    Regular users can update their name, phone number, and profile path.
    """
    try:
        # Decode email from the token
        try:
            email = get_email_from_token(token)  # Utility to decode token and get email
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Fetch the user from the database using the decoded email
        user = db.query(models.User).filter(models.User.email == email).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Please ensure your token is valid.",
            )

        # Validate the fields that can be updated
        for field, value in updated_info.dict(exclude_unset=True).items():
            if field == "name":
                # Ensure the name is valid (non-empty, non-null)
                if not value.strip():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Name cannot be empty or only whitespace.",
                    )
                setattr(user, field, value)
            
            elif field == "phone_number":
                # Optional: Add validation for phone number format (if needed)
                if not value.strip():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Phone number cannot be empty or only whitespace.",
                    )
                setattr(user, field, value)
            
            elif field == "profile_path":
                # Optional: Add validation for profile path (e.g., URL validation)
                if not value.strip():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Profile path cannot be empty or only whitespace.",
                    )
                setattr(user, field, value)

            elif field == "role":
                # Prevent users from updating their own role
                if user.role != "admin":
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Regular users cannot update their role.",
                    )
                setattr(user, field, value)  # Admins can update roles

            else:
                # Handle unsupported fields
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Field '{field}' cannot be updated.",
                )

        # Commit the changes
        try:
            db.commit()
            db.refresh(user)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while updating the user information. Please try again.",
            )

        # Return updated user info
        return {
            "success": True,
            "status": 200,
            "isActive": user.status == 'active',  # Assuming 'active' means the user is active
            "message": "User information updated successfully",
            "data": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone_number": user.phone_number or "",  # Ensure default value if None
                "role": user.role,
                "profile_path": user.profile_path,
                "status": user.status,
            },
        }

    except HTTPException as http_exc:
        # Re-raise any HTTP exceptions
        logging.warning(f"HTTP exception: {http_exc.detail}")
        raise http_exc

    except Exception as e:
        # Handle unexpected errors
        logging.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later.",
        )

@router.post("/change-password", status_code=200)
def change_password(change_request: schemas.ChangePasswordSchema,
                    token: str = Depends(oauth2_scheme),
                    db: Session = Depends(get_db)):
    """
    Endpoint to change the password for the logged-in user.
    """
    try:
        # Decode email from the token
        try:
            email = get_email_from_token(token)  # Utility to decode token and get email
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Fetch the user from the database using the decoded email
        user = db.query(models.User).filter(models.User.email == email).first()
        logging.error(f"users:{user}")
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Ensure the token is valid and try again.",
            )

        # Verify old password
        if not user.verify_password(change_request.old_password):
            logging.warning(f"Password change failed: Incorrect old password for user {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The old password is incorrect.",
            )

        # Check new password validity
        if len(change_request.new_password) < 8:
            logging.warning(f"Password change failed: Weak new password for user {user.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The new password must be at least 8 characters long.",
            )

        # Update password
        user.set_password(change_request.new_password)
        db.commit()

        logging.info(f"Password changed successfully for user {user.email}")
        return {
            "success": True,
            "status": 200,
            "isActive": True,
            "message": "Password changed successfully.",
            "data": None,
        }

    except Exception as e:
        logging.error(f"An error occurred during password change: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later.",
        )


# @router.post("/forgot-password", status_code=200)
# def forgot_password(forgot_request: schemas.ForgotPasswordSchema, db: Session = Depends(get_db)):
    """
    Endpoint to handle forgotten password by sending a reset link or token.
    """
    try:
        # Find the user by email
        user = db.query(models.User).filter(models.User.email == forgot_request.email).first()
        if not user:
            logging.warning(f"Forgot password request failed: No user found with email {forgot_request.email}")
            return {
                "success": False,
                "status": 404,
                "isActive": False,
                "message": "No user found with this email address.",
                "data": None,
            }

        # Generate a password reset token
        reset_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(hours=1))

        # Send the reset token to the user (e.g., via email)
        controller.send_password_reset_email(email=user.email, token=reset_token)

        logging.info(f"Password reset token sent to {user.email}")
        return {
            "success": True,
            "status": 200,
            "isActive": True,
            "message": "A password reset link has been sent to your email.",
            "data": None,
        }

    except Exception as e:
        logging.error(f"An error occurred during forgot password request: {e}")
        return {
            "success": False,
            "status": 500,
            "isActive": False,
            "message": "An unexpected error occurred. Please try again later.",
            "data": None,
        }

# @router.post("/reset-password", status_code=200)
# def reset_password(
#     token: str = Query(..., description="Reset token from the URL"),
#     new_password: str = Body(..., embed=True, description="New password for the user"),
#     db: Session = Depends(get_db),
# ):
#     """
#     Endpoint to reset the password using a valid reset token.
#     """
    
#     try:
#         logging.debug(f"TOKEN JI {token}")
#         # Decode and verify the reset token
#         token_data = controller.decode_access_token(token)
#         email = token_data.get("email")
#         logging.error(f"Email{email}")
#         if not email:
#             logging.warning(f"Reset password failed: Invalid token")
#             return {
#                 "success": False,
#                 "status": 400,
#                 "isActive": False,
#                 "message": "Invalid or expired token.",
#                 "data": None,
#             }

#         # Find the user by email
#         user = db.query(models.User).filter(models.User.email == email).first()
#         if not user:
#             logging.warning(f"Reset password failed: No user found with email {email}")
#             return {
#                 "success": False,
#                 "status": 404,
#                 "isActive": False,
#                 "message": "No user found with this email address.",
#                 "data": None,
#             }

#         # Check new password validity
#         if len(new_password) < 8:
#             logging.warning(f"Reset password failed: Weak new password for user {email}")
#             return {
#                 "success": False,
#                 "status": 400,
#                 "isActive": False,
#                 "message": "The new password must be at least 8 characters long.",
#                 "data": None,
#             }

#         # Update password
#         user.set_password(new_password)
#         db.commit()

#         logging.info(f"Password reset successfully for user {email}")
#         return {
#             "success": True,
#             "status": 200,
#             "isActive": True,
#             "message": "Password reset successfully.",
#             "data": None,
#         }

#     except Exception as e:
#         logging.error(f"An error occurred during password reset: {e}")
#         db.rollback()
#         return {
#             "success": False,
#             "status": 500,
#             "isActive": False,
#             "message": "An unexpected error occurred. Please try again later.",
#             "data": None,
#         }