import os
import tempfile
import uuid
from datetime import datetime, timedelta
from fastapi import UploadFile, HTTPException
from jose import jwt

# Firebase storage
bucket = None

def set_bucket(storage_bucket):
    """Initialize bucket from main app"""
    global bucket
    bucket = storage_bucket

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 12


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def upload_file_to_firebase(file: UploadFile, folder: str) -> str:
    try:
        allowed_extensions = [".pdf", ".docx", ".xlsx", ".xls", ".csv", ".txt", ".png", ".jpg", ".jpeg"]
        file_ext = os.path.splitext(file.filename)[1].lower()

        if file_ext not in allowed_extensions:
            raise ValueError(f"Unsupported file type: {file_ext}")

        unique_name = f"{uuid.uuid4().hex}{file_ext}"
        blob_path = f"{folder}/{unique_name}"
        blob = bucket.blob(blob_path)

        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            tmp.seek(0)
            blob.upload_from_filename(tmp.name, content_type=file.content_type)

        blob.make_public()
        return blob.public_url

    except ValueError as ve:
        raise RuntimeError(f"File validation error: {ve}")
    except Exception as e:
        raise RuntimeError(f"Failed to upload file: {str(e)}")
