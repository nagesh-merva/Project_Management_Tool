from bson import ObjectId
from fastapi import FastAPI, HTTPException, Depends,Body, Response ,UploadFile , File,Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorClient
from models.reports import Report, ReportCreate , ReportType
from models.dept import Department, EmpPerformanceMetrics ,EmployeeInput, EmployeeSummary,EmployeeResponse,EmployeesByDeptResponse ,EmpDocuments ,Employee ,PromotionInput
from models.updatesAndtask import  UpdateTask,AddComment
from models.project import Project,AddProjectRequest ,QuickLinks ,SRS ,FinancialData,PerformanceMetrics,ProjectPhaseUpdate
from models.clients import Client, ClientMetrics, ClientDocuments, ContactPerson, ClientEngagement ,BasicClientInput,UpdateClientInput ,ClientDocuments ,ClientNote
from models.goals import Goal, CreateGoalInput, UpdateGoalInput, AddProgressInput, AddMilestoneInput, UpdateMilestoneInput, AddAuditInput,GoalResponse, GoalSummary, ProgressEntry, AuditEntry, Milestone, Risk
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from calendar import monthrange
from pydantic import EmailStr
# from bson import ObjectId
from jose import JWTError, jwt # type: ignore
from datetime import datetime, timedelta,date ,timezone ,time
import firebase_admin # type: ignore
from firebase_admin import credentials, storage # type: ignore
import os
import tempfile
from dotenv import load_dotenv
import random
import string
import uuid

load_dotenv()

app = FastAPI()
timezone
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

FIREBASE_BUCKET_NAME = os.environ.get("FIREBASE_BUCKET_NAME")

cred = credentials.Certificate("/etc/secrets/firebase-adminsdk.json")

firebase_admin.initialize_app(cred, {
    'storageBucket': FIREBASE_BUCKET_NAME
})

bucket = storage.bucket()


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
        allowed_extensions = [".pdf", ".docx", ".xlsx", ".xls", ".csv", ".txt",".png", ".jpg", ".jpeg"]
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
            "profile": employee.get("profile"),
            "role": employee.get("role")
        }  , "token":access_token
        }

    raise HTTPException(status_code=401, detail="Invalid credentials")

# ================= Get all  Department ====================
@app.get("/all-dept-brief")
async def get_edepartments():

    departments = db.Departments.find({})
    depts = []
    async for dept in departments:
        depts.append(
            {
                "depy_id":dept["dept_id"],
                "dept_name":dept["dept_name"],
            }
        )
    return depts


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
                profile=emp.get("profile", ""),
                performance_metrics=EmpPerformanceMetrics(**emp.get("performance_metrics", {}))
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
                profile=emp.get("profile", ""),
                performance_metrics=EmpPerformanceMetrics(**emp.get("performance_metrics", {}))
            )
        )
    return EmployeesByDeptResponse(employees=employees, details=Department(**department) if department else None)

# ================= Add Employee to Department ====================
@app.post("/add-employee")
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

    #print(profile_url)

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

# ================= Get Single Employee Details ====================
@app.get("/employee", response_model=EmployeeResponse)
async def get_employee(emp_id: Optional[str] = None):
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

# ================== Update Employee Details =======================
@app.put("/employee/update")
async def update_employee(emp_id: str, data: dict = Body(...)):
    if not emp_id or not data:
        raise HTTPException(status_code=400, detail="Employee ID and update data are required.")

    # #print(data)
    if "emp_id" in data:
        data.pop("emp_id")

    result = await db.Employees.update_one(
        {"emp_id": emp_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found.")

    return {"message": "Employee updated successfully.", "emp_id": emp_id}

# ================== add Emp Documents =======================
@app.post("/add-emp-documents")
async def add_emp_documents(emp_id: str = Form(...), file: UploadFile = File(...)):
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

# ================== Employee Dashboard Metrics =======================
@app.get("/dashboard-metrics")
async def emp_dashboard_metrics(emp_id: str):
    if not emp_id:
        raise HTTPException(status_code=400, detail="Employee Id Required")
    
    employee = await db.Employees.find_one({"emp_id": emp_id})
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    from datetime import datetime
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
    
# ================== add Employee promotion =======================
@app.post("/add-emp-promotion")
async def add_emp_promotion(data: PromotionInput):
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
        
    print("Promoting employee with id ",data.emp_id ," to " ,update_data)
    result = await db.Employees.update_one({"emp_id": data.emp_id}, update_data)

    print("\n",result)

    return {"message": "Promotion recorded successfully", "emp_id": data.emp_id}


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
    if update_data is None or not update_data.get("to"):
        raise HTTPException(status_code=400, detail="Update data and recipients are required.")
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
                    "role": emp["role"],
                })
        task["members_assigned"] = emps
        task["created_by"] = {
                "emp_id":created_by["emp_id"],
                "emp_name":created_by["emp_name"],
                "role":created_by["role"],
                "profile": created_by.get("profile", "")
            }
        if task["status"] != "done":
            tasks.append(task)

    return tasks


# ================= Add Task ====================
@app.post("/add-task")
async def add_task(task_data: dict):
    if task_data is None or not task_data.get("members_assigned"):
        raise HTTPException(status_code=400, detail="Task data and members assigned are required.")
    while True:
        random_id = f"TASK{random.randint(1000, 9999)}"
        existing_task = await db.Tasks.find_one({"task_id": random_id})
        if not existing_task:
            break

    task_data["task_id"] = random_id
    task_data["created_on"] = datetime.utcnow()
    task_data["status"] = "assigned"

    task_data["members_assigned"] = [{"emp_id": emp_id, "status": "assigned"} for emp_id in task_data["members_assigned"]]

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
async def get_projects(role: str):
    projects_cursor = db.Projects.find({})
    projects = []
    if role not in ["Admin", "Manager", "Founder", "Co-Founder"]:
        raise HTTPException(status_code=403, detail="You do not have permission to view all projects.")

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
        try:
            if project["deadline"] < datetime.now() and project["status"] == "active":
                project["status"] = "delayed"
        except ValueError:
            print("Invalid deadline format:", project["deadline"])
            project["status"] = "unknown"

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
                'dept':emp["emp_dept"],
                'profile': emp.get("profile", "")
            })
    client_details = { "client_id":client_data["client_id"],"name": client_data["name"],"logo": client_data["logo_url"],"domain": client_data["industry"]}

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
        financial_data=FinancialData(),
        performance_metrics=PerformanceMetrics()
    )

    await db.Clients.update_one(
        {"client_id": project_data.client_details},
        {
            "$inc": {"metrics.total_projects": 1},
            "$set": {"metrics.last_project_date": datetime.utcnow()}
        }
    )
    await db.Projects.insert_one(project.dict())
    
    await db.Employees.update_one(
        {"emp_id": emp_id},
        {"$addToSet": {"current_projects": random_id}}
    )
    
    return {"message": "Project added successfully.", "project_id": random_id}


#================= Get Full single project details ============================
@app.get("/get-project")
async def get_project(project_id: str):
    if project_id is None:
        raise HTTPException(status_code=400, detail="Project ID is required.")

    project = await db.Projects.find_one({"project_id": project_id})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    
    try:
        # print(project["deadline"] > datetime.now(), project["deadline"], datetime.now())
        if project["deadline"] < datetime.now() and project["status"] == "active":
            project["status"] = "delayed"
    except ValueError:
        print("Invalid deadline format:", project["deadline"])
        project["status"] = "unknown"


    project["_id"] = str(project["_id"])
    return project

