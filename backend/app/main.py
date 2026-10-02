from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.routers import (
    auth,
    dashboard,
    repository,
    ai_assistant,
    gis,
    analytics,
    simulation,
    projects,
    grants,
    datasets,
    integrations,
    metadata
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance — SIH Problem Statement by Ministry of Rural Development (DoLR), Government of India.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api
app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(repository.router, prefix="/api")
app.include_router(ai_assistant.router, prefix="/api")
app.include_router(gis.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(grants.router, prefix="/api")
app.include_router(datasets.router, prefix="/api")
app.include_router(integrations.router, prefix="/api")
app.include_router(metadata.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "National Digital Platform for Land Governance",
        "ministry": "Ministry of Rural Development / Department of Land Resources (DoLR)",
        "sih_dataset_status": "VERIFIED & INTEGRATED",
        "version": settings.VERSION
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
