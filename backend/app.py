from fastapi import FastAPI, HTTPException, Depends,Body
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from models.dept import Employee, Department, PerformanceMetrics ,EmployeeInput, EmployeeSummary,EmployeeResponse,EmployeesByDeptResponse
from models.updatesAndtask import  UpdateTask,AddComment
from models.project import Project,AddProjectRequest ,QuickLinks ,SRS
from models.clients import Client, ClientMetrics, ClientDocuments, ContactPerson, ClientEngagement ,BasicClientInput
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from bson import ObjectId
from jose import JWTError, jwt # type: ignore
from datetime import datetime, timedelta,date
import os
from dotenv import load_dotenv
import random


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient(os.environ.get("MONGODB_URL"))
db = client.ProjectManagementTool

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
        return {"emp":{
            "emp_id": employee.get("emp_id"),
            "emp_name": employee.get("emp_name"),
            "emp_dept": employee.get("emp_dept"),
            "role": employee.get("role")
        }  , "token":access_token
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
@app.get("/employees-bydept", response_model=EmployeesByDeptResponse)
async def get_employees_by_department(dept: str):
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
                performance_metrics=PerformanceMetrics(**emp.get("performance_metrics", {}))
            )
        )
    return EmployeesByDeptResponse(employees=employees, details=Department(**department) if department else None)

# ================= Add Employee to Department ====================
@app.post("/add-employee")
async def add_employee(employee_input: EmployeeInput):
    while True:
        random_id = f"EMP{random.randint(1000, 9999)}"
        existing_employee = await db.Employees.find_one({"emp_id": random_id})
        if not existing_employee:
            break

    employee = Employee(
        emp_id=random_id,
        emp_name=employee_input.emp_name,
        emp_dept=employee_input.emp_dept,
        role=employee_input.role,
        email=employee_input.email,
        password=employee_input.password,
        address=employee_input.address,
        contact=employee_input.contact,
        joined_on=employee_input.joined_on,
        hired_by=employee_input.hired_by,
        salary_monthly=employee_input.salary_monthly,
        bonus=0.0,
        salary_account=[],
        performance_metrics=PerformanceMetrics(completed_projects=0, ratings=0, remarks=""),
        status="Active",
        leaves_taken=0,
        current_projects=[],
        emergency_contact=employee_input.emergency_contact,
        bank_account_number=employee_input.bank_account_number,
        bank_ifsc=employee_input.bank_ifsc
    )

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

