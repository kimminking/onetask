"""
HSK4 Phase 2 수정 스크립트
- Phase 1 (fix_hsk4_rematch.py) 후 남은 141개 불일치 처리
- SQL에서 적절한 예문 찾기 + 충돌 해결
- 매칭 안 되는 경우 Claude API로 새 예문 생성

사용법:
  python fix_hsk4_phase2.py --dry-run   # 미리보기
  python fix_hsk4_phase2.py             # 실제 수정
"""
import sys, io, re, argparse, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import anthropic
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
engine = create_engine(os.environ.get("DATABASE_URL", "postgresql://tradediary:tradediary@localhost:5432/onetask"))
claude = anthropic.Anthropic()

SQL_FILES = ["hsk4_data.sql", "hsk4_data_fix.sql"]


def parse_sql(filepath):
    entries = []
    pattern = re.compile(
        r"UPDATE words SET meaning='([^']*)',\s*example_zh='([^']*)',\s*example_ko='([^']*)'\s+WHERE id=(\d+);",
        re.DOTALL
    )
    with open(filepath, encoding="utf-8") as f:
        content = f.read()
    for m in pattern.finditer(content):
        entries.append({
            "meaning": m.group(1),
            "example_zh": m.group(2),
            "example_ko": m.group(3),
            "sql_id": int(m.group(4))
        })
    return entries


def is_standalone_in_example(char: str, ex: str, all_words: list[str]) -> bool:
    """
    1자 한자가 예문에서 복합어의 일부가 아닌 독립적으로 쓰이는지 확인
    예: '过' in '撑过去' → False (过去의 일부)
        '苦' in '太苦了' → True (독립적)
    """
    idx = ex.find(char)
    while idx >= 0:
        # 이 위치에서 char가 다른 단어의 일부인지 체크
        is_part_of_compound = False
        for w in all_words:
            if len(w) >= 2 and char in w and w in ex:
                # w가 예문의 idx 위치를 포함하는지
                widx = ex.find(w)
                while widx >= 0:
                    if widx <= idx < widx + len(w):
                        is_part_of_compound = True
                        break
                    widx = ex.find(w, widx + 1)
                if is_part_of_compound:
                    break
        if not is_part_of_compound:
            return True
        idx = ex.find(char, idx + 1)
    return False


def score_for_target(target_ch, ex, hsk4_words, all_words=None):
    """target_ch가 예문에서 얼마나 primary한지 점수"""
    if target_ch not in ex:
        return 0
    multi = [(wid, wch) for wid, wch in hsk4_words if len(wch) >= 2 and wch in ex]
    target_len = len(target_ch)
    longer = [wch for _, wch in multi if len(wch) > target_len]
    same = [wch for _, wch in multi if len(wch) == target_len and wch != target_ch]

    if target_len >= 2:
        if not longer and not same:
            return 100
        if not longer:
            return max(70 - len(same) * 10, 50)
        return max(30 - len(longer) * 10, 0)
    else:
        # 1자 단어: 독립적으로 쓰이는지 확인
        if all_words and not is_standalone_in_example(target_ch, ex, all_words):
            return 0  # 복합어의 일부 → 매칭 불가
        if not multi:
            return 50
        return 5


def generate_example(chinese: str, meaning: str) -> tuple[str, str] | None:
    """Claude API로 예문 생성"""
    prompt = f"""중국어 단어 '{chinese}' (뜻: {meaning})에 대한 자연스러운 HSK4 수준 예문을 만들어 주세요.

조건:
- 예문에 반드시 '{chinese}' 단어가 포함될 것
- HSK4 수준의 자연스러운 중국어 문장
- 짧고 명확한 문장 (15-30자)
- 단어의 뜻을 명확히 보여주는 문장

응답 형식 (정확히 이 형식으로):
ZH: [중국어 예문]
KO: [한국어 번역]"""

    try:
        resp = claude.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}]
        )
        text_out = resp.content[0].text.strip()
        zh_match = re.search(r"ZH:\s*(.+)", text_out)
        ko_match = re.search(r"KO:\s*(.+)", text_out)
        if zh_match and ko_match:
            zh = zh_match.group(1).strip()
            ko = ko_match.group(1).strip()
            if chinese in zh:
                return zh, ko
        return None
    except Exception as e:
        print(f"  Claude API 오류: {e}")
        return None


