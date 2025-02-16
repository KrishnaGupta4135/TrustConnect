from fastapi_mail import ConnectionConfig
from pydantic import BaseSettings
from functools import lru_cache
from config import (
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_FROM,
    MAIL_PORT,
    MAIL_SERVER,
    MAIL_STARTTLS,
    MAIL_SSL_TLS,
    USE_CREDENTIALS
)

class EmailSettings(BaseSettings):
    MAIL_USERNAME: str = MAIL_USERNAME
    MAIL_PASSWORD: str = MAIL_PASSWORD
    MAIL_FROM: str = MAIL_FROM
    MAIL_PORT: int = MAIL_PORT
    MAIL_SERVER: str = MAIL_SERVER
    MAIL_STARTTLS: bool = MAIL_STARTTLS
    MAIL_SSL_TLS: bool = MAIL_SSL_TLS
    USE_CREDENTIALS: bool = USE_CREDENTIALS

@lru_cache()
def get_email_config():
    settings = EmailSettings()
    return ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        USE_CREDENTIALS=settings.USE_CREDENTIALS,
        TEMPLATE_FOLDER='app/email/templates'
    )