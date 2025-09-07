import boto3
from botocore.exceptions import ClientError
import os
import logging

logger = logging.getLogger(__name__)

# Initialize SES client
ses_client = boto3.client(
    'ses',
    region_name=os.getenv('AWS_REGION', 'us-east-2')
)

async def send_verification_email(email: str, verification_token: str, username: str):
    """Send verification email using AWS SES"""
    verification_link = f"https://www.bthfitness.org/verify-email?token={verification_token}"
    
    subject = "Verify your BTH Fitness account"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }}
            .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; }}
            .header {{ text-align: center; color: #333; margin-bottom: 30px; }}
            .button {{ display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
            .footer {{ font-size: 12px; color: #666; margin-top: 30px; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="header">Welcome to BTH Fitness, {username}!</h1>
            <p>Thank you for joining our veterans community. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
                <a href="{verification_link}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="{verification_link}">{verification_link}</a></p>
            <div class="footer">
                <p>If you didn't create this account, please ignore this email.</p>
                <p>This link will expire in 24 hours for security reasons.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_body = f"""
    Welcome to BTH Fitness, {username}!
    
    Thank you for joining our veterans community. Please verify your email address by visiting this link:
    
    {verification_link}
    
    If you didn't create this account, please ignore this email.
    This link will expire in 24 hours for security reasons.
    """
    
    try:
        response = ses_client.send_email(
            Source='noreply@bthfitness.org',
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {
                    'Text': {'Data': text_body, 'Charset': 'UTF-8'},
                    'Html': {'Data': html_body, 'Charset': 'UTF-8'}
                }
            }
        )
        logger.info(f"Verification email sent to {email}, MessageId: {response['MessageId']}")
        return True
        
    except ClientError as e:
        logger.error(f"Failed to send email to {email}: {e}")
        return False