#================= Get active project by emp_id  ============================
@app.get("/get-active-projects")
async def get_active_projects(emp_id: str):
    if not emp_id:
        raise HTTPException(status_code=400, detail="Employee ID is required.")

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

#================= Edit Project Brief details by project_id  ============================
@app.post("/edit-project-brief")
async def edit_project_brief(data: dict):
    project_id = data.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="Project ID is required.")
    
    project = await db.Projects.find_one({"project_id": project_id})
    
    if not project:
        raise HTTPException(status_code=400, detail="Project doesnt exist, error finding project!.")

    update_fields = {}
    
    # print(data)

    if "descp" in data and data["descp"]:
        update_fields["descp"] = data["descp"]
    
    if "deadline" in data and data["deadline"]:
        try:
            update_fields["deadline"] = datetime.fromisoformat(data["deadline"].replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format")

    if "status" in data and data["status"]:
        if data["status"] == "completed":
            for emp in project["team_members"]:
                db.Employees.update_one(
                    {"emp_id": emp["emp_id"]},
                    {"$pull": {"current_projects": project_id}}
                )
                # print("removed ",project_id," from ", emp["emp_id"])
        update_fields["status"] = data["status"]

    quick_links_updates = {}
    
    if "code_resource_base" in data:
        if data["code_resource_base"]:
            quick_links_updates["quick_links.code_resource_base"] = data["code_resource_base"]
        else:
            quick_links_updates["quick_links.code_resource_base"] = None
    
    if "live_demo" in data:
        if data["live_demo"]:
            quick_links_updates["quick_links.live_demo"] = data["live_demo"]
        else:
            quick_links_updates["quick_links.live_demo"] = None
    
    if quick_links_updates:
        update_fields.update(quick_links_updates)

    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields provided to update.")

    set_fields = {k: v for k, v in update_fields.items() if v is not None}
    unset_fields = {k: "" for k, v in update_fields.items() if v is None}
    
    update_operations = {}
    if set_fields:
        update_operations["$set"] = set_fields
    if unset_fields:
        update_operations["$unset"] = unset_fields

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        update_operations
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or no changes made.")

    return {"message": "Project brief updated successfully."}

#================= Add new Team members by project_id  ============================
@app.post("/add-team-member")
async def add_teammember(data: dict):
    project_id = data.get("project_id")
    emp_id = data.get("team_members")

    if not project_id or not emp_id:
        raise HTTPException(status_code=400, detail="Both project_id and emp_id are required.")

    emp = await db.Employees.find_one({"emp_id": emp_id})
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found.")
    
    team_member_data = {
        "emp_id": emp["emp_id"],
        "name": emp["emp_name"],
        "role": emp["role"],
        "dept": emp["emp_dept"],
        "profile": emp.get("profile", "")
    }
    
    project = await db.Projects.find_one({"project_id": project_id})
    for member in project.get("team_members", []):
        if member.get("emp_id") == emp_id:
            raise HTTPException(
                status_code=409,
                detail=f"{emp['emp_name']} is already a team member of project {project_id}.",
                headers={"X-Frontend-Message": f"{emp['emp_name']} is already a team member of this project."}
            )

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        {"$addToSet": {"team_members": team_member_data}}
    )
    
    await db.Employees.update_one(
        {"emp_id": emp_id},
        {"$addToSet": {"current_projects": project_id}}
    )

    if updated.modified_count == 0 :
        raise HTTPException(status_code=404, detail="Project not found or employee already on the team.")

    return {"message": f"{team_member_data['name']} added to project {project_id}."}

