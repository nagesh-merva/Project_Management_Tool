import random
from datetime import datetime, date
from typing import Optional, List
from fastapi import HTTPException, UploadFile, File, Form
from pydantic import EmailStr
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.dept import Employee, EmployeeSummary, EmpPerformanceMetrics, EmployeeResponse, EmployeesByDeptResponse, EmpDocuments, PromotionInput, Department
from .utils import upload_file_to_firebase

db: AsyncIOMotorDatabase = None

def set_db(database: AsyncIOMotorDatabase):
    """Initialize database from main app"""
    global db
    db = database


async def get_all_employees() -> List[EmployeeSummary]:
    """Get all employees summary"""
    employees_cursor = db.Employees.find({})
    employees = []
    async for emp in employees_cursor:
        employees.append(
            EmployeeSummary(
                emp_id=emp["emp_id"],
                emp_name=emp["emp_name"],
                role=emp["role"],
                profile=emp.get("profile", ""),
                performance_metrics=EmpPerformanceMetrics(**emp.get("performance_metrics", {}))
            )
        )
    return employees


async def get_employees_by_department(dept: str) -> EmployeesByDeptResponse:
    """Get all employees by department"""
    if dept is None:
        raise HTTPException(status_code=400, detail="Department is required.")

    department = await db.Departments.find_one({"dept_id": dept})
    employees_cursor = db.Employees.find({"emp_dept": dept})
    employees = []
    async for emp in employees_cursor:
        employees.append(
            EmployeeSummary(
                emp_id=emp["emp_id"],
                emp_name=emp["emp_name"],
                role=emp["role"],
                profile=emp.get("profile", ""),
                performance_metrics=EmpPerformanceMetrics(**emp.get("performance_metrics", {}))
            )
        )
    return EmployeesByDeptResponse(employees=employees, details=Department(**department) if department else None)


async def add_employee(
        emp_name: str = Form(...),
        emp_dept: str = Form(...),
        role: str = Form(...),
        email: EmailStr = Form(...),
        password: str = Form(...),
        address: str = Form(...),
        contact: str = Form(...),
        joined_on: datetime = Form(...),
        hired_by: str = Form(...),
        salary_monthly: float = Form(...),
        emergency_contact: Optional[str] = Form(None),
        bank_account_number: Optional[str] = Form(None),
        bank_ifsc: Optional[str] = Form(None),
        profile: UploadFile = File(...)
    ):
    """Add new employee to department"""
    while True:
        random_id = f"EMP{random.randint(1000, 9999)}"
        if not await db.Employees.find_one({"emp_id": random_id}):
            break

    existing_Employees = await db.Employees.find({}).to_list(1000)    
    for Emp in existing_Employees:
        if Emp.get("emp_name") == emp_name or Emp.get("email") == email or Emp.get("bank_account_number") == bank_account_number:
            raise HTTPException(
                status_code=409,
                detail=f"Employee already exists.",
                headers={"X-Frontend-Message": f"Employee already exists."}
            )  
            
    profile_url = await upload_file_to_firebase(profile, folder="PMT/employee_profiles")

    employee = Employee(
        emp_id=random_id,
        emp_name=emp_name,
        emp_dept=emp_dept,
        role=role,
        email=email,
        profile=profile_url,
        password=password,
        address=address,
        contact=contact.strip(),
        joined_on=joined_on,
        hired_by=hired_by,
        salary_monthly=salary_monthly,
        bonus=0.0,
        salary_account=[],
        emp_documents= [],
        performance_metrics=EmpPerformanceMetrics(completed_projects=0, ratings=0, remarks=""),
        status="Active",
        leaves_taken=0,
        current_projects=[],
        emergency_contact=emergency_contact,
        bank_account_number=bank_account_number,
        bank_ifsc=bank_ifsc,
        promotion_record=[]
    )

    await db.Employees.insert_one(employee.dict())

    # Update employee count in department
    await db.Departments.update_one(
        {"dept_id": emp_dept},
        {"$inc": {"no_of_employees": 1}}
    )

    return {"message": "Employee added successfully.", "assigned_emp_id": employee.emp_id}


