from datetime import datetime, UTC
from typing import Dict, Any, Optional
from pydantic import Field
from app.infrastructure.mongodb.documents.base_document import BaseMongoDocument
from app.domain.marketing.entities.abandoned_cart_campaign import AbandonedCartCampaign

class AbandonedCartCampaignDocument(BaseMongoDocument):
    """MongoDB document model representing an AbandonedCartCampaign."""
    store_id: str = Field(..., index=True)
    customer_id: str = Field(..., index=True)
    cart_details: Dict[str, Any] = Field(...)
    status: str = Field(default="pending")
    recommneded_discount: str = Field(...)
    maximum_allowed_discount: float = Field(...)
    coupon_offered: Optional[str] = Field(None)

    def to_entity(self) -> AbandonedCartCampaign:
        """Map document to domain Entity."""
        return AbandonedCartCampaign(
            id=str(self.id),
            store_id=self.store_id,
            customer_id=self.customer_id,
            cart_details=self.cart_details,
            status=self.status,
            recommneded_discount=self.recommneded_discount,
            maximum_allowed_discount=self.maximum_allowed_discount,
            coupon_offered=self.coupon_offered,
            created_at=self.created_at,
            updated_at=self.updated_at
        )

    @classmethod
    def from_entity(cls, entity: AbandonedCartCampaign) -> "AbandonedCartCampaignDocument":
        """Map domain Entity to MongoDB Document."""
        return cls(
            _id=entity.id,
            store_id=entity.store_id,
            customer_id=entity.customer_id,
            cart_details=entity.cart_details,
            status=entity.status,
            recommneded_discount=entity.recommneded_discount,
            maximum_allowed_discount=entity.maximum_allowed_discount,
            coupon_offered=entity.coupon_offered,
            created_at=entity.created_at,
            updated_at=entity.updated_at
        )
