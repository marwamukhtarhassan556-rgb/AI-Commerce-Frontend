from abc import ABC, abstractmethod
from typing import List, Optional
from app.shared.kernel.repository import AsyncRepository
from app.domain.marketing.entities.abandoned_cart_campaign import AbandonedCartCampaign

class MarketingRepository(AsyncRepository[AbandonedCartCampaign, str], ABC):
    """Domain repository interface for Marketing/Campaigns Context."""

    @abstractmethod
    async def find_by_store(self, store_id: str, status: Optional[str] = None) -> List[AbandonedCartCampaign]:
        """Fetch campaigns for a store, optionally filtered by status."""
        pass

    @abstractmethod
    async def find_by_customer(self, customer_id: str) -> List[AbandonedCartCampaign]:
        """Fetch campaigns targeting a customer."""
        pass
