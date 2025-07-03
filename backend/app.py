from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from models.dept import Employee, Department, PerformanceMetrics , EmployeeSummary,EmployeeResponse
from models.updatesAndtask import  UpdateTask,AddComment
from models.project import Project
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from bson import ObjectId
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import random

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient(os.environ.get("MONGODB_URL"))
db = client.ProjectManagementTool

SECRET_KEY = os.environ.get("SECRET_KEY")  # Replace with a strong key and keep it safe
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 12

# Dummy in-memory password storage for example
# You should use proper hashing and validation later
password_store = {}

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ================= Authentication ====================
@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    emp_id = form_data.username
    password = form_data.password

    employee = await db.Employees.find_one({"emp_id": emp_id})
    if employee and employee.get("password") == password:
        # Create JWT token
        access_token = create_access_token(
            data={"sub": emp_id}
        )
        return {
            "emp_id": employee.get("emp_id"),
            "emp_name": employee.get("emp_name"),
            "emp_dept": employee.get("emp_dept"),
            "role": employee.get("role"),
            "token": access_token,
            "token_type": "bearer"
        }

    raise HTTPException(status_code=401, detail="Invalid credentials")


# ================= Get All Employees ====================
@app.get("/all-employees", response_model=List[EmployeeSummary])
async def get_all_employees():
    employees_cursor = db.Employees.find({})
    employees = []
    async for emp in employees_cursor:
        employees.append(
            EmployeeSummary(
                emp_id=emp["emp_id"],
                emp_name=emp["emp_name"],
                role=emp["role"],
                performance_metrics=PerformanceMetrics(**emp.get("performance_metrics", {}))
            )
        )
    return employees


# ================= Get all Employees by Department ====================
@app.get("/employees", response_model=List[EmployeeSummary])
async def get_employees_by_department(dept_id: Optional[str] = None):
    if dept_id is None:
        raise HTTPException(status_code=400, detail="Department ID is required.")

    employees_cursor = db.Employees.find({"emp_dept": dept_id})
    employees = []
    async for emp in employees_cursor:
        employees.append(
            EmployeeSummary(
                emp_id=emp["emp_id"],
                emp_name=emp["emp_name"],
                role=emp["role"],
                performance_metrics=emp["performance_metrics"]
            )
        )
    return employees

# ================= Add Employee to Department ====================
from datetime import datetime, date

@app.post("/add-employee")
async def add_employee(employee: Employee):
    while True:
        random_id = f"EMP{random.randint(1000, 9999)}"
        existing_employee = await db.Employees.find_one({"emp_id": random_id})
        if not existing_employee:
            break 

    employee.emp_id = random_id  # Assign the generated ID

    employee_dict = employee.dict()

    if isinstance(employee_dict['joined_on'], date):
        employee_dict['joined_on'] = datetime.combine(employee_dict['joined_on'], datetime.min.time())

    await db.Employees.insert_one(employee_dict)

    await db.Departments.update_one(
        {"dept_id": employee.emp_dept},
        {"$inc": {"no_of_employees": 1}}
    )

    return {"message": "Employee added successfully.", "assigned_emp_id": employee.emp_id}



