import random
import string
from datetime import datetime, date
from typing import Optional, List
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.goals import (
    CreateGoalInput, UpdateGoalInput, AddProgressInput, AddMilestoneInput,
    UpdateMilestoneInput, AddAuditInput, GoalResponse, ProgressEntry, AuditEntry
)

db: AsyncIOMotorDatabase = None

def set_db(database: AsyncIOMotorDatabase):
    """Initialize database from main app"""
    global db
    db = database


# ============================= Helper Functions ================================
async def generate_unique_id(collection, prefix: str, length: int = 8) -> str:
    """Generate unique ID for goals"""
    while True:
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        unique_id = f"{prefix}_{random_part}"
        
        existing = await collection.find_one({"id": unique_id})
        if not existing:
            return unique_id


# =================== Create a new goal==============================
async def create_goal(goal_input: CreateGoalInput) -> GoalResponse:
    """Create new goal"""
    try:
        unique_id = await generate_unique_id(db.Goals, "GOAL")

        goal_dict = goal_input.dict()

        # Convert top-level date
        goal_dict["deadline"] = datetime.combine(goal_input.deadline, datetime.min.time()) if goal_input.deadline else None

        # Convert milestone dates
        for m in goal_dict["milestones"]:
            m["due_date"] = datetime.combine(m["due_date"], datetime.min.time()) if m["due_date"] else None
            m["completion_date"] = datetime.combine(m["completion_date"], datetime.min.time()) if m["completion_date"] else None

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


# ==========================Get all goals with optional filters==========================
async def get_goals(
    category: Optional[str] = None,
    department: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
) -> List[GoalResponse]:
    """Get goals with optional filters"""
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


# =========================Get dashboard analytics for goals===========================
async def get_goals_dashboard():
    """Get goals dashboard analytics"""
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


# ======================Get a specific goal by ID===========================
async def get_goal_by_id(goal_id: str) -> GoalResponse:
    """Get goal by ID"""
    try:
        goal = await db.Goals.find_one({"id": goal_id})
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return GoalResponse(**goal)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching goal: {str(e)}")


# =======================Update a goal============================
async def update_goal(goal_id: str, update_input: UpdateGoalInput) -> GoalResponse:
    """Update goal"""
    try:
        update_data = {
            k: (datetime.combine(v, datetime.min.time()) if isinstance(v, date) else v) 
            for k, v in update_input.dict().items() if v is not None
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


# ======================Add progress entry to a goal==============================
async def add_progress(progress_input: AddProgressInput):
    """Add progress to goal"""
    print(progress_input)
    try:
        goal_id = progress_input.goal_id
        
        progress_entry = ProgressEntry(
            date=datetime.now(timezone.utc).date(),
            progress_percentage=progress_input.progress_percentage,
            notes=progress_input.notes,
            updated_by=progress_input.updated_by
        )
        progress_dict = progress_entry.dict()
        progress_dict["date"] = datetime.combine(progress_dict["date"], datetime.min.time())
        
        set_data = {}
        if progress_input.progress_percentage >= 100:
            set_data = {
                "current_progress": progress_input.progress_percentage,
                "updated_at": datetime.utcnow(),
                "status": "completed"
            }
        else:
            set_data = {
                "current_progress": progress_input.progress_percentage,
                "updated_at": datetime.utcnow()
            }
        print(progress_entry)
        result = await db.Goals.update_one(
            {"id": goal_id},
            {
                "$push": {"progress_history": progress_dict},
                "$set": set_data
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {"message": "Progress added successfully", "goal_id": goal_id, "data": progress_dict}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error adding progress: {str(e)}")


# =======================Add milestone to a goal============================
async def add_milestone(milestone_input: AddMilestoneInput):
    """Add milestone to goal"""
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


# ======================== Update milestone status =============================
async def update_milestone(milestone_update: UpdateMilestoneInput):
    """Update milestone status"""
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


# =====================Add audit entry to a goal==========================
async def add_audit_entry(audit_input: AddAuditInput):
    """Add audit entry to goal"""
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


# ====================Delete a goal==============================
async def delete_goal(goal_id: str):
    """Delete goal"""
    try:
        result = await db.Goals.delete_one({"id": goal_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Goal not found")
        
        return {"message": "Goal deleted successfully", "goal_id": goal_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting goal: {str(e)}")