async def get_employee(emp_id: Optional[str] = None) -> EmployeeResponse:
    """Get single employee details"""
    if emp_id is None:
        raise HTTPException(status_code=400, detail="Employee ID is required.")

    employee = await db.Employees.find_one({"emp_id": emp_id}, {"password": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")

    # Convert joined_on datetime to date if needed
    if "joined_on" in employee and isinstance(employee["joined_on"], datetime):
        employee["joined_on"] = employee["joined_on"].date()
        
    emp_projects =[]    
        
    for proj in employee.get("current_projects", []):
        proj_details = await db.Projects.find_one({"project_id": proj})
        project_info ={}
        if proj_details:
            project_info["project_name"] = proj_details.get("project_name", "Unknown Project")
            client = proj_details.get("client_details")
            project_info["client_name"] = client["name"] if client and "name" in client else "unknown Client"
        else:
            project_info["project_name"] = "Unknown Project"
            project_info["client_name"] = "unknown Client"
        emp_projects.append(project_info)
    
    employee["current_projects"] = emp_projects    

    return employee


async def update_employee(emp_id: str, data: dict):
    """Update employee details"""
    if not emp_id or not data:
        raise HTTPException(status_code=400, detail="Employee ID and update data are required.")

    if "emp_id" in data:
        data.pop("emp_id")

    result = await db.Employees.update_one(
        {"emp_id": emp_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found.")

    return {"message": "Employee updated successfully.", "emp_id": emp_id}


async def add_emp_documents(emp_id: str = Form(...), file: UploadFile = File(...)):
    """Add documents to employee"""
    if not emp_id or not file:
        raise HTTPException(status_code=400, detail="Employee ID and file are required.")

    emp = await db.Employees.find_one({"emp_id": emp_id})
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found.")

    doc_url = await upload_file_to_firebase(file, folder=f"PMT/employee_documents/{emp_id}")

    document = EmpDocuments(
        doc_type=file.filename.split('.')[-1],
        doc_name=file.filename,
        doc_url=doc_url,
        uploaded_at=datetime.utcnow()
    )

    result = await db.Employees.update_one(
        {"emp_id": emp_id},
        {"$addToSet": {"emp_documents": document.dict()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found.")

    return {"message": "Document added successfully.", "doc_url": doc_url}


async def get_emp_dashboard_metrics(emp_id: str):
    """Get employee dashboard metrics"""
    if not emp_id:
        raise HTTPException(status_code=400, detail="Employee Id Required")
    
    employee = await db.Employees.find_one({"emp_id": emp_id})
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    joined_date = employee.get("joined_on")
    if isinstance(joined_date, dict) and "$date" in joined_date:
        joined_date = datetime.fromisoformat(joined_date["$date"].replace("Z", "+00:00"))
    elif isinstance(joined_date, str):
        joined_date = datetime.fromisoformat(joined_date.replace("Z", "+00:00"))
    else:
        joined_date = joined_date if joined_date else datetime.now()
    
    years_of_service = round((datetime.now() - joined_date).days / 365.25, 1)
    
    metrics = {
        "completedProjects": employee.get("performance_metrics", {}).get("completed_projects", 0),
        "performanceRating": employee.get("performance_metrics", {}).get("ratings", 0.0),
        "activeProjects": len(employee.get("current_projects", [])),
        "leavesTaken": employee.get("leaves_taken", 0),
        "yearsOfService": years_of_service,
        "monthlySalary": employee.get("salary_monthly", 0)
    }
    
    return {
        "success": True,
        "data": metrics,
        "message": "Dashboard metrics retrieved successfully"
    }


async def add_emp_promotion(data: PromotionInput):
    """Add promotion record to employee"""
    employee = await db.Employees.find_one({"emp_id": data.emp_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    prev_role = employee["role"]
    prev_salary = employee["salary_monthly"]
    joined_on = employee["joined_on"]

    if not employee.get("promotion_record") or employee.get("promotion_record") == []:
        working_as_from = datetime.combine(joined_on.date(), datetime.min.time())
    else:
        working_as_from = datetime.combine(date.today(), datetime.min.time())

    promotion_entry = {
        "prev_role": prev_role,
        "prev_salary": prev_salary,
        "working_as_from": working_as_from
    }

    if not employee.get("promotion_record"):
        update_data = {
            "$set": {
                "role": data.role,
                "salary_monthly": data.salary,
                "promotion_record": [promotion_entry]
            }
        }
    else:
        update_data = {
            "$set": {
                "role": data.role,
                "salary_monthly": data.salary
            },
            "$push": {
                "promotion_record": promotion_entry
            }
        }
        
    print("Promoting employee with id ", data.emp_id, " to ", update_data)
    result = await db.Employees.update_one({"emp_id": data.emp_id}, update_data)

    print("\n", result)

    return {"message": "Promotion recorded successfully", "emp_id": data.emp_id}
