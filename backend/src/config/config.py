# src/config.py
import os
from dotenv import load_dotenv
load_dotenv()

APPNAME = "Trust Connect"
VERSION = "v1"
SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey")  # Replace with a more secure secret in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 40  # Token expiry time in minutes
# Email Configuration
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_STARTTLS = True
MAIL_SSL_TLS = False
USE_CREDENTIALS = True

# Google Auth Cred
GOOGLE_CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]
GOOGLE_CLIENT_SECRET = os.environ['GOOGLE_CLIENT_SECRET']