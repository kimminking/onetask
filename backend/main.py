from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
from routers import tasks, categories, words, image_test, english_words, calendar_events, stats, japanese_words

Base.metadata.create_all(bind=engine)

app = FastAPI(title="onetask API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://192.168.219.104:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(categories.router)
app.include_router(words.router)
app.include_router(image_test.router)
app.include_router(english_words.router)
app.include_router(calendar_events.router)
app.include_router(stats.router)
app.include_router(japanese_words.router)

app.mount("/images", StaticFiles(directory="test_output"), name="images")


@app.get("/health")
def health():
    return {"status": "ok"}
