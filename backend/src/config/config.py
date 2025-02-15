# src/config.py
import os

APPNAME = "Trust Connect"
VERSION = "v1"
SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey")  # Replace with a more secure secret in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 40  # Token expiry time in minutes

# Google Auth Cred
GOOGLE_CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]
GOOGLE_CLIENT_SECRET = os.environ['GOOGLE_CLIENT_SECRET']