from datetime import datetime, UTC
from typing import Dict, Any, Optional
from pydantic import Field
from app.shared.kernel.aggregate_root import AggregateRoot

class AbandonedCartCampaign(AggregateRoot[str]):
    """Domain Aggregate Root representing an abandoned cart campaign campaign targeting a specific cart."""
    store_id: str = Field(..., description="Commerce store context ID")
    customer_id: str = Field(..., description="ID of the customer who abandoned the cart")
    cart_details: Dict[str, Any] = Field(..., description="Products and totals of the abandoned cart")
    status: str = Field(default="pending", description="Status (pending, sent, converted, expired)")
    recommneded_discount: str = Field(..., description="Recommended discount for the abandoned cart")
    maximum_allowed_discount: float = Field(..., description="Maximum allowed discount for each product")
    coupon_offered: Optional[str] = Field(None, description="Coupon code sent as incentive")
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
