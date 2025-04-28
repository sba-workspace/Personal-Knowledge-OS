from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.core import database
from src.routers import notes,links
from src.services import redis_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await database.connect_db()
    yield
    # Shutdown logic
    await database.disconnect_db()

app = FastAPI(title="Personal Knowledge OS", lifespan=lifespan)

app.include_router(notes.router, prefix="/notes", tags=["notes"])
app.include_router(links.router, prefix="/notes", tags=["links"])

@app.get("/")
async def root():
    return {"message": "Welcome to Personal Knowledge OS API"}