from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field

from app.application.recommendation.dto.recommendation_dto import ProductCard


class RecommendationRequestSchema(BaseModel):
    message: str = Field(..., min_length=1, description="User's product recommendation query")
    store_id: str = Field(..., min_length=1, description="Store ID to search in")
    customer_id: Optional[str] = Field(None, description="Optional customer ID")


class ProductCardSchema(BaseModel):
    product_id: str
    title: str
    price: Decimal = Decimal("0")
    currency: str = "USD"
    image_url: Optional[str] = None
    product_url: Optional[str] = None
    specs: List[dict] = Field(default_factory=list)
    match_reasons: List[str] = Field(default_factory=list)


class RecommendationResponseSchema(BaseModel):
    query: str
    store_id: str
    customer_id: Optional[str] = None
    products: List[ProductCardSchema] = Field(default_factory=list)
    rationale: Optional[str] = None
    total_count: int = 0
    latency_ms: float = 0.0
