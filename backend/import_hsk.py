"""
HSK 3~6 단어 데이터 다운로드 및 DB 임포트
clem109/hsk-vocabulary 레포 사용 (hanzi, pinyin, translations)
"""
import urllib.request
import json
from database import SessionLocal, engine
from models import Base, Word
from sqlalchemy import text

BASE_URL = "https://raw.githubusercontent.com/clem109/hsk-vocabulary/master/hsk-vocab-json"
LEVELS = [3, 4, 5, 6]


def ensure_hsk_level_column():
    """hsk_level 컬럼이 없으면 추가"""
    with engine.connect() as conn:
        conn.execute(text(
            "ALTER TABLE words ADD COLUMN IF NOT EXISTS hsk_level INTEGER"
        ))
        conn.commit()


def fetch_level(level: int) -> list[dict]:
    url = f"{BASE_URL}/hsk-level-{level}.json"
    print(f"  다운로드 중: {url}")
    with urllib.request.urlopen(url, timeout=15) as res:
        return json.loads(res.read().decode())


def meaning_from_translations(translations: list[str]) -> str:
    """영어 translations 배열 → 간결한 뜻 문자열"""
    # CL: 분류사 항목 제거, 앞 3개만 사용
    clean = [t for t in translations if not t.startswith("CL:")][:3]
    return "; ".join(clean) if clean else translations[0]


def run():
    Base.metadata.create_all(bind=engine)
    ensure_hsk_level_column()

    db = SessionLocal()
    try:
        total = 0
        for level in LEVELS:
            existing_count = db.query(Word).filter(Word.hsk_level == level).count()
            if existing_count > 0:
                print(f"HSK {level}: 이미 {existing_count}개 있음, 스킵")
                continue

            print(f"HSK {level} 처리 중...")
            try:
                entries = fetch_level(level)
            except Exception as e:
                print(f"  FAIL: {e}")
                continue

            words = []
            for entry in entries:
                meaning = meaning_from_translations(entry["translations"])
                words.append(Word(
                    chinese=entry["hanzi"],
                    pinyin=entry["pinyin"],
                    meaning=meaning,
                    hsk_level=level,
                ))

            db.bulk_save_objects(words)
            db.commit()
            print(f"  OK: {len(words)}개 저장 완료")
            total += len(words)

        print(f"\n총 {total}개 단어 임포트 완료.")

    finally:
        db.close()


if __name__ == "__main__":
    run()
