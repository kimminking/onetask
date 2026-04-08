from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from fsrs import Scheduler, Card, Rating, State

from database import get_db
from models import Word, WordCard

router = APIRouter(prefix="/words", tags=["words"])
scheduler = Scheduler()


# ── Pydantic ──────────────────────────────────────────────
class WordCreate(BaseModel):
    chinese: str
    pinyin: str
    meaning: str
    example_zh: Optional[str] = None
    example_ko: Optional[str] = None


class ReviewRequest(BaseModel):
    knew: bool  # True=알았음, False=몰랐음


# ── 헬퍼 ──────────────────────────────────────────────────
def _card_from_db(wc: WordCard) -> Card:
    """DB 레코드 → fsrs Card 객체. state=0은 미복습(신규)이므로 fresh Card 반환."""
    c = Card()
    if wc.reps == 0 or wc.state == 0:
        return c  # 신규 카드는 기본값 사용
    c.state = State(wc.state)
    c.step = wc.step or 0
    c.stability = wc.stability or 0.0
    c.difficulty = wc.difficulty or 0.0
    c.due = wc.due
    c.last_review = wc.last_review
    return c


def _sync_card_to_db(wc: WordCard, c: Card, lapses_delta: int = 0):
    """fsrs Card 객체 → DB 레코드 동기화"""
    wc.state = c.state.value
    wc.step = c.step
    wc.stability = c.stability
    wc.difficulty = c.difficulty
    wc.due = c.due
    wc.last_review = c.last_review
    wc.reps += 1
    wc.lapses += lapses_delta


def _word_with_card(word: Word, wc: Optional[WordCard]) -> dict:
    now = datetime.now(timezone.utc)
    due = wc.due if wc else now
    return {
        "id": word.id,
        "chinese": word.chinese,
        "pinyin": word.pinyin,
        "meaning": word.meaning,
        "example_zh": word.example_zh,
        "example_ko": word.example_ko,
        "audio_path": word.audio_path,
        "created_at": word.created_at,
        # 카드 상태
        "state": wc.state if wc else 0,
        "reps": wc.reps if wc else 0,
        "lapses": wc.lapses if wc else 0,
        "due": due,
        "is_due": due <= now,
    }


# ── 엔드포인트 ─────────────────────────────────────────────
@router.get("/")
def get_words(hsk_level: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Word)
    if hsk_level:
        q = q.filter(Word.hsk_level == hsk_level)
    words = q.order_by(Word.id).all()
    cards = {wc.word_id: wc for wc in db.query(WordCard).all()}
    return [_word_with_card(w, cards.get(w.id)) for w in words]


@router.get("/due")
def get_due_words(hsk_level: Optional[int] = None, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    q = db.query(Word)
    if hsk_level:
        q = q.filter(Word.hsk_level == hsk_level)
    words = q.order_by(Word.id).all()
    cards = {wc.word_id: wc for wc in db.query(WordCard).all()}
    due_words = []
    for w in words:
        wc = cards.get(w.id)
        if wc is None or wc.due <= now:
            due_words.append(_word_with_card(w, wc))
    return due_words


@router.get("/stats")
def get_stats(hsk_level: Optional[int] = None, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    q = db.query(Word)
    if hsk_level:
        q = q.filter(Word.hsk_level == hsk_level)
    words = q.all()
    word_ids = {w.id for w in words}
    cards = [wc for wc in db.query(WordCard).all() if wc.word_id in word_ids]
    reviewed_ids = {wc.word_id for wc in cards}
    total = len(words)
    reviewed = len(reviewed_ids)
    due = sum(1 for c in cards if c.due <= now) + (total - reviewed)
    return {"total": total, "reviewed": reviewed, "new": total - reviewed, "due": due}


@router.post("/")
def create_word(body: WordCreate, db: Session = Depends(get_db)):
    word = Word(**body.model_dump())
    db.add(word)
    db.commit()
    db.refresh(word)
    return word


@router.post("/{word_id}/review")
def review_word(word_id: int, body: ReviewRequest, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")

    wc = db.query(WordCard).filter(WordCard.word_id == word_id).first()
    if wc is None:
        wc = WordCard(word_id=word_id)
        db.add(wc)
        db.flush()

    rating = Rating.Good if body.knew else Rating.Again
    card = _card_from_db(wc)
    updated_card, _ = scheduler.review_card(card, rating)

    lapses_delta = 1 if not body.knew else 0
    _sync_card_to_db(wc, updated_card, lapses_delta)
    db.commit()

    return {
        "word_id": word_id,
        "knew": body.knew,
        "next_due": wc.due,
        "state": wc.state,
        "reps": wc.reps,
    }


@router.delete("/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db)):
    word = db.query(Word).filter(Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()
    return {"ok": True}
