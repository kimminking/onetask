"""
english_words 테이블에 level 컬럼 추가 + wordfreq 빈도 기반 레벨 할당
A1: 상위 1,000 / A2: 1,001-3,000 / B1: 3,001-6,000 / B2: 6,001-10,000 / C1: 10,001+
"""
import io
import sys
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text
from wordfreq import zipf_frequency

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://onetask:onetask@localhost/onetask")
engine = create_engine(DATABASE_URL)


def zipf_to_level(word: str) -> str:
    """zipf 빈도 점수(0~8)로 CEFR 레벨 추정.
    zipf >= 6.0 → A1 (매우 흔함: the, be, have)
    zipf >= 5.0 → A2
    zipf >= 4.0 → B1
    zipf >= 3.0 → B2
    zipf <  3.0 → C1
    """
    z = zipf_frequency(word, "en")
    if z >= 6.0:
        return "A1"
    elif z >= 5.0:
        return "A2"
    elif z >= 4.0:
        return "B1"
    elif z >= 3.0:
        return "B2"
    else:
        return "C1"


def run():
    # 1. level 컬럼 추가
    with engine.connect() as conn:
        conn.execute(text("""
            ALTER TABLE english_words
            ADD COLUMN IF NOT EXISTS level VARCHAR(2)
        """))
        conn.commit()
    print("level 컬럼 추가 완료.")

    # 2. 모든 단어 조회
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT id, word FROM english_words ORDER BY id")).fetchall()
    print(f"총 {len(rows)}개 단어 레벨 계산 중...")

    # 3. 레벨 계산 후 배치 업데이트
    batch_size = 500
    updates = [{"id": row[0], "level": zipf_to_level(row[1])} for row in rows]

    with engine.connect() as conn:
        for i in range(0, len(updates), batch_size):
            batch = updates[i:i + batch_size]
            conn.execute(text("UPDATE english_words SET level = :level WHERE id = :id"), batch)
            conn.commit()
            print(f"  {min(i + batch_size, len(updates))}/{len(updates)} 완료...")

    # 4. 레벨별 분포 출력
    with engine.connect() as conn:
        rows = conn.execute(text("""
            SELECT level, COUNT(*) as cnt
            FROM english_words
            GROUP BY level
            ORDER BY level
        """)).fetchall()
    print("\n레벨별 분포:")
    for level, cnt in rows:
        print(f"  {level}: {cnt}개")


if __name__ == "__main__":
    run()
