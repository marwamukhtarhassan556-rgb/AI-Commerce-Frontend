import logging
from functools import lru_cache
from typing import Optional

from qdrant_client import QdrantClient as QdrantSyncClient
from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import Distance, VectorParams

from app.core.qdrant_settings import QdrantSettings

logger = logging.getLogger(__name__)

DEFAULT_VECTOR_SIZE: int = 1536


class QdrantClientManager:
    """Manages the Qdrant async client singleton and collection lifecycle."""

    def __init__(self, settings: Optional[QdrantSettings] = None) -> None:
        self._settings = settings or QdrantSettings()
        self._async_client: Optional[AsyncQdrantClient] = None
        self._sync_client: Optional[QdrantSyncClient] = None

    def get_async(self) -> AsyncQdrantClient:
        if self._async_client is None:
            self._async_client = AsyncQdrantClient(
                url=self._settings.QDRANT_URL,
                prefer_grpc=True,
            )
        return self._async_client

    def get_sync(self) -> QdrantSyncClient:
        if self._sync_client is None:
            self._sync_client = QdrantSyncClient(
                url=self._settings.QDRANT_URL,
                prefer_grpc=True,
            )
        return self._sync_client

    async def ensure_collection(
        self,
        collection_name: str,
        vector_size: int = DEFAULT_VECTOR_SIZE,
        distance: Distance = Distance.COSINE,
    ) -> None:
        client = self.get_async()
        collections = await client.get_collections()
        existing = {c.name for c in collections.collections}
        if collection_name not in existing:
            await client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=vector_size, distance=distance),
            )
            await client.create_payload_index(
                collection_name=collection_name,
                field_name="organization_id",
                field_schema=models.PayloadSchemaType.KEYWORD,
            )
            await client.create_payload_index(
                collection_name=collection_name,
                field_name="store_id",
                field_schema=models.PayloadSchemaType.KEYWORD,
            )
            logger.info("Created Qdrant collection '%s' with payload indexes", collection_name)

    async def delete_collection(self, collection_name: str) -> None:
        client = self.get_async()
        await client.delete_collection(collection_name=collection_name)
        logger.info("Deleted Qdrant collection '%s'", collection_name)

    async def close(self) -> None:
        if self._async_client is not None:
            await self._async_client.close()
            self._async_client = None


@lru_cache
def get_qdrant_manager() -> QdrantClientManager:
    return QdrantClientManager()
