from fastapi import File, UploadFile, HTTPException
import os
import boto3
import uuid
from api.config import S3_BUCKET_NAME

load_dotenv()
AWS_ACCESS_KEY_ID = os.getenv('aws_access_key_id')
AWS_SECRET_ACCESS_KEY = os.getenv('aws_secret_access_key')
AWS_REGION = os.getenv('aws_region')

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def upload_file_to_s3(file: UploadFile, file_name: str) -> str:
    """
    Uploads a file to S3 and returns the file URL.
    Replace this with your actual S3 upload logic.
    """
    try:
        s3_client.upload_fileobj(file.file, S3_BUCKET_NAME, file_name)
        return f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{file_name}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

def delete_file_from_s3(file_name: str):
    """
    Deletes a file from S3.
    Replace this with your actual S3 delete logic.
    """
    try:
        s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=file_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete image: {str(e)}")

async def upload_image(prefix: str, file: UploadFile = File(...)):
    file_extension = file.filename.split(".")[-1] if "." in file.filename else ""
    allowed_extensions = {"jpg", "jpeg", "png", "gif"}

    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Allowed: jpg, jpeg, png, gif")
    
    # Generate a unique file name using UUID
    unique_id = str(uuid.uuid4())

    # Add the prefix to the file name
    file_name = f"{prefix}/{unique_id}.{file_extension}"

    # Upload the file to S3
    file_url = upload_file_to_s3(file, file_name)
    return file_url

async def delete_image(prefix: str, file_name: str):
    file_name = file_name.replace(f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/", "")
    # Ensure the file_name includes the "post-pictures/" prefix
    if not file_name.startswith(f"{prefix}/"):
        raise HTTPException(
            status_code=400,
            detail=f"File name must start with '{prefix}/'"
        )
    
    # Delete the file from S3
    delete_file_from_s3(file_name)
    
    return {"message": "Image deleted successfully"}