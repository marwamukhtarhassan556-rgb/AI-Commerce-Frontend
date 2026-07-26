from typing import List, Optional, Any
import logging

from app.domain.marketing.entities.abandoned_cart_campaign import AbandonedCartCampaign
from app.domain.marketing.repositories.marketing_repository import MarketingRepository as IMarketingRepository
from app.infrastructure.mongodb.repositories.base_repository import BaseMongoRepository
from app.infrastructure.mongodb.documents.campaign_document import AbandonedCartCampaignDocument
from app.infrastructure.mongodb.collections import get_abandoned_cart_campaigns_collection

logger = logging.getLogger(__name__)

class MarketingRepository(BaseMongoRepository[AbandonedCartCampaignDocument, AbandonedCartCampaign], IMarketingRepository):
    """MongoDB implementation of the MarketingRepository with session and transaction support."""

    def __init__(self):
        super().__init__(get_abandoned_cart_campaigns_collection(), AbandonedCartCampaignDocument)

    async def find_by_store(
        self, store_id: str, status: Optional[str] = None, session: Any = None
    ) -> List[AbandonedCartCampaign]:
        """Fetch campaigns for a store, optionally filtered by status."""
        try:
            filters = {"store_id": store_id}
            if status:
                filters["status"] = status
            return await self.find_many(filters, session=session)
        except Exception as e:
            self._handle_db_error(e)
            raise

    async def find_by_customer(self, customer_id: str, session: Any = None) -> List[AbandonedCartCampaign]:
        """Fetch campaigns targeting a customer."""
        try:
            return await self.find_many({"customer_id": customer_id}, session=session)
        except Exception as e:
            self._handle_db_error(e)
            raise
