from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from database import get_db
from models import User
from auth_utils import get_master_user

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/overview")
def admin_overview(db: Session = Depends(get_db), _: User = Depends(get_master_user)):
    """마스터 전용: 시스템 전체 현황"""
    with db.connection() as conn:
        # 단어 현황
        zh_counts = {
            row[0]: row[1]
            for row in conn.execute(text(
                "SELECT hsk_level, COUNT(*) FROM words GROUP BY hsk_level ORDER BY hsk_level"
            ))
        }
        en_counts = {
            row[0]: row[1]
            for row in conn.execute(text(
                "SELECT level, COUNT(*) FROM english_words GROUP BY level ORDER BY level"
            ))
        }
        ja_counts = {
            row[0]: row[1]
            for row in conn.execute(text(
                "SELECT jlpt_level, COUNT(*) FROM japanese_words GROUP BY jlpt_level ORDER BY jlpt_level"
            ))
        }

        # 플래시카드 현황
        zh_cards = conn.execute(text("SELECT COUNT(*) FROM word_cards WHERE reps > 0")).scalar()
        en_cards = conn.execute(text("SELECT COUNT(*) FROM english_word_cards WHERE reps > 0")).scalar()
        ja_cards = conn.execute(text("SELECT COUNT(*) FROM japanese_word_cards WHERE reps > 0")).scalar()

        # 할일/완료 현황
        task_todo = conn.execute(text("SELECT COUNT(*) FROM tasks WHERE status='todo'")).scalar()
        task_done = conn.execute(text("SELECT COUNT(*) FROM tasks WHERE status='done'")).scalar()

        # 캘린더
        cal_count = conn.execute(text("SELECT COUNT(*) FROM calendar_events")).scalar()

        # 유저
        users = [
            {"id": r[0], "username": r[1], "is_master": r[2]}
            for r in conn.execute(text("SELECT id, username, is_master FROM users ORDER BY id"))
        ]

    return {
        "words": {
            "zh": {"total": sum(zh_counts.values()), "by_level": zh_counts, "reviewed": zh_cards},
            "en": {"total": sum(en_counts.values()), "by_level": en_counts, "reviewed": en_cards},
            "ja": {"total": sum(ja_counts.values()), "by_level": ja_counts, "reviewed": ja_cards},
        },
        "tasks": {"todo": task_todo, "done": task_done},
        "calendar": {"total": cal_count},
        "users": users,
    }