# ================== Update Employee Details =======================
@app.put("/employee/update")
async def update_employee(emp_id: str, data: dict = Body(...)):
    if not emp_id or not data:
        raise HTTPException(status_code=400, detail="Employee ID and update data are required.")

    # print(data)
    if "emp_id" in data:
        data.pop("emp_id")

    result = await db.Employees.update_one(
        {"emp_id": emp_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found.")

    return {"message": "Employee updated successfully.", "emp_id": emp_id}

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
        emp = await db.Employees.find_one({"emp_id": update["update_by"]}, {"password": 0})
        
        updateBy = {
            "emp_id": emp["emp_id"],
            "emp_name": emp["emp_name"],
            "role": emp["role"]
        }
        update["_id"] = str(update["_id"])
        update["update_by"] = updateBy
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
    # bug - tasks status if is done must not be sent
    tasks_cursor = db.Tasks.find({
        "members_assigned": {
            "$elemMatch": {"emp_id": emp_id}
        }
    })
    tasks = []
    async for task in tasks_cursor:
        task["_id"] = str(task["_id"])
        created_by = await db.Employees.find_one({"emp_id":task["created_by"]}, {"password": 0})
        emps = []
        for member in task["members_assigned"]:
            emp_id = member["emp_id"] if isinstance(member, dict) and "emp_id" in member else member
            emp = await db.Employees.find_one({"emp_id": emp_id}, {"password": 0})
            if emp:
                emps.append({
                    "emp_id": emp["emp_id"],
                    "status": member.get("status"),
                    "emp_name": emp["emp_name"],
                    "role": emp["role"]
                })
        task["members_assigned"] = emps
        task["created_by"] = {
                "emp_id":created_by["emp_id"],
                "emp_name":created_by["emp_name"],
                "role":created_by["role"]
            }
        if task["status"] != "done":
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

    # Initialize comments 
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
    emp_name = comment.emp_name
    comment_text = comment.comment_text
    if not emp_name or not task_id or not comment_text:
        raise HTTPException(status_code=400, detail="Employee ID, Task ID, and comment text are required.")
    
    comment = {
        "emp_name": emp_name,
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

# ================= get all projects - only for admin role ====================
@app.get("/get-projects")
async def get_projects():
    projects_cursor = db.Projects.find({})
    projects = []

    async for project in projects_cursor:
        project["_id"] = str(project["_id"])  

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

# ================= get projects by emp_id ====================
@app.get("/get-project-empid")
async def get_projects_byid(emp_id:str):
    if not emp_id:
        raise HTTPException(status_code=400, detail="Employee ID is required.")
    projects_cursor = db.Projects.find({
        "team_members.emp_id": emp_id
    })
    projects = []

    async for project in projects_cursor:
        project["_id"] = str(project["_id"])  

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
async def add_project(project_data: AddProjectRequest):
    
    # Auto-generate unique Project ID
    while True:
        random_id = f"PRJ{random.randint(1000, 9999)}"
        existing_project = await db.Projects.find_one({"project_id": random_id})
        if not existing_project:
            break
        
    client_data = await db.Clients.find_one({"client_id": project_data.client_details})
    member_objs = []
    for emp_id in project_data.team_members:
        emp = await db.Employees.find_one({"emp_id": emp_id})
        if emp:
            member_objs.append({
                "emp_id": emp["emp_id"],
                "name": emp["emp_name"],
                "role": emp["role"],
                'dept':emp["emp_dept"]
            })
    client_details = {"name": client_data["name"],"logo": client_data["logo_url"],"domain": client_data["industry"]}

    # Build the complete project object with default values
    project = Project(
        project_id=random_id,
        project_name=project_data.project_name,
        current_phase="Initiation",
        status='active',
        descp=project_data.descp,
        start_date=project_data.start_date,
        deadline=project_data.deadline,
        progress=0,
        team_members=member_objs,
        quick_links=QuickLinks(),
        client_details=client_details,
        features=[],
        srs=SRS(key_req=[]),
        project_status=[],
        issues_and_maintenance_reports=[],
        hosting_details=[],
        templates=[],
        links=[],
        financial_data=None,
        performance_metrics=None
    )

    await db.Projects.insert_one(project.dict())
    return {"message": "Project added successfully.", "project_id": random_id}


#================= Get Full single project details ============================
@app.get("/get-project")
async def get_project(project_id: str):
    if project_id is None:
        raise HTTPException(status_code=400, detail="Project ID is required.")

    project = await db.Projects.find_one({"project_id": project_id})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    project["_id"] = str(project["_id"])
    return project

#================= Get active project by emp_id  ============================
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
        project["_id"] = str(project["_id"])  

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


# ============= Get all Clients briefs =================
@app.get("/clients/briefs")
async def get_all_client_briefs():
    clients = await db.Clients.find().to_list(1000)
    brief_list = [{
        "client_id": c["client_id"],
        "name": c["name"],
        "logo_url": c.get("logo_url"),
        "domain": c.get("industry"),
        "type" : c.get("type")
    } for c in clients]

    return brief_list

# ============= Get all Clients details =================
@app.get("/clients")
async def get_all_clients():
    clients = await db.Clients.find().to_list(1000)
    return clients


# ============= Get particular Clients details =================
@app.get("/client/alldetails",response_model=Client)
async def get_all_details_client(client_id: str):
    if not client_id:
        raise HTTPException(status_code=400, detail="Client ID is required.")
    
    client = await db.Clients.find_one({"client_id": client_id},{"_id":0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")
    
    return client

# ============= Add new client =================
@app.post("/clients/add")
async def add_new_client(data: BasicClientInput):
    while True:
        random_id = f"CLT{random.randint(1000, 9999)}"
        existing = await db.Clients.find_one({"client_id": random_id})
        if not existing:
            break

    client_data = Client(
        client_id=random_id,
        name=data.name,
        brand_name=data.brand_name,
        logo_url=data.logo_url,
        type=data.type,
        industry=data.industry,
        location=data.location,
        joined_date = datetime.now(),
        website=data.website,
        business_id=data.business_id,

        primary_contact=ContactPerson(
            name=data.contact_name,
            email=data.contact_email,
            phone=data.contact_phone,
            designation=None,
            linkedin=None
        ),

        engagement=ClientEngagement(
            joined_date=datetime.utcnow(),
            source=data.source,
            onboarding_notes=None,
            tags=[]
        ),

        documents=ClientDocuments(), 
        metrics=ClientMetrics() 
    )

    await db.Clients.insert_one(client_data.dict())
    return {"message": "Client added successfully", "client_id": random_id}