"""
Tatoeba 영어 문장 2M개에서 B1 단어 예문 매칭 후 Google Translate로 한국어 번역
"""
import io, sys, os, re, bz2, time, random
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

import urllib.request
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from deep_translator import GoogleTranslator

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://onetask:onetask@localhost/onetask")
engine = create_engine(DATABASE_URL)

ENG_URL  = "https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2"
ENG_FILE = "tatoeba_eng.tsv.bz2"

translator = GoogleTranslator(source="en", target="ko")
SLEEP_SEC  = 0.3   # Google Translate 요청 간격


def download(url, path):
    if os.path.exists(path):
        print(f"  이미 존재: {path}")
        return
    print(f"  다운로드 중 ({url})")
    urllib.request.urlretrieve(url, path)
    print(f"  완료")


def load_eng_sentences(path) -> dict[int, str]:
    result = {}
    with bz2.open(path, "rt", encoding="utf-8") as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 3:
                try:
                    result[int(parts[0])] = parts[2]
                except ValueError:
                    pass
    return result


def build_word_index(sentences: dict[int, str]) -> dict[str, list[int]]:
    """word → [sentence_id, ...] (소문자 매칭)"""
    index: dict[str, list[int]] = {}
    for sid, text in sentences.items():
        for w in set(re.findall(r"\b[a-z]+\b", text.lower())):
            index.setdefault(w, []).append(sid)
    print(f"  인덱스 단어 수: {len(index):,}개")
    return index


def pick_sentence(word: str, candidates: list[int], sentences: dict[int, str]) -> str | None:
    """6~12단어, 단어 포함 확인, 랜덤 선택"""
    pattern = re.compile(rf"\b{re.escape(word)}\b", re.IGNORECASE)
    good = [s for s in candidates
            if 6 <= len(sentences[s].split()) <= 12
            and pattern.search(sentences[s])]
    fallback = [s for s in candidates
                if pattern.search(sentences[s])
                and len(sentences[s].split()) <= 20]
    pool = good if good else fallback
    if not pool:
        return None
    return sentences[random.choice(pool[:50])]  # 앞쪽 50개 중 랜덤


def add_columns():
    with engine.connect() as conn:
        for col in ("example_en", "example_ko"):
            try:
                conn.execute(text(f"ALTER TABLE english_words ADD COLUMN {col} TEXT"))
                conn.commit()
                print(f"  {col} 추가됨")
            except Exception:
                print(f"  {col} 이미 존재")


def fetch_target_words(level="B1") -> list[tuple[int, str]]:
    with engine.connect() as conn:
        rows = conn.execute(text(
            "SELECT id, word FROM english_words "
            "WHERE level = :level AND (example_en IS NULL OR example_en = '') "
            "ORDER BY id"
        ), {"level": level}).fetchall()
    return [(r[0], r[1]) for r in rows]


def run():
    add_columns()

    print("\n영어 문장 다운로드...")
    download(ENG_URL, ENG_FILE)

    print("\n영어 문장 로드 중...")
    eng = load_eng_sentences(ENG_FILE)
    print(f"  {len(eng):,}개 로드됨")

    print("\n단어 인덱스 구축 중...")
    index = build_word_index(eng)

    words = fetch_target_words("B1")
    total = len(words)
    print(f"\nB1 단어 {total}개 예문 생성 시작\n")

    success, missed = 0, []

    for i, (wid, word) in enumerate(words, 1):
        candidates = index.get(word.lower(), [])
        en_text = pick_sentence(word, candidates, eng) if candidates else None

        if not en_text:
            missed.append(word)
            if i % 100 == 0:
                print(f"  [{i}/{total}] 진행 중... (성공 {success}개)")
            continue

        try:
            ko_text = translator.translate(en_text)
        except Exception as e:
            print(f"  번역 실패 ({word}): {e}")
            missed.append(word)
            continue

        with engine.connect() as conn:
            conn.execute(text(
                "UPDATE english_words SET example_en=:en, example_ko=:ko WHERE id=:id"
            ), {"en": en_text, "ko": ko_text, "id": wid})
            conn.commit()

        success += 1

        if i % 100 == 0 or i == total:
            print(f"  [{i}/{total}] {word}: {en_text[:50]}...")

        time.sleep(SLEEP_SEC)

    print(f"\n=== 완료 ===")
    print(f"성공: {success}개 / 실패: {len(missed)}개")

    print("\n샘플 10개:")
    with engine.connect() as conn:
        rows = conn.execute(text(
            "SELECT word, example_en, example_ko FROM english_words "
            "WHERE level='B1' AND example_en IS NOT NULL LIMIT 10"
        )).fetchall()
    for word, ex_en, ex_ko in rows:
        print(f"  {word}")
        print(f"    {ex_en}")
        print(f"    {ex_ko}")


if __name__ == "__main__":
    run()
