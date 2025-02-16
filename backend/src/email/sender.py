from fastapi_mail import FastMail, MessageSchema, MessageType
from .config import get_email_config
from typing import List, Dict
from app.schemas import (
    EmailSchema,
    EmailTemplateSchema,
    WelcomeEmailSchema,
    PasswordResetEmailSchema,
    EmailResponseSchema
)

class EmailSender:
    def __init__(self):
        self.config = get_email_config()
        self.fastmail = FastMail(self.config)

    async def send_email(
        self,
        subject: str,
        recipients: List[str],
        template_name: str,
        template_body: Dict
    ) -> EmailResponseSchema:
        try:
            message = MessageSchema(
                subject=subject,
                recipients=recipients,
                template_body=template_body,
                subtype=MessageType.html
            )

            await self.fastmail.send_message(
                message,
                template_name=template_name
            )

            return EmailResponseSchema(
                success=True,
                status=200,
                message="Email sent successfully",
                details={
                    "email": recipients[0],
                    "template": template_name
                }
            )
        except Exception as e:
            return EmailResponseSchema(
                success=False,
                status=500,
                message=str(e),
                details={
                    "email": recipients[0],
                    "template": template_name
                }
            )

    async def send_welcome_email(self, email: str, name: str) -> EmailResponseSchema:
        template_data = WelcomeEmailSchema(
            subject="Welcome to Our Platform!",
            template_name="welcome.html",
            template_body={
                "name": name,
                "email": email
            }
        )

        return await self.send_email(
            subject=template_data.subject,
            recipients=[email],
            template_name=template_data.template_name,
            template_body=template_data.template_body
        )

    async def send_password_reset_email(
        self,
        email: str,
        name: str,
        reset_token: str
    ) -> EmailResponseSchema:
        reset_link = f"https://yourapp.com/reset-password?token={reset_token}"
        
        template_data = PasswordResetEmailSchema(
            subject="Password Reset Request",
            template_name="password_reset.html",
            template_body={
                "name": name,
                "reset_link": reset_link
            }
        )

        return await self.send_email(
            subject=template_data.subject,
            recipients=[email],
            template_name=template_data.template_name,
            template_body=template_data.template_body
        )