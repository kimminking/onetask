"""
영어 단어 import 스크립트
- MUSE en-ko 사전 다운로드 (Facebook Research)
- 음역(transliteration) 필터링
- english_words 테이블 생성 및 데이터 삽입
"""
import os
import re
import sys
import io
import urllib.request
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://onetask:onetask@localhost/onetask")
engine = create_engine(DATABASE_URL)

MUSE_URL = "https://dl.fbaipublicfiles.com/arrival/dictionaries/en-ko.txt"
LOCAL_FILE = "en-ko.txt"

# 한글 음절 범위
HANGUL_RE = re.compile(r"[\uAC00-\uD7A3]")
# 한글 음역 패턴: 받침 없고 짧은 음절들 (영어 발음을 그대로 쓴 것)
# "퍼스트", "베이스" 같은 것들은 한글 글자 수가 영어 단어 글자 수와 비슷하고
# 일반 형용사/동사 뜻이 아닌 경우 필터링


def is_transliteration(en_word: str, ko_word: str) -> bool:
    """음역(발음 그대로 한글로 쓴 것)인지 판별."""
    # 한글이 없으면 제외
    if not HANGUL_RE.search(ko_word):
        return True
    # 한글이 너무 적으면 제외
    hangul_chars = HANGUL_RE.findall(ko_word)
    if len(hangul_chars) < 1:
        return True
    # 영어 단어가 숫자/특수문자면 제외
    if not re.match(r"^[a-zA-Z\-']+$", en_word):
        return True
    return False


def download_muse():
    if not os.path.exists(LOCAL_FILE):
        print("MUSE en-ko 다운로드 중...")
        urllib.request.urlretrieve(MUSE_URL, LOCAL_FILE)
        print("다운로드 완료.")
    else:
        print(f"{LOCAL_FILE} 이미 존재함, 스킵.")


def load_pairs() -> list[tuple[str, str]]:
    pairs = []
    seen_en = set()
    with open(LOCAL_FILE, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split("\t")
            if len(parts) != 2:
                continue
            en, ko = parts[0].strip().lower(), parts[1].strip()
            if en in seen_en:
                continue
            if is_transliteration(en, ko):
                continue
            # 너무 짧거나 긴 단어 제외
            if len(en) < 2 or len(en) > 30:
                continue
            seen_en.add(en)
            pairs.append((en, ko))
    return pairs


def create_table():
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS english_words (
                id SERIAL PRIMARY KEY,
                word VARCHAR(100) NOT NULL UNIQUE,
                meaning VARCHAR(500) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        """))
        conn.commit()
    print("english_words 테이블 준비 완료.")


def insert_pairs(pairs: list[tuple[str, str]]):
    batch_size = 500
    total = 0
    with engine.connect() as conn:
        for i in range(0, len(pairs), batch_size):
            batch = pairs[i:i + batch_size]
            conn.execute(text("""
                INSERT INTO english_words (word, meaning)
                VALUES (:word, :meaning)
                ON CONFLICT (word) DO NOTHING
            """), [{"word": en, "meaning": ko} for en, ko in batch])
            conn.commit()
            total += len(batch)
            print(f"  {total}/{len(pairs)} 삽입됨...")
    print(f"\n총 {total}개 처리 완료.")


def run():
    download_muse()
    pairs = load_pairs()
    print(f"필터링 후 유효 단어 수: {len(pairs)}개")
    if pairs:
        print("샘플 10개:")
        for en, ko in pairs[:10]:
            print(f"  {en} → {ko}")
    create_table()
    insert_pairs(pairs)

    # 최종 카운트 확인
    with engine.connect() as conn:
        count = conn.execute(text("SELECT COUNT(*) FROM english_words")).scalar()
    print(f"\nenglish_words 테이블 총 {count}개 단어 저장됨.")


if __name__ == "__main__":
    run()
