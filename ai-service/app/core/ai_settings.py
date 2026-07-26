import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class AISettings(BaseSettings):
    """Configuration settings specific to the AI module, loaded from environment variables."""
    
<<<<<<< HEAD
    AZURE_ENDPOINT: str = Field(default="")
    AZURE_DEPLOYMENT: str = Field(default="")
    OLLAMA_URL: str = Field(default="http://localhost:11434")
=======
    OPENAI_API_KEY: str = Field(default="")
    AZURE_OPENAI_KEY: str = Field(default="")
    AZURE_ENDPOINT: str = Field(default="")
    AZURE_DEPLOYMENT: str = Field(default="")
    GEMINI_API_KEY: str = Field(default="")
    CLAUDE_API_KEY: str = Field(default="")
    OLLAMA_URL: str = Field(default="http://localhost:11434")
    DEEPSEEK_API_KEY: str = Field(default="")
    MISTRAL_API_KEY: str = Field(default="")
>>>>>>> feat/auth-integration
    
    DEFAULT_PROVIDER: str = Field(default="openai")
    DEFAULT_MODEL: str = Field(default="gpt-4o-mini")
    REQUEST_TIMEOUT: float = Field(default=30.0)
    MAX_RETRIES: int = Field(default=3)
    
    ENABLE_STREAMING: bool = Field(default=True)
    ENABLE_TOOL_CALLS: bool = Field(default=True)
    ENABLE_JSON_MODE: bool = Field(default=True)

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=True
    )

@lru_cache
def get_ai_settings() -> AISettings:
    return AISettings()

ai_settings = get_ai_settings()
