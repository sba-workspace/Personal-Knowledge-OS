from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core import database
from src.routers import notes, links
from src.services import redis_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await database.connect_db()
    # Start background worker for processing tasks
    await redis_service.start_background_worker()
    yield
    # Shutdown logic
    await database.disconnect_db()

app = FastAPI(title="Personal Knowledge OS", lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router, prefix="/notes", tags=["notes"])
app.include_router(links.router, prefix="/notes", tags=["links"])

@app.get("/")
async def root():
    return {"message": "Welcome to Personal Knowledge OS API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}