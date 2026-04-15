"""
HSK4 meaning/example shift 수정 스크립트

문제: import 시 等(id=392), 对(id=404), 过(id=473) 3개가 중복 삽입되면서
     각 지점부터 meaning/example_zh/example_ko가 다음 단어 것으로 밀림

수정 방법:
  correct_rows[i]의 올바른 데이터 = all_rows[i]의 현재 값
  (중복 row를 제외한 리스트 기준으로 재정렬)

사용법:
  python fix_hsk4_shift.py --dry-run   # 미리보기 (변경 없음)
  python fix_hsk4_shift.py             # 실제 수정
"""
import sys, io, argparse
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
engine = create_engine("postgresql://tradediary:tradediary@localhost:5432/onetask")

DUP_IDS = {392, 404, 473}


def main(dry_run: bool):
    with engine.connect() as conn:
        # 1. 전체 HSK4 rows 가져오기 (id 순서)
        all_rows = conn.execute(text("""
            SELECT id, chinese, meaning, example_zh, example_ko, example_pinyin
            FROM words WHERE hsk_level = 4
            ORDER BY id
        """)).fetchall()

        # 2. 중복 제거한 리스트
        correct_rows = [r for r in all_rows if r[0] not in DUP_IDS]

        print(f"전체 HSK4 rows: {len(all_rows)}")
        print(f"중복 rows (삭제 대상): {sorted(DUP_IDS)}")
        print(f"수정 후 예상 rows: {len(correct_rows)}")
        print()

        # 3. 변경이 필요한 rows 찾기
        updates = []
        for i, row in enumerate(correct_rows):
            source = all_rows[i]
            row_id = row[0]

            if source[0] == row_id:
                # 같은 row → 변경 없음
                continue

            # 변경 필요
            updates.append({
                "id": row_id,
                "chinese": row[1],
                "old_meaning": row[2],
                "new_meaning": source[2],
                "old_example_zh": row[3],
                "new_example_zh": source[3],
                "old_example_ko": row[4],
                "new_example_ko": source[4],
                "old_example_pinyin": row[5],
                "new_example_pinyin": source[5],
            })

        print(f"수정 대상 rows: {len(updates)}개\n")

        # 4. 미리보기 (처음 20개)
        print("=== 변경 미리보기 (처음 20개) ===")
        for u in updates[:20]:
            print(f"id={u['id']:4d} {u['chinese']:8s}")
            print(f"  meaning: [{u['old_meaning'][:20]}] → [{u['new_meaning'][:20]}]")
            if u['old_example_zh'] != u['new_example_zh']:
                old_ex = (u['old_example_zh'] or '')[:35]
                new_ex = (u['new_example_zh'] or '')[:35]
                print(f"  example: [{old_ex}] → [{new_ex}]")
            print()

        if dry_run:
            print("=== DRY RUN: 실제 변경 없음 ===")
            print("실제 수정하려면: python fix_hsk4_shift.py")
            return

        # 5. 실제 수정 (높은 id부터 낮은 id 순으로 처리해야 안전)
        print("=== 실제 수정 시작 ===")
        updates_sorted = sorted(updates, key=lambda x: -x["id"])

        for u in updates_sorted:
            conn.execute(text("""
                UPDATE words SET
                    meaning = :meaning,
                    example_zh = :example_zh,
                    example_ko = :example_ko,
                    example_pinyin = :example_pinyin
                WHERE id = :id
            """), {
                "id": u["id"],
                "meaning": u["new_meaning"],
                "example_zh": u["new_example_zh"],
                "example_ko": u["new_example_ko"],
                "example_pinyin": u["new_example_pinyin"],
            })

        conn.commit()
        print(f"  {len(updates)}개 rows 수정 완료")

        # 6. 중복 rows 삭제
        conn.execute(text(f"DELETE FROM words WHERE id IN ({','.join(map(str, sorted(DUP_IDS)))})"))
        conn.commit()
        print(f"  중복 rows 삭제 완료: {sorted(DUP_IDS)}")

        # 7. 검증: 수정 후 mismatch 확인
        remaining = conn.execute(text("""
            SELECT COUNT(*) FROM words
            WHERE hsk_level = 4
            AND example_zh IS NOT NULL
            AND example_zh NOT LIKE chr(37) || chinese || chr(37)
        """)).scalar()
        total = conn.execute(text("SELECT COUNT(*) FROM words WHERE hsk_level = 4")).scalar()
        print(f"\n수정 후 HSK4 총 rows: {total}")
        print(f"수정 후 예문-단어 불일치: {remaining}개")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="미리보기만 (DB 변경 없음)")
    args = parser.parse_args()
    main(dry_run=args.dry_run)