# 직접 작성한 예문 (Claude API 없이 처리)
HARDCODED_EXAMPLES: dict[str, tuple[str, str, str]] = {
    # (meaning, example_zh, example_ko)
    "吃惊": ("놀라다", "听到这个好消息，她吃惊地说不出话来。", "이 좋은 소식을 듣고, 그녀는 놀라서 말을 하지 못했다."),
    "对":  ("맞다; ~에 대하여; 대하다", "对不起，我来晚了，让你久等了。", "미안해요, 늦게 와서 오래 기다리게 했네요."),
    "光":  ("빛; 빛나다; 다 없어지다, ~뿐", "冰箱里的食物都吃光了，该去超市了。", "냉장고 음식이 다 없어졌으니 마트에 가야 할 것 같아."),
    "过":  ("지나다; ~한 적이 있다 (경험 조사)", "我没有去过北京，很想去看看。", "나는 베이징에 가본 적이 없어서 꼭 한번 가보고 싶다."),
    "苦":  ("쓰다 (맛); 고생스럽다", "这段时间工作太苦了，但撑过去就好了。", "요즘 일이 너무 힘들지만 버티면 좋아질 거야."),
    "宽":  ("넓다", "这条路很宽，可以并排走三辆车。", "이 길은 매우 넓어서 차 세 대가 나란히 다닐 수 있다."),
    "俩":  ("두 사람, 두 개", "我们俩是好朋友，认识已经十年了。", "우리 둘은 친한 친구로 알고 지낸 지 벌써 10년이 됐다."),
    "留":  ("머물다; 남기다; 보류하다", "他决定留在国内工作，不去国外了。", "그는 해외에 가지 않고 국내에 남아서 일하기로 결정했다."),
    "乱":  ("어지럽다; 마구, 함부로", "请不要在公共场所乱扔垃圾。", "공공장소에서 함부로 쓰레기를 버리지 마세요."),
    "弄":  ("하다, 만들다 (구어)", "你把这道题弄错了，重新做一下。", "이 문제를 틀렸으니 다시 한번 해봐."),
    "篇":  ("~편, 편 (글·논문 양사)", "他写了一篇关于环境保护的文章。", "그는 환경 보호에 관한 글 한 편을 썼다."),
    "骗":  ("속이다, 기만하다", "他骗了我，说会来却没有来。", "그는 온다고 해놓고 오지 않아서 나를 속였다."),
    "敲":  ("두드리다, 노크하다", "进房间前要先敲门，这是基本礼貌。", "방에 들어가기 전에 먼저 노크하는 것이 기본 예의다."),
    "却":  ("오히려, 도리어", "他越努力，却越觉得有压力。", "그는 노력할수록 오히려 더 압박감을 느꼈다."),
    "扔":  ("버리다, 던지다", "他把垃圾扔进了垃圾桶。", "그는 쓰레기를 쓰레기통에 버렸다."),
    "软":  ("부드럽다, 연하다", "这个面包很软，刚出炉的。", "이 빵은 막 구워낸 것이라 매우 부드럽다."),
    "深":  ("깊다; (색이) 진하다", "这条河很深，小孩子不能下去游泳。", "이 강은 매우 깊어서 아이들이 수영하러 들어가면 안 된다."),
    "省":  ("절약하다; 성 (省)", "多坐公交车，可以省很多钱。", "버스를 많이 타면 돈을 많이 절약할 수 있다."),
    "试":  ("시험해보다, 해보다", "这双鞋好看，你试穿一下吧。", "이 신발이 예쁜데 한번 신어보세요."),
    "帅":  ("잘생기다, 멋있다", "那个演员长得很帅，很多人喜欢他。", "그 배우는 매우 잘생겨서 많은 사람들이 그를 좋아한다."),
    "算":  ("계산하다; ~로 간주하다", "你帮我算一下这道数学题好吗？", "이 수학 문제 좀 계산해줄 수 있어요?"),
    "台":  ("대 (기계·설비 양사); 무대", "公司新买了两台电脑，给新来的员工用。", "회사에서 컴퓨터 두 대를 새로 사서 신입 직원들에게 줬다."),
    "谈":  ("말하다, 이야기하다", "他们谈了很久，终于达成了协议。", "그들은 오랫동안 이야기를 나눈 끝에 마침내 합의에 이르렀다."),
    "无":  ("없다, ~없이", "他无论如何都要完成这项任务。", "그는 어떻게 해서든 이 임무를 완수하려 한다."),
    "香":  ("향기롭다; (음식이) 맛있다", "这朵花很香，闻起来非常舒服。", "이 꽃은 매우 향기로워서 맡으면 기분이 좋다."),
    "行":  ("좋다, 괜찮다 (구어); 능력 있다", "你的中文说得真行，比很多外国人都好。", "당신의 중국어 실력이 정말 대단해요, 많은 외국인보다 훨씬 잘해요."),
    "页":  ("페이지, 쪽", "请把书翻到第五十页，我们从这里开始。", "책 50페이지를 펴세요, 여기서부터 시작합니다."),
    "叶子": ("나뭇잎", "秋天到了，树上的叶子都变成了红色。", "가을이 되어 나무의 잎이 모두 빨갛게 변했다."),
    "亿":  ("억 (숫자)", "中国有十四亿人口，是世界上人口最多的国家。", "중국은 14억 명의 인구를 보유한 세계에서 인구가 가장 많은 나라다."),
    "硬":  ("딱딱하다; 강경하다", "这个面包放了几天，已经硬了。", "이 빵은 며칠 두었더니 이미 딱딱해졌다."),
    "由":  ("~에 의해; ~로 인해; ~에서", "这次活动由学生会负责组织。", "이번 행사는 학생회가 조직을 담당한다."),
    "与":  ("~와, ~과; 주다 (문어)", "与其在家等，不如出去找机会。", "집에서 기다리느니 차라리 나가서 기회를 찾는 것이 낫다."),
    "圆":  ("둥글다; 원", "月亮圆圆的，今晚是满月。", "달이 둥글다. 오늘 밤은 보름달이다."),
    "窄":  ("좁다", "这条小路太窄了，两个人并排走不过去。", "이 작은 길은 너무 좁아서 두 사람이 나란히 지나갈 수 없다."),
    "之":  ("~의 (문어 조사)", "成功之路并不容易，需要不断努力。", "성공의 길은 쉽지 않으며 끊임없이 노력해야 한다."),
    "指":  ("손가락; 가리키다", "他用手指着地图，给我解释路线。", "그는 손가락으로 지도를 가리키며 나에게 경로를 설명해 주었다."),
    "猪":  ("돼지", "农场里养了很多猪，每天要喂食两次。", "농장에는 돼지가 많이 있는데 매일 두 번씩 먹이를 줘야 한다."),
}

