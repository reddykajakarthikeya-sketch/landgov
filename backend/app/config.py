import os

class Settings:
    PROJECT_NAME: str = "National Digital Platform for Land Governance"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database URL: default to SQLite file inside backend directory, with PostgreSQL compatibility
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./land_governance.db"
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

settings = Settings()
