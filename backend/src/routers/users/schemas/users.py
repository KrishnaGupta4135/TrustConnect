from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import enum



    
# Enum for user status
class UserStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    

class UserResponseData(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    profile_path: Optional[str] = None
    status: Optional[str] = None
    role: Optional[str] = None  # Add role if necessary for admins

    class Config:
        orm_mode = True

# Request schema for updating the profile path
class UpdateProfilePathRequest(BaseModel):
    profile_path: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone_number: Optional[str]
    profile_path: Optional[str]

    class Config:
        orm_mode = True

class UserRoleEnum(str, enum.Enum):
    admin = "admin"
    user = "user"

class UserStatusEnum(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class CreateUserSchema(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr
    phone_number: Optional[str] = Field(None, pattern=r"^\+?[1-9]\d{1,14}$")  # Use pattern instead of regex
    password: str = Field(..., min_length=8)
    profile_path: Optional[str] = "profile_pictures/default.png"
    status: UserStatusEnum = UserStatusEnum.active
    

class LoginSchema(BaseModel):
    email: str
    password : str


class OTPVerificationRequest(BaseModel):
    email: EmailStr
    otp_code: str

class OTPResponse(BaseModel):
    message: str
    expires_at: datetime


class TokenResponse(BaseModel):
    success: bool
    status: int
    isActive: bool
    message: str
    data: Optional[dict]  # Data can be None or a dictionary

# Define a specific data model for login response
class LoginResponseData(BaseModel):
    email: str
    requires_otp: bool

# Define a specific data model for token response
class TokenResponseData(BaseModel):
    email: str
    access_token: str
    refresh_token: str
    token_type: str
    
class UserData(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_path: Optional[str]
    role : Optional[str] = None
    status: str

    class Config:
        orm_mode = True  # Ensures compatibility with SQLAlchemy models
        # Ensure that datetime fields are serialized as strings
        json_encoders = {
            datetime: lambda v: v.isoformat()  # Converts datetime to ISO 8601 string format
        }


class UserResponse(BaseModel):
    success: bool
    status: int
    isActive: bool
    message: str
    data: UserData

class UserProfilePathResponse(BaseModel):
    success: bool
    status: int
    message: str
    data: dict

class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str
    
class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str



# Email related schemas
class EmailSchema(BaseModel):
    """Base schema for email data"""
    email: List[EmailStr]
    body: dict

class EmailTemplateSchema(BaseModel):
    """Schema for email template data"""
    subject: str
    template_name: str
    template_body: dict

class WelcomeEmailSchema(EmailTemplateSchema):
    """Schema specifically for welcome emails"""
    class Config:
        schema_extra = {
            "example": {
                "subject": "Welcome to Our Platform!",
                "template_name": "welcome.html",
                "template_body": {
                    "name": "John Doe",
                    "email": "john@example.com"
                }
            }
        }

class PasswordResetEmailSchema(EmailTemplateSchema):
    """Schema for password reset emails"""
    class Config:
        schema_extra = {
            "example": {
                "subject": "Password Reset Request",
                "template_name": "password_reset.html",
                "template_body": {
                    "name": "John Doe",
                    "reset_link": "https://yourapp.com/reset-password?token=xyz"
                }
            }
        }

class EmailResponseSchema(BaseModel):
    """Schema for email sending response"""
    success: bool
    status: int
    message: str
    details: Optional[dict] = None

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "status": 200,
                "message": "Email sent successfully",
                "details": {
                    "email": "user@example.com",
                    "template": "welcome.html"
                }
            }
        }
