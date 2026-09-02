from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    REDIS_URL: Optional[str] = None
    ENVIRONMENT: str = "development"
    
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.onrender.com"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
