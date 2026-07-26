import os
from functools import lru_cache
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from app.core.mongo_settings import MongoSettings
from app.core.openai_settings import OpenAISettings
from app.core.qdrant_settings import QdrantSettings
from app.core.redis_settings import RedisSettings

load_dotenv()

class Settings(BaseSettings):
    """Application settings using pydantic-settings."""
    PROJECT_NAME: str = "AI Commerce Platform"
    MONGO_SETTINGS: MongoSettings = MongoSettings()
    OPEN_AI_SETTINGS: OpenAISettings = OpenAISettings()
    QDRANT_SETTINGS: QdrantSettings = QdrantSettings()
    REDIS_SETTINGS: RedisSettings = RedisSettings()
    CORS_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=True
    )

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()