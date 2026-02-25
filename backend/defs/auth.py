from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from .utils import create_access_token

db: AsyncIOMotorDatabase = None

def set_db(database: AsyncIOMotorDatabase):
    """Initialize database from main app"""
    global db
    db = database


async def login(form_data):
    """Authenticate user and return JWT token"""
    emp_id = form_data.username
    password = form_data.password

    employee = await db.Employees.find_one({"emp_id": emp_id})
    if employee and employee.get("password") == password:
        # Create JWT token
        access_token = create_access_token(
            data={"sub": emp_id}
        )
        return {"emp":{
            "emp_id": employee.get("emp_id"),
            "emp_name": employee.get("emp_name"),
            "emp_dept": employee.get("emp_dept"),
            "profile": employee.get("profile"),
            "role": employee.get("role")
        }  , "token": access_token
        }

    raise HTTPException(status_code=401, detail="Invalid credentials")
