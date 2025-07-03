from pydantic import BaseModel
from typing import List, Union, Optional
from datetime import datetime
from enum import Enum

class Update(BaseModel):
    id: str  # You can also use Optional[str] if MongoDB will auto-generate _id
    title: str
    brief: str
    update_by: str  # emp_id of the person who posted the update
    to: Union[str, List[str]]  # 'all' or a list of specific emp_ids
    link: Optional[str] = None  # Can be optional
    created_on: datetime = datetime.utcnow()  # Auto timestamp (optional)

class TaskStatus(str, Enum):
    assigned = "assigned"
    done = "done"
    uncomplete = "uncomplete"

class AssignedMember(BaseModel):
    emp_id: str
    status: TaskStatus = TaskStatus.assigned
    
class PriorityLevel(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

class Comment(BaseModel):
    emp_id: str
    comment: str
    commented_on: datetime = datetime.utcnow()

class Task(BaseModel):
    task_id: str
    title: str
    brief: str
    created_by: str
    deadline: datetime
    members_assigned: List[AssignedMember]
    status: TaskStatus = TaskStatus.assigned
    priority: PriorityLevel = PriorityLevel.medium  
    comments: List[Comment] = []  
    proj_id: Optional[str] = None
    created_on: datetime = datetime.utcnow()
    
class UpdateTask (BaseModel):
    task_id: str
    emp_id: str
    status: TaskStatus
    
class AddComment(BaseModel):
    task_id: str
    emp_id: str
    comment_text: str