# 틀린 DB 뜻 → 올바른 뜻 (데이터 이동으로 인해 뜻이 밀린 경우)
CORRECT_MEANINGS = {
    "吃惊": "놀라다",
    "对": "맞다; ~에 대하여; 대하다",
    "光": "빛; 빛나다; 다 없어지다, ~뿐",
    "过": "지나다; ~한 적이 있다 (경험 조사)",
    "苦": "쓰다 (맛); 고생스럽다",
    "宽": "넓다",
    "俩": "두 사람, 두 개",
    "留": "머물다; 남기다; 보류하다",
    "乱": "어지럽다; 마구, 함부로",
    "弄": "하다, 만들다 (구어)",
    "篇": "~편, 편 (글·논문 양사)",
    "骗": "속이다, 기만하다",
    "敲": "두드리다, 노크하다",
    "却": "오히려, 도리어",
    "扔": "버리다, 던지다",
    "软": "부드럽다, 연하다",
    "深": "깊다; (색이) 진하다",
    "省": "절약하다; 성 (省)",
    "试": "시험해보다, 해보다",
    "帅": "잘생기다, 멋있다",
    "算": "계산하다; ~로 간주하다",
    "台": "대 (기계·설비 양사); 무대",
    "谈": "말하다, 이야기하다",
    "无": "없다, ~없이",
    "香": "향기롭다; (음식이) 맛있다",
    "行": "좋다, 괜찮다 (구어); 능력 있다",
    "页": "페이지, 쪽",
    "叶子": "나뭇잎",
    "亿": "억 (숫자)",
    "硬": "딱딱하다; 강경하다",
    "由": "~에 의해; ~로 인해; ~에서",
    "与": "~와, ~과; 주다 (문어)",
    "圆": "둥글다; 원",
    "窄": "좁다",
    "之": "~의 (문어 조사)",
    "指": "손가락; 가리키다",
    "猪": "돼지",
}


