from fastapi import FastAPI, HTTPException, Depends,Body ,UploadFile , File,Form
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from models.dept import Employee, Department, EmpPerformanceMetrics ,EmployeeInput, EmployeeSummary,EmployeeResponse,EmployeesByDeptResponse ,EmpDocuments
from models.updatesAndtask import  UpdateTask,AddComment
from models.project import Project,AddProjectRequest ,QuickLinks ,SRS ,FinancialData,PerformanceMetrics,ProjectPhaseUpdate
from models.clients import Client, ClientMetrics, ClientDocuments, ContactPerson, ClientEngagement ,BasicClientInput,UpdateClientInput ,ClientDocuments ,ClientNote
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import EmailStr
# from bson import ObjectId
from jose import JWTError, jwt # type: ignore
from datetime import datetime, timedelta,date ,timezone
import firebase_admin # type: ignore
from firebase_admin import credentials, storage # type: ignore
import os
import tempfile
from dotenv import load_dotenv
import random
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

cred = credentials.Certificate("firebase-adminsdk.json")

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
        file: UploadFile = File(...)
    ):
    while True:
        random_id = f"EMP{random.randint(1000, 9999)}"
        if not await db.Employees.find_one({"emp_id": random_id}):
            break

    existing_Employees = await db.Employees.find({}).to_list(1000)    
    for Employee in existing_Employees:
        if Employee.get("emp_name") == emp_name or Employee.get("email") == email or Employee.get("bank_account_number") == bank_account_number:
            raise HTTPException(
                status_code=409,
                detail=f"Employee already exists.",
                headers={"X-Frontend-Message": f"Employee already exists."}
            )  
            
    profile_url = await upload_file_to_firebase(file, folder="PMT/employee_profiles")

    print(profile_url)

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
        bank_ifsc=bank_ifsc
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

    await db.Employees.update_one(
        {"emp_id": emp_id},
        {"$push": {"emp_documents": document.dict()}}
    )

    return {"message": "Document added successfully.", "doc_url": doc_url}

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

#================= Edit Project Brief details by project_id  ============================
@app.post("/edit-project-brief")
async def edit_project_brief(data: dict):
    project_id = data.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="Project ID is required.")

    update_fields = {}

    if "descp" in data and data["descp"]:
        update_fields["descp"] = data["descp"]
    if "deadline" in data and data["deadline"]:
        update_fields["deadline"] = data["deadline"]
    if "status" in data and data["status"]:
        update_fields["status"] = data["status"]

    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields provided to update.")

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        {"$set": update_fields}
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

    if updated.modified_count == 0:
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
    file: UploadFile = File(...)
):
    if not project_id or not title or not descp:
        raise HTTPException(status_code=400, detail="project_id, title, and descp are required.")
    
    # file_id = await fs_bucket.upload_from_stream(file.filename, await file.read())

    # gridfs_link = f"/files/{str(file_id)}"

    report_entry = {
        "id": f"MAINT{random.randint(1000,9999)}",
        "title": title,
        "descp": descp,
        "issued_date": datetime.utcnow(),
        # "doc_link": gridfs_link 
    }

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        {"$push": {"issues_and_maintenance_reports": report_entry}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or report not added.")

    return {"message": f"Maintenance report '{title}' added to project {project_id}.", "doc_link": "gridfs_link"}

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
    for phase in project_phases:
        phases.append(phase["parent_phase"] if "parent_phase" in phase else "")
    return phases


#================= Add new template to templates by project_id  ============================
@app.post("/add-new-template")
async def add_template(data: dict):
    project_id = data.get("project_id")
    template_name = data.get("template_name")
    department = data.get("department")
    phase = data.get("phase")
    fields = data.get("fields")

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

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        {"$push": {"templates": template}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or template not added.")

    return {"message": f"Template '{template_name}' added to project {project_id}."}

#================= Mark the Remark fields of a template  ============================
@app.post("/mark-template-remarks")
async def mark_template_remarks(data: dict):
    project_id = data.get("project_id")
    template_id = data.get("template_id")
    verified_ids = data.get("verified_ids")

    if not project_id or not template_id or not verified_ids:
        raise HTTPException(status_code=400, detail="project_id, template_id, and verified_ids are required.")

    project = await db.Projects.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    templates = project.get("templates", [])
    template_index = None
    for i, template in enumerate(templates):
        if template.get("id") == template_id:
            template_index = i
            break

    if template_index is None:
        raise HTTPException(status_code=404, detail="Template not found.")


    for field_id in verified_ids:
        update_path = f"templates.{template_index}.fields.$[field].remark"
        db.Projects.update_one(
            {"project_id": project_id},
            {"$set": {update_path: True}},
            array_filters=[{"field.id": field_id}]
        )

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

    total_budget = data.get("total_budget", financial_data.get("total_budget"))
    expected_revenue = data.get("expected_revenue", financial_data.get("expected_revenue"))

    profit_margin = financial_data.get("profit_margin")
    prior_expected_revenue = financial_data.get("expected_revenue", 0)
    if ("total_budget" in data or "expected_revenue" in data) and total_budget and expected_revenue:
        try:
            profit_margin = round(((float(expected_revenue) - float(total_budget)) / float(expected_revenue)) * 100, 2)
        except Exception:
            profit_margin = None

    # Update client's total_billed in metrics
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
                "start_date": sub.start_date if sub.start_date else None,
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
        raise HTTPException(status_code=404, detail="Project not found")

    updated_status = []
    for phase in data.phases:
        updated_subphases = []
        for sub in phase.subphases:
            start_date = datetime.fromisoformat(sub.start_date) if sub.start_date else None
            closed_date = datetime.fromisoformat(sub.closed_date) if sub.closed_date else None

            status = infer_status(start_date, closed_date)
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

    result = await db.Projects.update_one(
        {"project_id": data.project_id},
        {"$set": {"project_status": updated_status}}
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
    print (data)
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
    print("📥 Received request to add client document")

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
        print("📄 No existing documents, assigned ID:", random_id)
    else:
        existing_ids = [doc["id"] for doc in existing_documents if "id" in doc]
        while True:
            random_id = f"CDOC{random.randint(1000, 9999)}"
            if random_id not in existing_ids:
                print("✅ Unique document ID generated:", random_id)
                break

    try:
        print("📤 Uploading document...")
        doc_link = await upload_file_to_firebase(file, folder=f"PMT/clients/{client['brand_name']}/documents")
        print("✅ Upload successful")
    except Exception as e:
        print("❌ Upload failed:", str(e))
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

    return {"message": f"✅ Document '{doc_name}' added to client {client_id}.",}

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