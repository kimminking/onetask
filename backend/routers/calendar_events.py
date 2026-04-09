from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from models import CalendarEvent

router = APIRouter(prefix="/calendar-events", tags=["calendar-events"])


class EventCreate(BaseModel):
    title: str
    event_date: str   # "YYYY-MM-DD"
    event_time: Optional[str] = None  # "HH:MM"


@router.get("/")
def get_events(year: int, month: int, db: Session = Depends(get_db)):
    prefix = f"{year}-{month:02d}"
    return db.query(CalendarEvent).filter(CalendarEvent.event_date.startswith(prefix)).order_by(CalendarEvent.event_date, CalendarEvent.event_time).all()


@router.post("/")
def create_event(body: EventCreate, db: Session = Depends(get_db)):
    event = CalendarEvent(**body.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"ok": True}
