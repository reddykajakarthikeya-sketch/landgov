import os

class Settings:
    PROJECT_NAME: str = "National Digital Platform for Land Governance"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database URL: default to SQLite file inside backend directory, with PostgreSQL compatibility
    _DEFAULT_DB_PATH: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "land_governance.db"))
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{_DEFAULT_DB_PATH.replace(os.sep, '/')}"
    )
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "sih-mord-dolr-land-governance-secret-key-2026-secure-token")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # AI / LLM Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Raw SIH dataset path
    SIH_RAW_DATASET_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "raw_dataset"))

    # CORS & Deployment Configuration
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://reddykajakarthikeya-sketch.github.io")
    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS", 
        "https://reddykajakarthikeya-sketch.github.io,http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173"
    )

settings = Settings()
