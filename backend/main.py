from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import tasks, categories, words, image_test

Base.metadata.create_all(bind=engine)

app = FastAPI(title="onetask API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(categories.router)
app.include_router(words.router)
app.include_router(image_test.router)


@app.get("/health")
def health():
    return {"status": "ok"}
