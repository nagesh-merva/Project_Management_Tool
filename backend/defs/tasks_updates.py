import random
from datetime import datetime
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.updatesAndtask import UpdateTask, AddComment

db: AsyncIOMotorDatabase = None

def set_db(database: AsyncIOMotorDatabase):
    """Initialize database from main app"""
    global db
    db = database


# ================= Get All Updates ====================
async def get_updates(emp_id: str):
    """Get all updates for an employee"""
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
async def add_update(update_data: dict):
    """Add new update"""
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
async def get_tasks(emp_id: str):
    """Get all tasks assigned to an employee"""
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
        created_by = await db.Employees.find_one({"emp_id": task["created_by"]}, {"password": 0})
        emps = []
        for member in task["members_assigned"]:
            emp_id_val = member["emp_id"] if isinstance(member, dict) and "emp_id" in member else member
            emp = await db.Employees.find_one({"emp_id": emp_id_val}, {"password": 0})
            if emp:
                emps.append({
                    "emp_id": emp["emp_id"],
                    "status": member.get("status"),
                    "emp_name": emp["emp_name"],
                    "role": emp["role"],
                })
        task["members_assigned"] = emps
        task["created_by"] = {
                "emp_id": created_by["emp_id"],
                "emp_name": created_by["emp_name"],
                "role": created_by["role"],
                "profile": created_by.get("profile", "")
            }
        if task["status"] != "done":
            tasks.append(task)

    return tasks


# ================= Add Task ====================
async def add_task(task_data: dict):
    """Add new task"""
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
async def update_task_status(update: UpdateTask):
    """Update status of a task"""
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
async def add_comment(comment: AddComment):
    """Add comment to task"""
    task_id = comment.task_id
    emp_name = comment.emp_name
    comment_text = comment.comment_text
    if not emp_name or not task_id or not comment_text:
        raise HTTPException(status_code=400, detail="Employee ID, Task ID, and comment text are required.")
    
    comment_obj = {
        "emp_name": emp_name,
        "comment": comment_text,
        "commented_on": datetime.utcnow()
    }

    result = await db.Tasks.update_one(
        {"task_id": task_id},
        {"$push": {"comments": comment_obj}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found.")

    return {"message": "Comment added successfully.", "task_id": task_id}
