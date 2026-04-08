"""중국어 샘플 단어 데이터 삽입"""
from database import SessionLocal
from models import Word

SAMPLE_WORDS = [
    {
        "chinese": "你好",
        "pinyin": "nǐ hǎo",
        "meaning": "안녕하세요",
        "example_zh": "你好，我叫小明。",
        "example_ko": "안녕하세요, 저는 샤오밍이에요.",
    },
    {
        "chinese": "谢谢",
        "pinyin": "xiè xiè",
        "meaning": "감사합니다",
        "example_zh": "谢谢你的帮助！",
        "example_ko": "도와줘서 고마워요!",
    },
    {
        "chinese": "朋友",
        "pinyin": "péng yǒu",
        "meaning": "친구",
        "example_zh": "他是我最好的朋友。",
        "example_ko": "그는 내 가장 친한 친구예요.",
    },
    {
        "chinese": "学习",
        "pinyin": "xué xí",
        "meaning": "공부하다, 학습하다",
        "example_zh": "我每天都学习中文。",
        "example_ko": "저는 매일 중국어를 공부해요.",
    },
    {
        "chinese": "喜欢",
        "pinyin": "xǐ huān",
        "meaning": "좋아하다",
        "example_zh": "我喜欢听音乐。",
        "example_ko": "저는 음악 듣는 걸 좋아해요.",
    },
    {
        "chinese": "吃饭",
        "pinyin": "chī fàn",
        "meaning": "밥을 먹다",
        "example_zh": "我们一起去吃饭吧。",
        "example_ko": "우리 같이 밥 먹으러 가요.",
    },
    {
        "chinese": "工作",
        "pinyin": "gōng zuò",
        "meaning": "일, 일하다",
        "example_zh": "你的工作怎么样？",
        "example_ko": "일은 어때요?",
    },
    {
        "chinese": "漂亮",
        "pinyin": "piào liàng",
        "meaning": "예쁘다, 아름답다",
        "example_zh": "这里的风景很漂亮。",
        "example_ko": "이곳 풍경이 정말 예뻐요.",
    },
    {
        "chinese": "没关系",
        "pinyin": "méi guān xi",
        "meaning": "괜찮아요, 상관없어요",
        "example_zh": "你来晚了没关系。",
        "example_ko": "늦어도 괜찮아요.",
    },
    {
        "chinese": "明天",
        "pinyin": "míng tiān",
        "meaning": "내일",
        "example_zh": "明天见！",
        "example_ko": "내일 봐요!",
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Word).count()
        if existing > 0:
            print(f"이미 {existing}개 단어가 있습니다. 스킵.")
            return
        for w in SAMPLE_WORDS:
            db.add(Word(**w))
        db.commit()
        print(f"{len(SAMPLE_WORDS)}개 단어 삽입 완료.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
