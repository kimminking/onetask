from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from database import get_db
from models import Task, Urgency, Status

router = APIRouter(prefix="/tasks", tags=["tasks"])


class TaskCreate(BaseModel):
    title: str
    category: Optional[str] = None
    urgency: Urgency = Urgency.normal
    due_at: Optional[datetime] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    urgency: Optional[Urgency] = None
    status: Optional[Status] = None
    order: Optional[int] = None
    due_at: Optional[datetime] = None


class TaskReorder(BaseModel):
    ids: list[int]


@router.get("/history")
def get_task_history(year: int, month: int, db: Session = Depends(get_db)):
    import calendar as cal
    first_day = datetime(year, month, 1, tzinfo=timezone.utc)
    last_day = datetime(year, month, cal.monthrange(year, month)[1], 23, 59, 59, tzinfo=timezone.utc)
    return (
        db.query(Task)
        .filter(Task.status == Status.done, Task.done_at >= first_day, Task.done_at <= last_day)
        .order_by(Task.done_at)
        .all()
    )


@router.get("/")
def get_tasks(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Task)
    if status:
        q = q.filter(Task.status == status)
    return q.order_by(Task.order, Task.created_at).all()


@router.post("/")
def create_task(body: TaskCreate, db: Session = Depends(get_db)):
    max_order = db.query(func.max(Task.order)).scalar() or 0
    task = Task(**body.model_dump(), order=max_order + 1)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}")
def update_task(task_id: int, body: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    data = body.model_dump(exclude_unset=True)
    if data.get("status") == Status.done and task.status != Status.done:
        data["done_at"] = datetime.now(timezone.utc)
    elif data.get("status") == Status.todo:
        data["done_at"] = None

    for k, v in data.items():
        setattr(task, k, v)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"ok": True}


@router.get("/scheduled")
def get_scheduled_tasks(year: int, month: int, db: Session = Depends(get_db)):
    import calendar as cal
    first_day = datetime(year, month, 1, tzinfo=timezone.utc)
    last_day = datetime(year, month, cal.monthrange(year, month)[1], 23, 59, 59, tzinfo=timezone.utc)
    return (
        db.query(Task)
        .filter(Task.due_at >= first_day, Task.due_at <= last_day)
        .order_by(Task.due_at)
        .all()
    )


@router.post("/reorder")
def reorder_tasks(body: TaskReorder, db: Session = Depends(get_db)):
    for i, task_id in enumerate(body.ids):
        db.query(Task).filter(Task.id == task_id).update({"order": i})
    db.commit()
    return {"ok": True}
