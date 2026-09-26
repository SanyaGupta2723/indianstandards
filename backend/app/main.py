from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.routes.standards import router as standards_router
from app.routes.requirements import router as requirements_router
from app.database import engine, Base
from app.models.standard import Standard
from app.routes.search import router as search_router


app = FastAPI(
    title="Indian Standards AI",
    description="AI-powered Indian Standards Recommendation Engine",
    version="1.0.0"
)


# Create database tables
Base.metadata.create_all(bind=engine)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(standards_router)
app.include_router(search_router)
app.include_router(requirements_router)


@app.get("/")
def root():
    return {
        "message": "Indian Standards Backend is running 🚀"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/api/db-test")
def db_test():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            result.fetchone()

        return {
            "status": "success",
            "database": "indian_standards",
            "message": "Database connection successful ✅"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }