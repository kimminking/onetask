"""
HSK4 meaning/example 재매핑 스크립트

문제: hsk4_data.sql이 shift된 상태로 DB에 적용되어
     (meaning, example) 쌍은 올바르나 WHERE id=X가 잘못됨.

수정 방법:
  1. hsk4_data.sql + hsk4_data_fix.sql에서 (meaning, example) 쌍 읽기
  2. 각 예문이 어떤 HSK4 단어를 위해 쓰인 건지 예문 내용으로 매칭
  3. 해당 단어의 실제 DB id로 UPDATE 적용

사용법:
  python fix_hsk4_rematch.py --dry-run   # 미리보기
  python fix_hsk4_rematch.py             # 실제 수정
"""
import sys, io, re, argparse, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
engine = create_engine(os.environ.get("DATABASE_URL", "postgresql://tradediary:tradediary@localhost:5432/onetask"))

SQL_FILES = [
    "hsk4_data.sql",
    "hsk4_data_fix.sql",
]


def parse_sql_updates(filepath: str) -> list[dict]:
    """SQL 파일에서 UPDATE 문 파싱"""
    updates = []
    pattern = re.compile(
        r"UPDATE words SET meaning='([^']*)',\s*example_zh='([^']*)',\s*example_ko='([^']*)'\s+WHERE id=(\d+);",
        re.DOTALL
    )
    with open(filepath, encoding="utf-8") as f:
        content = f.read()
    for m in pattern.finditer(content):
        updates.append({
            "meaning": m.group(1),
            "example_zh": m.group(2),
            "example_ko": m.group(3),
            "original_id": int(m.group(4)),
        })
    return updates


def find_primary_word(example_zh: str, hsk4_words: list[tuple]) -> tuple | None:
    """
    예문에서 가장 관련된 HSK4 단어 찾기
    전략: 2자 이상 단어 우선, 그 중 가장 긴 것 선택
    1자 단어는 2자 이상 매칭 없을 때만 사용
    """
    matches_multi = [(wid, wch) for wid, wch in hsk4_words
                     if len(wch) >= 2 and wch in example_zh]
    if matches_multi:
        return max(matches_multi, key=lambda x: len(x[1]))

    matches_single = [(wid, wch) for wid, wch in hsk4_words
                      if len(wch) == 1 and wch in example_zh]
    if matches_single:
        return matches_single[0]  # 1자는 첫 번째만

    return None


