import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.recommendation.dependencies import get_recommendation_service
from app.api.recommendation.schemas import (
    RecommendationRequestSchema,
    RecommendationResponseSchema,
)
from app.application.recommendation.services import RecommendationService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/recommendations", tags=["Recommendations"])


@router.post(
    "/chat",
    response_model=RecommendationResponseSchema,
    summary="AI-powered product recommendation with spec matching",
)
async def recommend_products(
    payload: RecommendationRequestSchema,
    service: RecommendationService = Depends(get_recommendation_service),
) -> RecommendationResponseSchema:
    try:
        result = await service.recommend(
            query=payload.message,
            store_id=payload.store_id,
            customer_id=payload.customer_id,
        )

        return RecommendationResponseSchema(
            query=result.query,
            store_id=result.store_id,
            customer_id=result.customer_id,
            products=[
                {
                    "product_id": p.product_id,
                    "title": p.title,
                    "price": str(p.price),
                    "currency": p.currency,
                    "image_url": p.image_url,
                    "product_url": p.product_url,
                    "specs": [s.model_dump() for s in p.specs],
                    "match_reasons": p.match_reasons,
                }
                for p in result.products
            ],
            rationale=result.rationale,
            total_count=result.total_count,
            latency_ms=result.latency_ms,
        )
    except Exception as exc:
        logger.error("Recommendation failed: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Recommendation failed: {exc}",
        )