#================= Add new Feature by project_id  ============================
@app.post("/add-feature")
async def add_feature(data: dict):
    project_id = data.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required.")

    while True:
        random_id = f"FT{random.randint(1000, 9999)}"
        project = await db.Projects.find_one(
            {"project_id": project_id, "features.id": random_id},
            {"_id": 1}
        )
        if not project:
            break

    
    feature_data = {
        "id": random_id,
        "title": data.get("title"),
        "descp": data.get("descp"),
        "status": "in progress",
        "created_by": data.get("created_by"),
        "verified":False,
        "tasks":[]
    }

    updated = await db.Projects.update_one(
        {"project_id": data["project_id"]},
        {"$addToSet": {"features": feature_data}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or feature not added.")

    return {"message": f"{data['title']} added to project {data["project_id"]}."}

#================= update verification of Feature  ============================
@app.post("/verify-feature")
async def verify_feature(data: dict):
    project_id = data.get("project_id")
    feature_id = data.get("feature_id")

    if not project_id or not feature_id:
        raise HTTPException(status_code=400, detail="Both project_id and feature_id are required.")

    project = await db.Projects.find_one({"project_id": project_id})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    features = project.get("features", [])

    if not isinstance(features, list):
        raise HTTPException(status_code=500, detail="Invalid structure: features must be a list.")

    feature_index = None
    for i, feature in enumerate(features):
        if isinstance(feature, dict) and feature.get("id") == feature_id:
            feature_index = i
            break

    if feature_index is None:
        raise HTTPException(status_code=404, detail="Feature not found in the project.")

    update_path = f"features.{feature_index}.verified"
    update_result = await db.Projects.update_one(
        {"project_id": project_id},
        {"$set": {update_path: True}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Feature verification update failed.")

    return {"message": f"Feature {feature_id} marked as verified in project {project_id}."}


#================= Add new key_req to srs by project_id  ============================
@app.post("/add-key-req")
async def add_key_req(data: dict):
    project_id = data.get("project_id")
    req = data.get("srs_key_req")
    srs_link = data.get("srs_link")

    if not project_id or not req:
        raise HTTPException(status_code=400, detail="Both project_id and requirement are required.")

    query = {"project_id": project_id}
    update_query = {
        "$addToSet": {"srs.key_req": req}
    }

    if srs_link:
        update_query["$set"] = {"srs.srs_doc_link": srs_link}

    updated = await db.Projects.update_one(query, update_query)

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or requirement not added.")

    return {"message": f"'{req}' added to project {project_id}."}

#================= Add new key_req to srs by project_id  ============================
@app.post("/manage-quick-actions")
async def manage_quick_links(data: dict):
    project_id = data.get("project_id")
    link_name = data.get("linkname")
    link_url = data.get("link")

    if not project_id or not link_name or not link_url:
        raise HTTPException(status_code=400, detail="project_id, linkname, and link are required.")
    
    link_exists = await db.Projects.find_one({
        "project_id": project_id,
        "links.label": link_name
    })

    if link_exists:
        updated = await db.Projects.update_one(
            {
                "project_id": project_id,
                "links.label": link_name
            },
            {
                "$set": {"links.$.link": link_url}
            }
        )

        if updated.modified_count == 0:
            raise HTTPException(status_code=400, detail="Link not updated.")
        
        return {"message": f"Link '{link_name}' updated in project {project_id}."}

    else:
        added = await db.Projects.update_one(
            {"project_id": project_id},
            {"$push": {"links": {"label": link_name, "link": link_url}}}
        )

        if added.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found or link not added.")

        return {"message": f"New link '{link_name}' added to project {project_id}."}
    
#================= manage maintenance reports by project_id  ============================
@app.post("/manage-maintenance-reports")
async def manage_maintenance_reports(
    project_id: str = Form(...),
    title: str = Form(...),
    descp: str = Form(...),
    type: str = Form(...),
    file: UploadFile = File(...)
):
    if not project_id or not title or not descp or not type:
        print("hit not included")
        raise HTTPException(status_code=400, detail="project_id, title, and descp are required.")

    if type != "Maintenance" and type != "Issue":
        print("hit type")
        raise HTTPException(status_code=400, detail="Unvalid report type submitted.")
    
    doc_url = await upload_file_to_firebase(file, folder=f"PMT/ProjectReports/{project_id}")

    report_entry = {
        "id": f"MAINT{random.randint(1000,9999)}",
        "title": title,
        "descp": descp,
        "type": type,
        "issued_date": datetime.utcnow(),
        "doc_link": doc_url 
    }

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        {"$push": {"issues_and_maintenance_reports": report_entry}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or report not added.")

    return {"message": f"Maintenance report '{title}' added to project {project_id}."}

#================= manage hosting details by project_id  ============================
@app.post("/manage-hostings")
async def manage_hosting_links(data: dict):
    project_id = data.get("project_id")
    title = data.get("title")
    link = data.get("link")
    descp = data.get("descp")

    if not project_id or not title or not link or not descp:
        raise HTTPException(status_code=400, detail="project_id, title,descp, and link are required.")
    
    link_exists = await db.Projects.find_one({
        "project_id": project_id,
        "hosting_details.title": title
    })

    if link_exists:
        updated = await db.Projects.update_one(
            {
                "project_id": project_id,
                "hosting_details.title": title
            },
            {
                "$set": {"hosting_details.$.link": link,"hosting_details.$.descp":descp}
            }
        )

        if updated.modified_count == 0:
            raise HTTPException(status_code=400, detail="Link not updated.")
        
        return {"message": f"Quick Action Link '{title}' updated in project {project_id}."}

    else:
        added = await db.Projects.update_one(
            {"project_id": project_id},
            {"$push": {"hosting_details": {"title": title, "link": link,"descp":descp}}}
        )

        if added.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found or link not added.")

        return {"message": f"New Quick Action link '{title}' added to project {project_id}."}
    
# ================= Get all phases of project development ====================
@app.get("/all-phases")
async def get_phases_project(project_id: str):
    if not project_id:
        raise HTTPException(status_code=400, detail="Project ID is required.")
    
    project = await db.Projects.find_one({"project_id": project_id}, {"_id": 0, "project_status": 1})
    
    if not project: 
        raise HTTPException(status_code=404, detail="Project not found.")
    project_phases = project.get("project_status", [])
    
    if not project_phases:
        raise HTTPException(status_code=404, detail="No phases found for this project.")
    
    phases = []
    for Parentphase in project_phases:
        subphases = Parentphase.get("subphases")
        for phase in subphases:
            # print(phase)
            phases.append(phase.get("subphase") if "subphase" in phase else "")
    return phases


#================= Add new template to templates by project_id  ============================
@app.post("/add-new-template")
async def add_template(data: dict):
    project_id = data.get("project_id")
    template_name = data.get("template_name")
    department = data.get("department")
    phase = data.get("phase")
    fields = data.get("fields")

    print(data)

    if not project_id or not template_name or not department or not phase or not fields:
        raise HTTPException(status_code=400, detail="All fields are required.")

    while True:
        random_id = f"TEMP{random.randint(1000, 9999)}"
        existing_template = await db.Projects.find_one({"project_id": project_id, "templates.id": random_id})
        if not existing_template:
            break

    template_fields = []
    for field in fields:
        while True:
            randomFD_id = f"TEMPFD{random.randint(1000, 9999)}"
            if any(f["id"] == randomFD_id for f in template_fields):
                continue
            existing_field = await db.Projects.find_one({
                "project_id": project_id,
                "templates.fields.id": randomFD_id
            })
            if not existing_field:
                break
        template_fields.append({
            "id": randomFD_id,
            "title": field.get("title"),
            "descp": field.get("descp"),
            "remark": False
        })

    template = {
        "id": random_id,
        "fields": template_fields,
        "template_name": template_name,
        "department": department,
        "phase": phase
    }
    
    await db.Projects.update_one(
        {
            "project_id": project_id,
            "project_status.subphases.subphase": phase
        },
        {
            "$set": {
                "project_status.$[parent].subphases.$[sub].status": "in_progress",
                "project_status.$[parent].subphases.$[sub].start_date" : datetime.now()
            }
        },
        array_filters=[
            {"parent.subphases.subphase": phase},
            {"sub.subphase": phase}
        ]
    )

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        {"$push": {"templates": template}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or template not added.")

    return {"message": f"Template '{template_name}' added to project {project_id}."}

#================= fucntion to update subphases status based on templates  ============================
async def update_subphase_status_background(project_id: str):
    try:
        project = await db.Projects.find_one({"project_id": project_id})
        if not project:
            return

        templates = project.get("templates", [])
        project_status = project.get("project_status", [])

        templates_by_phase = {}
        for template in templates:
            phase = template.get("phase")
            if phase:
                if phase not in templates_by_phase:
                    templates_by_phase[phase] = []
                templates_by_phase[phase].append(template)

        for parent_phase in project_status:
            parent_phase_name = parent_phase.get("parent_phase")
            subphases = parent_phase.get("subphases", [])
            
            for subphase in subphases:
                subphase_name = subphase.get("subphase")
                current_status = subphase.get("status")
                
                if current_status == "completed":
                    continue
                
                if subphase_name in templates_by_phase:
                    subphase_templates = templates_by_phase[subphase_name]
                    
                    all_verified = all(template.get("verified", False) for template in subphase_templates)
                    
                    if all_verified and len(subphase_templates) > 0:
                        await db.Projects.update_one(
                            {"project_id": project_id},
                            {
                                "$set": {
                                    f"project_status.$[parent].subphases.$[sub].status": "completed",
                                    f"project_status.$[parent].subphases.$[sub].closed_date": datetime.utcnow()
                                }
                            },
                            array_filters=[
                                {"parent.parent_phase": parent_phase_name},
                                {"sub.subphase": subphase_name}
                            ]
                        )

    except Exception as e:
        print(f"Error updating subphase status: {str(e)}")

#================================ Route to mark the template remarks ==========================
@app.post("/mark-template-remarks")
async def mark_template_remarks(data: dict,background_tasks: BackgroundTasks):
    project_id = data.get("project_id")
    template_id = data.get("template_id")
    verified_ids = data.get("verified_ids")

    if not project_id or not template_id or not verified_ids:
        raise HTTPException(status_code=400, detail="project_id, template_id, and verified_ids are required.")

    for field_id in verified_ids:
        await db.Projects.update_one(
            {"project_id": project_id, "templates.id": template_id},
            {"$set": {"templates.$[template].fields.$[field].remark": True}},
            array_filters=[
                {"template.id": template_id},
                {"field.id": field_id}
            ]
        )

    project = await db.Projects.find_one({"project_id": project_id})
    template = next((t for t in project.get("templates", []) if t["id"] == template_id), None)
    
    if template and all(field.get("remark") is True for field in template.get("fields", [])):
        await db.Projects.update_one(
            {"project_id": project_id, "templates.id": template_id},
            {"$set": {"templates.$.verified": True}}
        )

    background_tasks.add_task(update_subphase_status_background, project_id)

    return {"message": f"Remark fields updated for template {template_id} in project {project_id}."}

# =============== Manage Financial Data ===================
@app.put("/manage-financial-data")
async def manage_financial_data(data: dict):
    project_id = data.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required.")

    project = await db.Projects.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    financial_data = project.get("financial_data", {})
    
    print(data)

    total_budget = data.get("total_budget", financial_data.get("total_budget"))
    expected_revenue = data.get("expected_revenue", financial_data.get("expected_revenue"))

    profit_margin = financial_data.get("profit_margin")
    prior_expected_revenue = financial_data.get("expected_revenue", 0)
    if ("total_budget" in data or "expected_revenue" in data) and total_budget and expected_revenue:
        try:
            profit_margin = round(((float(expected_revenue) - float(total_budget)) / float(expected_revenue)) * 100, 2)
        except Exception:
            profit_margin = None

    client_details = project.get("client_details", {})
    client_name = client_details.get("name")
    if client_name:
        client = await db.Clients.find_one({"name": client_name})
        if client:
            metrics = client.get("metrics", {})
            total_billed = metrics.get("total_billed", 0) or 0
            if expected_revenue is not None:
                try:
                    expected_revenue_val = float(expected_revenue)
                    prior_expected_revenue_val = float(prior_expected_revenue) if prior_expected_revenue else 0
                    if not prior_expected_revenue_val or prior_expected_revenue_val == 0:
                        new_total_billed = total_billed + expected_revenue_val
                    elif prior_expected_revenue_val > 100:
                        new_total_billed = total_billed - prior_expected_revenue_val + expected_revenue_val
                    else:
                        new_total_billed = total_billed
                    await db.Clients.update_one(
                        {"_id": client["_id"]},
                        {"$set": {"metrics.total_billed": new_total_billed}}
                    )
                except Exception:
                    pass

    cost_breakdown = financial_data.get("cost_breakdown", [])
    frontend_costs = data.get("cost_breakdown", [])
    updated_cost_breakdown = []
    existing_cost_ids = {c.get("id"): c for c in cost_breakdown if "id" in c}
    for item in frontend_costs:
        if "id" in item and item["id"] in existing_cost_ids:
            updated = existing_cost_ids[item["id"]]
            updated.update(item)
            updated_cost_breakdown.append(updated)
        else:
            if "id" not in item:
                item["id"] = f"COST{random.randint(1000,9999)}"
            updated_cost_breakdown.append(item)

    spenditure_analysis = financial_data.get("spenditure_analysis", [])
    frontend_spends = data.get("spenditure_analysis", [])
    existing_spend_ids = {s.get("id"): s for s in spenditure_analysis if "id" in s}
    updated_spenditure = []
    for item in frontend_spends:
        found = False
        if "id" in item and item["id"] in existing_spend_ids:
            updated = existing_spend_ids[item["id"]]
            updated.update(item)
            updated_spenditure.append(updated)
            found = True
        else:
            for s in spenditure_analysis:
                if s.get("month") == item.get("month") and s.get("dept") == item.get("dept"):
                    s.update(item)
                    if "id" not in s:
                        s["id"] = f"SPA{random.randint(1000,9999)}"
                    item["id"] = s["id"]
                    updated_spenditure.append(s)
                    found = True
                    break
        if not found:
            if "id" not in item:
                item["id"] = f"SPA{random.randint(1000,9999)}"
            updated_spenditure.append(item)

    update_dict = {
        "financial_data.total_budget": float(total_budget) if total_budget is not None else None,
        "financial_data.expected_revenue": float(expected_revenue) if expected_revenue is not None else None,
        "financial_data.profit_margin": float(profit_margin) if profit_margin is not None else None,
        "financial_data.cost_breakdown": updated_cost_breakdown,
        "financial_data.spenditure_analysis": updated_spenditure
    }
    update_dict = {k: v for k, v in update_dict.items() if v is not None}

    result = await db.Projects.update_one(
        {"project_id": project_id},
        {"$set": update_dict}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Financial data not updated.")

    return {"message": "Financial data updated successfully."}

#=============== Add Initial phase to project development =================
@app.post("/add-initial-phases")
async def add_project_phases(data: ProjectPhaseUpdate):
    project = db.Projects.find_one({"project_id": data.project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    processed_phases = []
    for phase in data.phases:
        processed_subphases = []
        for sub in phase.subphases:
            sub_dict = {
                "subphase": sub.subphase,
                "status": "not_started", 
                "start_date": None,
                "closed_date": None,
                "remarks": sub.remarks or ""
            }
            if sub_dict["start_date"]:
                try:
                    sub_dict["start_date"] = datetime.fromisoformat(sub_dict["start_date"])
                except ValueError:
                    raise HTTPException(status_code=400, detail=f"Invalid date format: {sub_dict['start_date']}")
            processed_subphases.append(sub_dict)

        processed_phases.append({
            "parent_phase": phase.parent_phase,
            "subphases": processed_subphases
        })

    result = await db.Projects.update_one(
        {"project_id": data.project_id},
        {"$set": {"project_status": processed_phases}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Phases data not updated.")
    else:
        return {"message": "Sucessfully added initial phases to project."}

#================ update project phase status ============================
def infer_status(start: Optional[str], closed: Optional[str]) -> str:
    if start and closed:
        return "completed"
    elif start and not closed:
        return "in_progress"
    else:
        return "not_started"
    
@app.post("/update_project_phases")
async def update_project_phases(data: ProjectPhaseUpdate):
    project = db.Projects.find_one({"project_id": data.project_id})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found",message ="Project not found")

    updated_status = []
    completed = 0
    subphases =0 
    for phase in data.phases:
        updated_subphases = []
        for sub in phase.subphases:
            subphases+=1
            start_date = datetime.fromisoformat(sub.start_date) if sub.start_date else None
            closed_date = datetime.fromisoformat(sub.closed_date) if sub.closed_date else None

            status = infer_status(start_date, closed_date)
            if status == "completed" : completed+=1
            elif status == "in_progress" : completed += 0.5
            updated_subphases.append({
                "subphase": sub.subphase,
                "status": status,
                "start_date": datetime.fromisoformat(sub.start_date) if sub.start_date else None,
                "closed_date": datetime.fromisoformat(sub.closed_date) if sub.closed_date else None,
                "remarks": sub.remarks or ""
            })
        updated_status.append({
            "parent_phase": phase.parent_phase,
            "subphases": updated_subphases
        })
        
    
    progress = ((completed / subphases * 100) if subphases > 0 and completed > 0 else 5)

    result = await db.Projects.update_one(
        {"project_id": data.project_id},
        {"$set": {"project_status": updated_status ,"progress":progress}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="No changes were made")

    return {"message": "Project phases updated successfully"}

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
async def add_new_client(
    name: str = Form(...),
    brand_name: str = Form(...),
    type: str = Form(...),
    industry: str = Form(...),
    location: str = Form(...),
    website: Optional[str] = Form(None),
    gst_id: str = Form(...),
    source: str = Form(...),
    contact_name: str = Form(...),
    contact_email: EmailStr = Form(...),
    contact_phone: str = Form(...),
    contact_designation: str = Form(...),  
    file: UploadFile = File(...)
):
    while True:
        random_id = f"CLT{random.randint(1000, 9999)}"
        existing = await db.Clients.find_one({"client_id": random_id})
        if not existing:
            break
        
    existing_clients = await db.Clients.find({}).to_list(1000)    
    for client in existing_clients:
        if client.get("brand_name") == brand_name or client.get("gst_id") == gst_id:
            raise HTTPException(
                status_code=409,
                detail=f"Client already exists.",
                headers={"X-Frontend-Message": f"Client already exists."}
            )  

    logo_url = await upload_file_to_firebase(file, folder=f"PMT/clients/{brand_name}")
    
    client_data = Client(
        client_id=random_id,
        name=name,
        brand_name=brand_name,
        logo_url=logo_url,
        type=type,
        industry=industry,
        location=location,
        website=website,
        gst_id=gst_id,
        primary_contact=ContactPerson(
            name=contact_name,
            email=contact_email,
            phone=contact_phone,
            designation=contact_designation  
        ),
        engagement=ClientEngagement(
            joined_date=datetime.utcnow(),
            source=source,
            onboarding_notes=None,
            tags=[industry, type]
        ),
        documents=[],  
        metrics=ClientMetrics()
    )

    await db.Clients.insert_one(client_data.dict())

    return {"message": "Client added successfully", "client_id": random_id}

# ============= Update existing client =================
@app.post("/update-client")
async def update_client( data: UpdateClientInput):
    if not data.client_id:
        raise HTTPException(status_code=400, detail="Client ID is required.")
    
    client = db.Clients.find_one({"client_id": data.client_id})
    if not client:  
        raise HTTPException(status_code=404, detail="Client not found.")
    #print (data)
    update_data = {
        "name": data.name  if data.brand_name else None,
        "brand_name": data.brand_name if data.brand_name else None,
        "logo_url": data.logo_url if data.logo_url else None,
        "location": data.location if data.location else None,
        "website": data.website if data.website else None,
        "gst_id": data.gst_id if data.gst_id else None,
        "contact_name": data.contact_name if data.contact_name else None,
        "contact_email": data.contact_email if data.contact_email else None,
        "contact_phone": data.contact_phone if data.contact_phone else None,
    }
    
    update_fields = {key: value for key, value in update_data.items() if value is not None}
    result = await db.Clients.update_one(
        {"client_id": data.client_id},
        {"$set": update_fields}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Client not updated.")
    return {"message": "Client updated successfully."}

# ============= Add new client documents =================
@app.post("/add-client-documents")
async def add_client_documents(
    doc_name: str = Form(...),
    doc_type: str = Form(...),
    client_id: str = Form(...),
    file: UploadFile = File(...)
):
    #print("Received request to add client document")

    if not client_id:
        raise HTTPException(status_code=400, detail="Client ID is required.")
    
    client = await db.Clients.find_one({"client_id": client_id})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")
    
    if not doc_name or not doc_type:
        raise HTTPException(status_code=400, detail="Document name and type are required.")
    
    for c in client.get("documents", []):
        if c.get("doc_name").lower() == doc_name.lower() :
            raise HTTPException(
                status_code=409,
                detail=f"Document '{doc_name}' of type '{doc_type}' already exists for this client.",
                headers={"X-Frontend-Message": f"Document '{doc_name}' already exists."}
            )

    existing_documents = client.get("documents", [])
    if not existing_documents:
        random_id = f"CDOC{random.randint(1000, 9999)}"
        #print("No existing documents, assigned ID:", random_id)
    else:
        existing_ids = [doc["id"] for doc in existing_documents if "id" in doc]
        while True:
            random_id = f"CDOC{random.randint(1000, 9999)}"
            if random_id not in existing_ids:
                #print("Unique document ID generated:", random_id)
                break

    try:
        #print("Uploading document...")
        doc_link = await upload_file_to_firebase(file, folder=f"PMT/clients/{client['brand_name']}/documents")
        #print("Upload successful")
    except Exception as e:
        #print("Upload failed:", str(e))
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")


    document = ClientDocuments(
        id=random_id,
        doc_name=doc_name,
        doc_type=doc_type,
        doc_url=doc_link,
        uploaded_at=datetime.now(timezone.utc)
    ).dict()
    
    result = await db.Clients.update_one(
        {"client_id": client_id},
        {"$addToSet": {"documents": document}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Document not added to the client.")

    return {"message": f"Document '{doc_name}' added to client {client_id}.",}

# ============= Add client notes =================
@app.post("/add-client-notes")
async def add_client_note(data:dict):
    if not data.get("client_id"):
        raise HTTPException(status_code=400, detail="Client ID is required.")
    
    if not data.get("note"):
        raise HTTPException(status_code=400, detail="Note content is required.")

    client = await db.Clients.find_one({"client_id": data.get("client_id")})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")

    note_entry = ClientNote(
        note= data.get("note"),
        created_at= datetime.utcnow()
    ).dict()

    result = await db.Clients.update_one(
        {"client_id": data.get("client_id")},
        {"$addToSet": {"notes": note_entry}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Note not added to the client.")

    return {"message": f"Note added to client {data.get("client_id")}."}

#============================================ ANALYTICS =====================================================================================
#=============== Get OverviewData ===============================
@app.get("/overview-analytics-data")
async def overviewData():
    now = datetime.now()
    current_month = now.month
    current_year = now.year

    prev_month = current_month - 1 if current_month > 1 else 12
    prev_year = current_year if current_month > 1 else current_year - 1

    employees_cursor = db.Employees.find({"status": "Active"}, {"_id": 0})
    employees = await employees_cursor.to_list(length=None)
    total_employees = len(employees)

    Total_performance = sum(emp.get("performance_metrics", {}).get("ratings", 0) for emp in employees)
    Total_performance = round(Total_performance / total_employees, 2)

    active_projects_cursor = db.Projects.find({"status": "active"}, {"_id": 0})
    active_projects = await active_projects_cursor.to_list(length=None)
    count_active_projects = len(active_projects)

    completed_projects_cursor = db.Projects.find({"status": "completed"}, {"_id": 0})
    completed_projects = await completed_projects_cursor.to_list(length=None)

    current_revenue = 0
    previous_revenue = 0

    for project in completed_projects:
        deadline = project.get("deadline")
        if isinstance(deadline, datetime):
            if deadline.month == current_month and deadline.year == current_year:
                current_revenue += project.get("financial_data", {}).get("expected_revenue", 0)
            elif deadline.month == prev_month and deadline.year == prev_year:
                previous_revenue += project.get("financial_data", {}).get("expected_revenue", 0)

    fresh_metrics = {
        "total_employees": total_employees,
        "active_projects": count_active_projects,
        "monthly_completed_project_revenue": current_revenue,
        "total_emp_performance": Total_performance
    }

    previous_metrics = {
        "monthly_completed_project_revenue": previous_revenue
    }

    analytics_doc = await db.Analytics.find_one({"type": "overview_data"})
    updated_data = {}

    for key, new_value in fresh_metrics.items():
        existing = analytics_doc.get("data", {}).get(key) if analytics_doc else None

        if existing:
            curr_calc_date = existing.get("current_calculated")

            month_diff = 0
            if isinstance(curr_calc_date, datetime):
                month_diff = (now.year - curr_calc_date.year) * 12 + (now.month - curr_calc_date.month)

            if month_diff >= 2:
                updated_data[key] = {
                    "previous_value": previous_metrics.get(key, existing.get("current_value")),
                    "previous_calculated": datetime(prev_year, prev_month, monthrange(prev_year, prev_month)[1]),
                    "current_value": new_value,
                    "current_calculated": now
                }
            else:
                updated_data[key] = {
                    "previous_value": existing.get("previous_value"),
                    "previous_calculated": existing.get("previous_calculated"),
                    "current_value": new_value,
                    "current_calculated": now
                }
        else:
            updated_data[key] = {
                "previous_value": previous_metrics.get(key),
                "previous_calculated": datetime(prev_year, prev_month, monthrange(prev_year, prev_month)[1]),
                "current_value": new_value,
                "current_calculated": now
            }

    await db.Analytics.update_one(
        {"type": "overview_data"},
        {"$set": {"data": updated_data}},
        upsert=True
    )

    return updated_data

#=============== Get Department Performance data ===============================
@app.get("/dept-performance-analytics")
async def dept_performance_analytics():
    departments_cursor = db.Departments.find({}, {"_id": 0})
    departments = await departments_cursor.to_list(length=None)

    projects_cursor = db.Projects.find({}, {"_id": 0})
    all_projects = await projects_cursor.to_list(length=None)

    tasks_cursor = db.Tasks.find({}, {"_id": 0})
    all_tasks = await tasks_cursor.to_list(length=None)

    result = []

    for dept in departments:
        dept_id = dept["dept_id"]
        dept_name = dept["dept_name"]

        employees_cursor = db.Employees.find({"emp_dept": dept_id, "status": "Active"}, {"_id": 0})
        employees = await employees_cursor.to_list(length=None)
        total_employees = len(employees)
        
        top_performers_raw = []
        total_Salary_Account = 0

        for emp in employees:
            total_Salary_Account += emp.get("salary_monthly", 0)
            top_performers_raw.append({
                "name": emp["emp_name"],
                "rating": emp.get("performance_metrics", {}).get("ratings", 0)
            })

        top_performers = sorted(top_performers_raw, key=lambda x: x["rating"], reverse=True)[:3]

        dept_projects = [
            proj for proj in all_projects
            if any(member.get("dept") == dept_id for member in proj.get("team_members", []))
        ]
        ongoing_projects = sum(1 for p in dept_projects if p.get("status") == "active")

        budget_used = 0
        for proj in all_projects:
            financial_data = proj.get("financial_data") or {}
            spenditure_analysis = financial_data.get("spenditure_analysis", [])
            for s in spenditure_analysis:
                if s.get("dept") == dept_id:
                    budget_used += int(s.get("cost"))
        
        dept_emp_ids = {emp["emp_id"] for emp in employees}
        dept_tasks = [
            t for t in all_tasks
            if any(member.get("emp_id") in dept_emp_ids for member in t.get("members_assigned", []))
        ][:250]

        completed_tasks = sum(1 for t in dept_tasks if t.get("status") == "done")
        total_tasks = len(dept_tasks)
        delivery_rate = round((completed_tasks / total_tasks) * 100, 2) if total_tasks else 0

        pending_requests = []
        for task in dept_tasks:
            if task.get("status") == "assigned" or task.get("status") == "uncomplete":
                pending_requests.append(task)


        ratings = [emp.get("performance_metrics",{}).get("ratings",0) for emp in employees]
        performance_score = round(sum(ratings) / len(ratings), 1) if ratings else 0

        result.append({
            "id":dept_id,
            "name":dept_name ,
            "totalEmployees": total_employees,
            "ongoingProjects": ongoing_projects,
            "performanceScore": performance_score,
            "deliveryRate": delivery_rate,
            "budgetUsage": budget_used,
            "totalSalaryAccount":total_Salary_Account,
            "topPerformers": top_performers,
            "pendingRequests": pending_requests
        })

    return result

#=============== Get Employees data ===============================
@app.get("/employee-analytics")
async def get_employee_analytics():
    employees_cursor = db.Employees.find({"status": "Active"}, {"_id": 0})
    employees = await employees_cursor.to_list(length=None)
    
    analytics_data = []

    for emp in employees:
        emp_id = emp.get("emp_id")
        emp_name = emp.get("emp_name")
        role = emp.get("role")
        department = emp.get("emp_dept")
        performance = emp.get("performance_metrics", {})
        salary_account = emp.get("salary_account", [])
        emp_documents = emp.get("emp_documents", [])
        
        promotion_history = []

        for record in emp.get("promotion_record", []):
            promotion_history.append({
                "date": record["working_as_from"].strftime("%Y-%m-%d"),
                "role": record["prev_role"]
            })

        promotion_history.sort(key=lambda x: x["date"])

        analytics_data.append({
            "id": emp_id,
            "name": emp_name,
            "role": role,
            "department": department,
            "totalProjects": len(emp.get("current_projects", [])) + performance.get("completed_projects", 0),
            "completedProjects": performance.get("completed_projects", 0),
            "performanceScore": round((performance.get("ratings", 0) or 0), 2), 
            "attendance": 96,  
            "salaryHistory": [entry["salary_paid"] for entry in salary_account],
            "leavesTaken": emp.get("leaves_taken", 0),
            "documents": [doc["doc_name"] for doc in emp_documents],
            "PromotionHistory": promotion_history
        })

    return analytics_data

#=============== Get Sales data ===============================
@app.get("/analytics-sales-finance")
async def generate_sales_finance_metrics():
    clients = await db.Clients.find({}).to_list(length=None)
    projects = await db.Projects.find({}).to_list(length=None)

    total_revenue = 0
    total_projects = 0
    total_costs = 0
    repeat_clients = 0
    new_clients = 0
    now = datetime.utcnow()

    monthly_revenue_trend = {}
    
    for i in range(6):
        month_date = now - timedelta(days=30 * i)
        month_key = month_date.strftime("%Y-%m")
        monthly_revenue_trend[month_key] = 0

    client_stats = []

    for client in clients:
        metrics = client.get("metrics", {})
        revenue = metrics.get("total_billed", 0)
        project_count = metrics.get("total_projects", 0)
        joined_date = client.get("engagement", {}).get("joined_date")

        total_revenue += revenue
        total_projects += project_count

        if joined_date and (now - joined_date).days <= 90:
            new_clients += 1

        if project_count > 1:
            repeat_clients += 1

        client_stats.append({
            "client_name": client["name"],
            "total_billed": revenue,
            "total_projects": project_count
        })

    avg_project_value = total_revenue / total_projects if total_projects > 0 else 0

    project_completion = 0
    delayed_projects = 0
    total_duration = 0
    roi_per_project = []
    profit_margin_total = 0
    this_month_revenue = 0
    current_month_key = now.strftime("%Y-%m")

    for project in projects:
        status = project.get("status")
        fin = project.get("financial_data") or {}
        deadline = project.get("deadline")
        
        if status == "completed" and deadline:
            expected_revenue = fin.get("expected_revenue", 0) or 0
            project_month_key = deadline.strftime("%Y-%m")
            
            if project_month_key in monthly_revenue_trend:
                monthly_revenue_trend[project_month_key] += expected_revenue
            
            if project_month_key == current_month_key:
                this_month_revenue += expected_revenue

        if status == "completed":
            project_completion += 1

        if deadline and deadline < now and status != "completed":
            delayed_projects += 1

        start_date = project.get("start_date")
        if start_date and deadline:
            duration = (deadline - start_date).days
            total_duration += duration

        cost = sum(
            float(c.get("cost", 0) or 0)
            for c in fin.get("spenditure_analysis", [])
        )
        total_costs += cost
        expected_revenue = fin.get("expected_revenue", 0)
        margin = fin.get("profit_margin", 0)

        if cost > 0:
            roi = (expected_revenue - cost) / cost
            roi_per_project.append({
                "project_id": project["project_id"],
                "project_name": project["project_name"],
                "client_name": project["client_details"]["name"], 
                "roi": round(roi, 2),
                "cost": cost
            })

        profit_margin_total += margin

    sorted_months = sorted(monthly_revenue_trend.keys(), reverse=True)[:6]
    monthly_trend_list = [monthly_revenue_trend[month] for month in reversed(sorted_months)]

    completion_rate = (project_completion / len(projects)) * 100 if projects else 0
    avg_duration = total_duration / len(projects) if projects else 0
    avg_profit_margin = profit_margin_total / len(projects) if projects else 0

    return {
        "revenue": {
            "total": total_revenue,
            "total_this_month": this_month_revenue,
            "monthlyTrend": monthly_trend_list, 
            "monthlyTrendDict": monthly_revenue_trend,  
            "avgProjectValue": avg_project_value,
        },
        "finance": {
            "totalCost": total_costs,
            "costToRevenueRatio": round(total_costs / total_revenue, 2) if total_revenue else 0,
            "avgProfitMargin": round(avg_profit_margin, 2)
        },
        "clients": {
            "total": len(clients),
            "repeatClients": repeat_clients,
            "newClientsThisQuarter": new_clients,
            "topClientsByRevenue": sorted(client_stats, key=lambda x: x['total_billed'], reverse=True)[:5]
        },
        "projects": {
            "total": len(projects),
            "completionRate": round(completion_rate, 2),
            "delayedProjects": delayed_projects,
            "avgDurationDays": round(avg_duration, 2),
            "roiPerProject": roi_per_project
        }
    }

@app.get("/analytics-projects-data")
async def get_project_metrics():
    projects_cursor = db.Projects.find()
    projects = await projects_cursor.to_list(length=None)

    processed_projects = []

    for project in projects:
        start = project.get("start_date")
        deadline = project.get("deadline")
        progress = project.get("progress", 0)
        financial = project.get("financial_data") or {}
        spend = financial.get("spenditure_analysis", [])
        team_size = len(project.get("team_members", []))
        project_id = project.get("project_id")

        actual_cost = 0
        for entry in spend:
            try:
                actual_cost += int(entry["cost"])
            except:
                pass

        budget = financial.get("total_budget", 0)
        revenue = financial.get("expected_revenue", 0)
        profitability = None
        if budget:
            profitability = round(((revenue - actual_cost) / budget) * 100, 2)

        issues = project.get("issues_and_maintenance_reports", [])
        issue_count = sum(1 for issue in issues if issue.get("type","") == "Issue") 

        performanceMetrics =project.get("performance_metrics") or {}
        client_satisfaction = performanceMetrics.get("stakeholder_satisfaction") or 2

        roadblocks = project.get("roadblocks", [])

        status = project.get("status", "unknown")

        start_str = start.isoformat() if start else None
        deadline_str = deadline.isoformat() if deadline else None

        project_obj = {
            "id": project_id,
            "name": project.get("project_name"),
            "current_phase": project.get("current_phase", ""),
            "status": status,
            "progress": progress,
            "teamSize": team_size,
            "budget": budget,
            "actualCost": actual_cost,
            "clientSatisfaction": client_satisfaction,
            "profitability": profitability,
            "issues": issue_count,
            "startDate": start_str,
            "dueDate": deadline_str,
            "roadblocks": roadblocks,
        }

        processed_projects.append(project_obj)

    return {"projectsData": processed_projects}


#============================= GOALS ================================
async def generate_unique_id(collection, prefix: str, length: int = 8) -> str:
    while True:
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        unique_id = f"{prefix}_{random_part}"
        
        existing = await collection.find_one({"id": unique_id})
        if not existing:
            return unique_id

#=================== Create a new goal==============================
@app.post("/goals/", response_model=GoalResponse)
async def create_goal(goal_input: CreateGoalInput):
    try:
        unique_id = await generate_unique_id(db.Goals, "GOAL")

        goal_dict = goal_input.dict()

        # Convert top-level date
        goal_dict["deadline"] = datetime.combine(goal_input.deadline, time.min) if goal_input.deadline else None

        # Convert milestone dates
        for m in goal_dict["milestones"]:
            m["due_date"] = datetime.combine(m["due_date"], time.min) if m["due_date"] else None
            m["completion_date"] = datetime.combine(m["completion_date"], time.min) if m["completion_date"] else None

        goal_dict["id"] = unique_id
        goal_dict["created_at"] = datetime.utcnow()
        goal_dict["updated_at"] = datetime.utcnow()

        goal_dict["id"] = unique_id
        goal_dict["created_at"] = datetime.utcnow()
        goal_dict["updated_at"] = datetime.utcnow()
        goal_dict["current_progress"] = 0.0
        goal_dict["progress_history"] = []
        goal_dict["audit_history"] = []
        goal_dict["status"] = "active"


        result = await db.Goals.insert_one(goal_dict)
        created_goal = await db.Goals.find_one({"id": unique_id})

        return GoalResponse(**created_goal)
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=400, detail=f"Error creating goal: {str(e)}")


#==========================Get all goals with optional filters==========================
@app.get("/goals/", response_model=List[GoalResponse])
async def get_goals(
    category: Optional[str] = None,
    department: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
):
    try:
        query = {}
        if category:
            query["goal_category"] = category
        if department:
            query["responsible_department"] = department
        if status:
            query["status"] = status

        cursor = db.Goals.find(query).skip(skip).limit(limit).sort("created_at", -1)
        goals = await cursor.to_list(length=limit)

        goal_responses = []
        for goal in goals:
            goal_responses.append(GoalResponse(
                id=goal["id"],
                name=goal.get("name"),
                target_metric=goal.get("target_metric"),
                goal_category=goal.get("goal_category"),
                current_progress=goal.get("current_progress"),
                responsible_department=goal.get("responsible_department"),
                deadline=goal.get("deadline"),
                success_probability=goal.get("success_probability"),
                audit_period=goal.get("audit_period"),
                milestones=goal.get("milestones", []),
                risks=goal.get("risks", []),
                progress_history=goal.get("progress_history", []),
                audit_history=goal.get("audit_history", []),
                created_at=goal.get("created_at"),
                updated_at=goal.get("updated_at"),
                created_by=goal.get("created_by"),
                status=goal.get("status")
            ))

        return goal_responses
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching goals: {str(e)}")

#=========================Get dashboard analytics for goals===========================
@app.get("/goals/analytics/dashboard")
async def get_goals_dashboard():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_goals": {"$sum": 1},
                    "active_goals": {
                        "$sum": {"$cond": [{"$eq": ["$status", "active"]}, 1, 0]}
                    },
                    "completed_goals": {
                        "$sum": {"$cond": [{"$eq": ["$status", "completed"]}, 1, 0]}
                    },
                    "avg_progress": {"$avg": "$current_progress"},
                    "avg_success_probability": {"$avg": "$success_probability"}
                }
            }
        ]
        
        result = await db.Goals.aggregate(pipeline).to_list(length=1)
        
        if result:
            stats = result[0]
            del stats["_id"]
        else:
            stats = {
                "total_goals": 0,
                "active_goals": 0,
                "completed_goals": 0,
                "avg_progress": 0,
                "avg_success_probability": 0
            }
        
        category_pipeline = [
            {
                "$group": {
                    "_id": "$goal_category",
                    "count": {"$sum": 1},
                    "avg_progress": {"$avg": "$current_progress"}
                }
            }
        ]
        
        category_stats = await db.Goals.aggregate(category_pipeline).to_list(length=10)
        
        dept_pipeline = [
            {
                "$group": {
                    "_id": "$responsible_department",
                    "count": {"$sum": 1},
                    "avg_progress": {"$avg": "$current_progress"}
                }
            }
        ]
        
        dept_stats = await db.Goals.aggregate(dept_pipeline).to_list(length=20)
        
        return {
            "overall_stats": stats,
            "by_category": category_stats,
            "by_department": dept_stats
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching dashboard: {str(e)}")


#======================Get a specific goal by ID===========================
@app.get("/goals/{goal_id}", response_model=GoalResponse)
async def get_goal_by_id(goal_id: str):
    try:
        goal = await db.Goals.find_one({"id": goal_id})
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return GoalResponse(**goal)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching goal: {str(e)}")

#=======================Update a goal============================
@app.put("/goals/{goal_id}", response_model=GoalResponse)
async def update_goal(goal_id: str, update_input: UpdateGoalInput):
    try:
        update_data = {
            k: (datetime.combine(v, datetime.min.time()) if isinstance(v, date) else v) for k, v in update_input.dict().items() if v is not None
        }

        if not update_data:
            print("No data provided for update")
            raise HTTPException(status_code=400, detail="No data provided for update")

        update_data["updated_at"] = datetime.utcnow()

        result = await db.Goals.update_one(
            {"id": goal_id},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            print("Goal not found")
            raise HTTPException(status_code=404, detail="Goal not found")

        updated_goal = await db.Goals.find_one({"id": goal_id})
        return GoalResponse(**updated_goal)

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating goal: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error updating goal: {str(e)}")

#======================Add progress entry to a goal==============================
@app.post("/goals/progress/")
async def add_progress(progress_input: AddProgressInput):
    print(progress_input)
    try:
        goal_id = progress_input.goal_id
        
        progress_entry = ProgressEntry(
            date=datetime.now().date(),
            progress_percentage=progress_input.progress_percentage,
            notes=progress_input.notes,
            updated_by=progress_input.updated_by
        )
        progress_dict = progress_entry.dict()
        progress_dict["date"] = datetime.combine(progress_dict["date"], datetime.min.time())
        set = {}
        if progress_input.progress_percentage >=100:
            set =  {
                    "current_progress": progress_input.progress_percentage,
                    "updated_at": datetime.utcnow(),
                    "status": "completed"
                }
        else :
            set = {
                    "current_progress": progress_input.progress_percentage,
                    "updated_at": datetime.utcnow()
                }
        print(progress_entry)
        result = await db.Goals.update_one(
            {"id": goal_id},
            {
                "$push": {"progress_history":progress_dict},
                "$set": set
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {"message": "Progress added successfully", "goal_id": goal_id , "data":progress_dict}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error adding progress: {str(e)}")

#=======================Add milestone to a goal============================
@app.post("/goals/milestones/")
async def add_milestone(milestone_input: AddMilestoneInput):
    try:
        goal_id = milestone_input.goal_id
        
        result = await db.Goals.update_one(
            {"id": goal_id},
            {
                "$push": {"milestones": milestone_input.milestone.dict()},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {"message": "Milestone added successfully", "goal_id": goal_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error adding milestone: {str(e)}")

#======================== Update milestone status =============================
@app.put("/goals/milestones/")
async def update_milestone(milestone_update: UpdateMilestoneInput):
    try:
        goal_id = milestone_update.goal_id
        
        update_fields = {
            "milestones.$.completed": milestone_update.completed,
        }
        
        if milestone_update.completion_date:
            update_fields["milestones.$.completion_date"] = milestone_update.completion_date
        
        result = await db.Goals.update_one(
            {
                "id": goal_id,
                "milestones.name": milestone_update.milestone_name
            },
            {
                "$set": {
                    **update_fields,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Goal or milestone not found")
        
        return {"message": "Milestone updated successfully", "goal_id": goal_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating milestone: {str(e)}")


#=====================Add audit entry to a goal==========================
@app.post("/goals/audit/")
async def add_audit_entry(audit_input: AddAuditInput):
    try:
        goal_id = audit_input.goal_id
        
        goal = await db.Goals.find_one({"id": goal_id})
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        milestones = goal.get("milestones", [])
        milestones_completed = sum(1 for m in milestones if m.get("completed", False))
        total_milestones = len(milestones)
        
        audit_entry = AuditEntry(
            audit_date=date.today(),
            auditor=audit_input.auditor,
            current_progress=audit_input.current_progress,
            milestones_completed=milestones_completed,
            total_milestones=total_milestones,
            success_probability=audit_input.success_probability,
            notes=audit_input.notes,
            recommendations=audit_input.recommendations,
            risks_identified=audit_input.risks_identified
        )
        
        result = await db.Goals.update_one(
            {"id": goal_id},
            {
                "$push": {"audit_history": audit_entry.dict()},
                "$set": {
                    "current_progress": audit_input.current_progress,
                    "success_probability": audit_input.success_probability,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {"message": "Audit entry added successfully", "goal_id": goal_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error adding audit entry: {str(e)}")

#====================Delete a goal==============================
@app.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    try:
        result = await db.Goals.delete_one({"id": goal_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {"message": "Goal deleted successfully", "goal_id": goal_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting goal: {str(e)}")

@app.post("/add-report", response_model=Report)
async def add_report(data: ReportCreate):
    try:
        report_doc = {
            "report_id": f"RPT_{uuid.uuid4().hex[:8]}",
            "report_name": data.report_name,
            "type": data.type.value,
            "department" : data.department,
            "description": data.description,
            "uploaded_by": data.uploaded_by,
            "document_link": str(data.document_link) if data.document_link else None, 
            "is_open": data.is_open,
            "uploaded_on": datetime.utcnow()
        }

        await db.Reports.insert_one(report_doc)
        return Report(**report_doc)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating report: {str(e)}")

@app.get("/all-reports", response_model=List[Report])
async def get_all_reports():
    try:
        cursor = db.Reports.find()
        reports_raw = await cursor.to_list(length=None)

        reports = [
            Report(
                report_id=doc["report_id"],
                report_name=doc["report_name"],
                type=ReportType(doc["type"]),
                description=doc.get("description"),
                uploaded_by=doc["uploaded_by"],
                department=doc["department"],
                document_link=doc.get("document_link"),
                is_open=doc["is_open"],
                uploaded_on=doc["uploaded_on"]
            )
            for doc in reports_raw
        ]

        return reports

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reports: {str(e)}")


@app.head("/health")
async def head_health_status():
    headers = {
        "X-App-Version": "1.0.0",
        "X-Server-Time": datetime.utcnow().isoformat() + "Z"
    }
    return Response(status_code=200, headers=headers)