# ================= Get Single Employee Details ====================
@app.get("/employee", response_model=EmployeeResponse)
async def get_employee(emp_id: Optional[str] = None):
    if emp_id is None:
        raise HTTPException(status_code=400, detail="Employee ID is required.")

    employee = await db.Employees.find_one({"emp_id": emp_id},{"password":0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found.")
    return employee


# ================= Get All Updates ====================
@app.get("/get-updates")
async def get_updates(emp_id: str):
    if emp_id is None:
        raise HTTPException(status_code=400, detail="Employee ID is required.")
    updates_cursor = db.Updates.find({
        "$or": [
            {"to": "all"},
            {"to": emp_id},
            {"to": {"$elemMatch": {"$eq": emp_id}}}
        ]
    })
    updates = []
    async for update in updates_cursor:
        update["_id"] = str(update["_id"])
        updates.append(update)

    return updates

# ================= Add Update ====================
@app.post("/add-update")
async def add_update(update_data: dict):
    update_data["created_on"] = datetime.utcnow()
    while True:
        random_id = f"UPDATE{random.randint(1000, 9999)}"
        existing_task = await db.Updates.find_one({"id": random_id})
        if not existing_task:
            break
    update_data["id"] = random_id
    await db.Updates.insert_one(update_data)
    return {"message": "Update added successfully."}

# ================= Get Tasks Assigned to Employee ====================
@app.get("/get-tasks")
async def get_tasks(emp_id: str):
    if emp_id is None:
        raise HTTPException(status_code=400, detail="Employee ID is required.")
    
    tasks_cursor = db.Tasks.find({
        "members_assigned": {
            "$elemMatch": {"emp_id": emp_id}
        }
    })
    tasks = []
    async for task in tasks_cursor:
        task["_id"] = str(task["_id"])
        if task["status"] != "done" :
            tasks.append(task)

    return tasks


# ================= Add Task ====================
@app.post("/add-task")
async def add_task(task_data: dict):
    # Auto-generate unique Task ID
    while True:
        random_id = f"TASK{random.randint(1000, 9999)}"
        existing_task = await db.Tasks.find_one({"task_id": random_id})
        if not existing_task:
            break

    task_data["task_id"] = random_id
    task_data["created_on"] = datetime.utcnow()
    task_data["status"] = "assigned"

    # Format members_assigned to include individual status
    task_data["members_assigned"] = [{"emp_id": emp_id, "status": "assigned"} for emp_id in task_data["members_assigned"]]

    # Initialize comments if not provided
    if "comments" not in task_data:
        task_data["comments"] = []

    await db.Tasks.insert_one(task_data)

    return {"message": "Task added successfully.", "assigned_task_id": random_id}


# ================= Update Tasks Status ====================
@app.put("/update-task-status")
async def update_task_status(update: UpdateTask):
    task_id = update.task_id
    emp_id = update.emp_id
    status = update.status

    if status not in ["assigned", "done", "uncomplete"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be 'assigned', 'done', or 'uncomplete'.")
    if not emp_id or not task_id:
        raise HTTPException(status_code=400, detail="Employee ID and Task ID are required.")
    
    await db.Tasks.update_one(
        {"task_id": task_id, "members_assigned.emp_id": emp_id},
        {"$set": {"members_assigned.$.status": status}}
    )

    # Check if all are completed
    task = await db.Tasks.find_one({"task_id": task_id})
    if task:
        statuses = [member["status"] for member in task["members_assigned"]]
        if all(s == "done" for s in statuses):
            await db.Tasks.update_one(
                {"task_id": task_id},
                {"$set": {"status": "done"}}
            )

    return {"message": f"Status updated for emp_id {emp_id} in task {task_id}"}

# ================= Add Comments to task ====================
@app.put("/add-comment")
async def add_comment(comment:AddComment):
    task_id = comment.task_id
    emp_id = comment.emp_id 
    comment_text = comment.comment_text
    if not emp_id or not task_id or not comment_text:
        raise HTTPException(status_code=400, detail="Employee ID, Task ID, and comment text are required.")
    
    comment = {
        "emp_id": emp_id,
        "comment": comment_text,
        "commented_on": datetime.utcnow()
    }

    result = await db.Tasks.update_one(
        {"task_id": task_id},
        {"$push": {"comments": comment}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found.")

    return {"message": "Comment added successfully.", "task_id": task_id}

# ================= get projects ====================
@app.get("/get-projects")
async def get_projects():
    projects_cursor = db.Projects.find({})
    projects = []

    async for project in projects_cursor:
        project["_id"] = str(project["_id"])  # Convert ObjectId for JSON compatibility

        projects.append({
            "project_id": project["project_id"],
            "project_name": project["project_name"],
            "current_phase": project["current_phase"],
            "progress":project["progress"],
            "status": project["status"],
            "descp": project["descp"],
            "start_date": project["start_date"],
            "deadline": project["deadline"],
            "team_members": project["team_members"],
            "quick_links": project["quick_links"]
        })

    return projects

# ================= Add new Project ====================

@app.post("/add-project")
async def add_project(project: Project):
    # Auto-generate unique Project ID
    while True:
        random_id = f"PRJ{random.randint(1000, 9999)}"
        existing_project = await db.Projects.find_one({"project_id": random_id})
        if not existing_project:
            break

    project.project_id = random_id
    await db.Projects.insert_one(project.dict())

    return {"message": "Project added successfully.", "project_id": random_id}

#================= Get Full single project details
@app.get("/get-project")
async def get_project(project_id: str):
    if project_id is None:
        raise HTTPException(status_code=400, detail="Project ID is required.")

    project = await db.Projects.find_one({"project_id": project_id})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    project["_id"] = str(project["_id"])  # Convert ObjectId for JSON compatibility
    return project

@app.get("/get-active-projects")
async def get_active_projects(emp_id: str):
    if not emp_id:
        raise HTTPException(status_code=400, detail="Employee ID is required.")

    # Find all active projects where emp_id is assigned in any feature
    projects_cursor = db.Projects.find({
        "status": "active",
        "team_members.emp_id": emp_id
    })

    active_projects = []
    async for project in projects_cursor:
        project["_id"] = str(project["_id"])  # Convert ObjectId for JSON serialization

        active_projects.append({
            "project_id": project["project_id"],
            "project_name": project["project_name"],
            "current_phase": project["current_phase"],
            "status": project["status"],
            "descp": project["descp"],
            "start_date": project["start_date"],
            "deadline": project["deadline"],
            "team_members": project["team_members"],
            "quick_links": project["quick_links"],
            "progress": project.get("progress", 0)
        })

    return active_projects