def main(dry_run: bool):
    with engine.connect() as conn:
        bad_rows = conn.execute(text("""
            SELECT id, chinese, meaning, example_zh, example_ko
            FROM words WHERE hsk_level=4
            AND (example_zh IS NULL OR example_zh NOT LIKE chr(37) || chinese || chr(37))
            ORDER BY id
        """)).fetchall()

        all_hsk4 = conn.execute(text(
            "SELECT id, chinese FROM words WHERE hsk_level=4 ORDER BY id"
        )).fetchall()

    hsk4_words = [(r[0], r[1]) for r in all_hsk4]
    print(f"수정 대상: {len(bad_rows)}개\n")

    # 복합어 체크용 전체 단어 목록
    with engine.connect() as conn:
        all_word_rows = conn.execute(text(
            "SELECT chinese FROM words GROUP BY chinese ORDER BY MAX(LENGTH(chinese)) DESC"
        )).fetchall()
    all_words_list = [r[0] for r in all_word_rows if len(r[0]) >= 2]

    # SQL 파싱
    all_sql = []
    for f in SQL_FILES:
        all_sql.extend(parse_sql(f))

    # 각 bad word에 대해 SQL 후보 점수 계산
    # {word_id: [(score, sql_entry), ...]}
    candidates = {}
    for r in bad_rows:
        wid, wch = r[0], r[1]
        scored = []
        for sql in all_sql:
            s = score_for_target(wch, sql["example_zh"], hsk4_words, all_words_list)
            if s >= 50:
                scored.append((s, sql))
        if scored:
            candidates[wid] = sorted(scored, key=lambda x: -x[0])

    # 충돌 해결: 같은 SQL entry를 두 단어가 모두 원할 때
    # 욕심 알고리즘: 점수 높은 것부터 처리, 이미 사용된 SQL은 스킵
    used_sql_ids = set()
    assignments = {}  # word_id -> sql_entry

    # 점수 내림차순으로 (word_id, score, sql) 정렬
    all_scored = []
    for wid, scored_list in candidates.items():
        for score, sql in scored_list:
            all_scored.append((score, wid, sql))
    all_scored.sort(key=lambda x: -x[0])

    for score, wid, sql in all_scored:
        if wid in assignments:
            continue  # 이미 배정됨
        sql_key = sql["sql_id"]
        if sql_key in used_sql_ids:
            continue  # 이 SQL은 다른 단어에 사용됨
        assignments[wid] = sql
        used_sql_ids.add(sql_key)

    print(f"SQL 매칭 성공: {len(assignments)}개")
    sql_failed = [r for r in bad_rows if r[0] not in assignments]
    print(f"SQL 매칭 실패 (Claude 생성 필요): {len(sql_failed)}개")
    if sql_failed:
        print("  대상:", [r[1] for r in sql_failed])
    print()

    # 변경 목록 구성
    fixes = []

    # SQL 기반 수정
    for r in bad_rows:
        wid = r[0]
        if wid not in assignments:
            continue
        sql = assignments[wid]
        fixes.append({
            "id": wid,
            "chinese": r[1],
            "old_meaning": r[2],
            "new_meaning": sql["meaning"],
            "old_example_zh": r[3],
            "new_example_zh": sql["example_zh"],
            "old_example_ko": r[4],
            "new_example_ko": sql["example_ko"],
            "source": "SQL",
        })

    # 하드코딩 + Claude 생성 기반 수정
    print("=== 예문 처리 중 ===")
    for r in sql_failed:
        wid, wch, cur_meaning = r[0], r[1], r[2]
        correct_meaning = CORRECT_MEANINGS.get(wch, cur_meaning)

        # 하드코딩된 예문이 있으면 우선 사용
        if wch in HARDCODED_EXAMPLES:
            hc_meaning, hc_zh, hc_ko = HARDCODED_EXAMPLES[wch]
            print(f"  {wch} → 하드코딩: {hc_zh[:40]}")
            if dry_run:
                print(f"    [DRY RUN 스킵]")
                continue
            fixes.append({
                "id": wid,
                "chinese": wch,
                "old_meaning": cur_meaning,
                "new_meaning": hc_meaning,
                "old_example_zh": r[3],
                "new_example_zh": hc_zh,
                "old_example_ko": r[4],
                "new_example_ko": hc_ko,
                "source": "Hardcoded",
            })
            continue

        # 하드코딩 없으면 Claude API 시도
        print(f"  {wch} ({correct_meaning[:15]})...", end=" ", flush=True)
        if dry_run:
            print(f"[DRY RUN 스킵] 올바른뜻: {correct_meaning[:20]}")
            continue

        result = generate_example(wch, correct_meaning)
        if result:
            new_zh, new_ko = result
            print(f"OK: {new_zh[:40]}")
            fixes.append({
                "id": wid,
                "chinese": wch,
                "old_meaning": cur_meaning,
                "new_meaning": correct_meaning,
                "old_example_zh": r[3],
                "new_example_zh": new_zh,
                "old_example_ko": r[4],
                "new_example_ko": new_ko,
                "source": "Claude",
            })
        else:
            print("FAIL")

    print()
    print("=== 변경 샘플 (처음 20개) ===")
    for c in fixes[:20]:
        match_ok = c["chinese"] in c["new_example_zh"]
        src = c["source"]
        print(f"id={c['id']:4d} {c['chinese']:8s} [{src}]")
        print(f"  뜻: {c['old_meaning'][:20]} → {c['new_meaning'][:20]}")
        print(f"  예문: {c['new_example_zh'][:45]} | 단어포함:{'Y' if match_ok else 'N'}")

    match_rate = sum(1 for c in fixes if c["chinese"] in c["new_example_zh"])
    print(f"\n예상 단어-예문 일치: {match_rate}/{len(fixes)} ({match_rate*100//max(1,len(fixes))}%)")

    if dry_run:
        print("\n=== DRY RUN: 실제 변경 없음 ===")
        return

    # 실제 UPDATE
    print(f"\n=== 실제 수정 ({len(fixes)}개) ===")
    with engine.connect() as conn:
        for c in fixes:
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
        print("  수정 완료")

        # 최종 통계
        total = conn.execute(text("SELECT COUNT(*) FROM words WHERE hsk_level=4")).scalar()
        matched = conn.execute(text(
            "SELECT COUNT(*) FROM words WHERE hsk_level=4 "
            "AND example_zh IS NOT NULL "
            "AND example_zh LIKE chr(37) || chinese || chr(37)"
        )).scalar()
        print(f"\n최종 HSK4: {total}개 중 예문-단어 일치 {matched}개 ({matched*100//total}%)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    main(dry_run=args.dry_run)