def main(dry_run: bool):
    with engine.connect() as conn:
        # 1. DB에서 HSK4 단어 목록
        hsk4_rows = conn.execute(text(
            "SELECT id, chinese, meaning, example_zh, example_ko "
            "FROM words WHERE hsk_level=4 ORDER BY id"
        )).fetchall()
        hsk4_words = [(r[0], r[1]) for r in hsk4_rows]
        id_to_chinese = {r[0]: r[1] for r in hsk4_rows}

        print(f"HSK4 단어 수: {len(hsk4_rows)}")

        # 2. SQL 파일에서 모든 (meaning, example) 쌍 읽기
        all_updates = []
        for sql_file in SQL_FILES:
            parsed = parse_sql_updates(sql_file)
            all_updates.extend(parsed)
            print(f"  {sql_file}: {len(parsed)}개 파싱")

        print(f"  총 SQL 업데이트: {len(all_updates)}개")
        print()

        # 3. 각 SQL 줄을 올바른 단어에 매핑
        word_to_update = {}   # word_id -> {meaning, example_zh, example_ko}
        unmatched = []
        ambiguous = []

        for upd in all_updates:
            ex = upd["example_zh"]
            match = find_primary_word(ex, hsk4_words)
            if match is None:
                unmatched.append(upd)
                continue
            wid, wch = match

            if wid in word_to_update:
                ambiguous.append((wid, wch, upd, word_to_update[wid]))
                # 더 긴 예문 선택 (일반적으로 더 상세한 것이 맞음)
                if len(ex) > len(word_to_update[wid]["example_zh"]):
                    word_to_update[wid] = upd
            else:
                word_to_update[wid] = upd

        print(f"매핑 성공: {len(word_to_update)}개")
        print(f"매핑 실패 (예문에 HSK4 단어 없음): {len(unmatched)}개")
        print(f"중복 매핑 (ambiguous): {len(ambiguous)}개")
        print()

        # 4. 매핑 안 된 단어들 (이미 correct이거나 수동 필요)
        covered = set(word_to_update.keys())
        not_covered = [(r[0], r[1]) for r in hsk4_rows if r[0] not in covered]
        print(f"SQL에서 커버 안 된 단어: {len(not_covered)}개")
        if not_covered[:10]:
            print("  (처음 10개):", [(wid, wch) for wid, wch in not_covered[:10]])
        print()

        # 5. 실제 변경이 필요한 것만 필터
        # 핵심 규칙: 이미 올바른 행(예문에 단어 포함)은 건드리지 않음
        actual_changes = []
        skipped_correct = 0
        unchanged = 0
        for r in hsk4_rows:
            wid = r[0]
            if wid not in word_to_update:
                continue
            upd = word_to_update[wid]
            if r[2] == upd["meaning"] and r[3] == upd["example_zh"]:
                unchanged += 1
                continue
            # 현재 예문이 이미 올바른 경우 → 스킵 (덮어쓰기 금지)
            current_example = r[3] or ""
            if r[1] in current_example:
                skipped_correct += 1
                continue
            actual_changes.append({
                "id": wid,
                "chinese": r[1],
                "old_meaning": r[2],
                "new_meaning": upd["meaning"],
                "old_example_zh": r[3],
                "new_example_zh": upd["example_zh"],
                "old_example_ko": r[4],
                "new_example_ko": upd["example_ko"],
            })

        print(f"실제 변경 필요: {len(actual_changes)}개 (이미 정확해서 스킵: {skipped_correct}개, 변경 없음: {unchanged}개)")
        print()

        # 6. 미리보기
        print("=== 변경 샘플 (처음 20개) ===")
        for c in actual_changes[:20]:
            print(f"id={c['id']:4d} {c['chinese']:8s}")
            print(f"  뜻: [{c['old_meaning'][:20]}] → [{c['new_meaning'][:20]}]")
            new_ex_snippet = c['new_example_zh'][:40]
            match_ok = c['chinese'] in c['new_example_zh']
            print(f"  예문: {new_ex_snippet} | 단어포함:{'Y' if match_ok else 'N'}")
        print()

        # 7. 변경 후 예상 매칭률
        would_match = sum(1 for c in actual_changes if c['chinese'] in c['new_example_zh'])
        print(f"변경 후 예문-단어 일치 예상: {would_match}/{len(actual_changes)} ({would_match*100//max(1,len(actual_changes))}%)")

        if dry_run:
            print("\n=== DRY RUN: 실제 변경 없음 ===")
            print("실제 수정하려면: python fix_hsk4_rematch.py")
            return

        # 8. 실제 UPDATE
        print("=== 실제 수정 시작 ===")
        for c in actual_changes:
            conn.execute(text("""
                UPDATE words SET
                    meaning = :meaning,
                    example_zh = :example_zh,
                    example_ko = :example_ko
                WHERE id = :id
            """), {
                "id": c["id"],
                "meaning": c["new_meaning"],
                "example_zh": c["new_example_zh"],
                "example_ko": c["new_example_ko"],
            })
        conn.commit()
        print(f"  {len(actual_changes)}개 수정 완료")

        # 9. 최종 검증
        total = conn.execute(text("SELECT COUNT(*) FROM words WHERE hsk_level=4")).scalar()
        matched = conn.execute(text(
            "SELECT COUNT(*) FROM words WHERE hsk_level=4 "
            "AND example_zh IS NOT NULL "
            "AND example_zh LIKE chr(37) || chinese || chr(37)"
        )).scalar()
        print(f"\n수정 후 HSK4: {total}개 중 예문-단어 일치 {matched}개 ({matched*100//total}%)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    main(dry_run=args.dry_run)
