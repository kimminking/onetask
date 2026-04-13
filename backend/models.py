from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum, Boolean, func
from database import Base
import enum


class Urgency(str, enum.Enum):
    high = "high"
    normal = "normal"
    low = "low"


class Status(str, enum.Enum):
    todo = "todo"
    done = "done"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    is_master = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=True)
    urgency = Column(Enum(Urgency), default=Urgency.normal, nullable=False)
    order = Column(Integer, default=0, nullable=False)
    status = Column(Enum(Status), default=Status.todo, nullable=False)
    done_at = Column(DateTime(timezone=True), nullable=True)
    due_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    event_date = Column(String(10), nullable=False)   # "YYYY-MM-DD"
    event_time = Column(String(5), nullable=True)     # "HH:MM" optional
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    chinese = Column(String, nullable=False)
    pinyin = Column(String, nullable=False)
    meaning = Column(String, nullable=False)
    example_zh = Column(String, nullable=True)
    example_ko = Column(String, nullable=True)
    example_pinyin = Column(String, nullable=True)
    audio_path = Column(String, nullable=True)
    image_path = Column(String, nullable=True)
    hsk_level = Column(Integer, nullable=True)
    is_favorite = Column(Boolean, default=False, nullable=False, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class WordCard(Base):
    """FSRS 스케줄링 상태를 단어별로 저장"""
    __tablename__ = "word_cards"

    id = Column(Integer, primary_key=True, index=True)
    word_id = Column(Integer, ForeignKey("words.id", ondelete="CASCADE"), unique=True, nullable=False)
    state = Column(Integer, default=0, nullable=False)      # 0=New 1=Learning 2=Review 3=Relearning
    step = Column(Integer, default=0, nullable=True)
    stability = Column(Float, default=0.0, nullable=False)
    difficulty = Column(Float, default=0.0, nullable=False)
    due = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_review = Column(DateTime(timezone=True), nullable=True)
    reps = Column(Integer, default=0, nullable=False)       # 총 복습 횟수
    lapses = Column(Integer, default=0, nullable=False)     # 틀린 횟수


class JapaneseWord(Base):
    __tablename__ = "japanese_words"

    id = Column(Integer, primary_key=True, index=True)
    expression = Column(String(100), nullable=False)   # 한자 표기 (없으면 kana)
    reading = Column(String(100), nullable=False)      # 히라가나 읽기
    meaning = Column(String(500), nullable=False)      # 한국어 뜻
    jlpt_level = Column(String(2), nullable=True)      # N5/N4/N3/N2/N1
    example_jp = Column(String, nullable=True)
    example_ko = Column(String, nullable=True)
    is_favorite = Column(Boolean, default=False, nullable=False, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class JapaneseWordCard(Base):
    __tablename__ = "japanese_word_cards"

    id = Column(Integer, primary_key=True, index=True)
    word_id = Column(Integer, ForeignKey("japanese_words.id", ondelete="CASCADE"), unique=True, nullable=False)
    state = Column(Integer, default=0, nullable=False)
    step = Column(Integer, default=0, nullable=True)
    stability = Column(Float, default=0.0, nullable=False)
    difficulty = Column(Float, default=0.0, nullable=False)
    due = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_review = Column(DateTime(timezone=True), nullable=True)
    reps = Column(Integer, default=0, nullable=False)
    lapses = Column(Integer, default=0, nullable=False)


class EnglishWord(Base):
    __tablename__ = "english_words"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(100), nullable=False, unique=True)
    meaning = Column(String(500), nullable=False)
    level = Column(String(2), nullable=True)
    example_en = Column(String, nullable=True)
    example_ko = Column(String, nullable=True)
    is_favorite = Column(Boolean, default=False, nullable=False, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class PushSubscription(Base):
    """브라우저 Web Push 구독 정보"""
    __tablename__ = "push_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    endpoint = Column(String, nullable=False, unique=True)
    p256dh = Column(String, nullable=False)
    auth = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class EnglishWordCard(Base):
    """영어 단어 FSRS 스케줄링 상태"""
    __tablename__ = "english_word_cards"

    id = Column(Integer, primary_key=True, index=True)
    word_id = Column(Integer, ForeignKey("english_words.id", ondelete="CASCADE"), unique=True, nullable=False)
    state = Column(Integer, default=0, nullable=False)
    step = Column(Integer, default=0, nullable=True)
    stability = Column(Float, default=0.0, nullable=False)
    difficulty = Column(Float, default=0.0, nullable=False)
    due = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_review = Column(DateTime(timezone=True), nullable=True)
    reps = Column(Integer, default=0, nullable=False)
    lapses = Column(Integer, default=0, nullable=False)
