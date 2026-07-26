import logging
from typing import Any, Optional

from qdrant_client.http import models
from qdrant_client.http.models import (
    Distance,
    Filter,
    FieldCondition,
    MatchValue,
    PointStruct,
    VectorParams,
)

from app.domain.knowledge.value_objects.tenant_context import TenantContext
from app.infrastructure.qdrant.client import QdrantClientManager, DEFAULT_VECTOR_SIZE

logger = logging.getLogger(__name__)


class VectorStore:
    """Qdrant-backed vector store with automatic tenant isolation.

    Every vector payload includes tenant identifiers.
    All searches are transparently filtered by organization_id and store_id.
    Business services never pass tenant filters — the VectorStore applies them
    automatically from the injected TenantContext.
    """

    def __init__(
        self,
        tenant: TenantContext,
        client_manager: Optional[QdrantClientManager] = None,
    ):
        self.tenant = tenant
        self._manager = client_manager or QdrantClientManager()
        self._collection = tenant.collection_name

    async def _ensure_collection(self) -> None:
        await self._manager.ensure_collection(self._collection)

    def _tenant_filter(self) -> Filter:
        return Filter(
            must=[
                FieldCondition(
                    key="organization_id",
                    match=MatchValue(value=self.tenant.organization_id),
                ),
                FieldCondition(
                    key="store_id",
                    match=MatchValue(value=self.tenant.store_id),
                ),
            ]
        )

    async def upsert(
        self,
        vectors: list[list[float]],
        payloads: list[dict[str, Any]],
        ids: Optional[list[str]] = None,
    ) -> None:
        if not vectors:
            return
        if ids and len(ids) != len(vectors):
            raise ValueError("ids length must match vectors length")

        await self._ensure_collection()
        client = self._manager.get_async()

        points = []
        for i, vector in enumerate(vectors):
            point_id = ids[i] if ids and i < len(ids) else str(hash(str(payloads[i])))
            payload = dict(payloads[i])
            payload["organization_id"] = self.tenant.organization_id
            payload["store_id"] = self.tenant.store_id
            payload["merchant_id"] = self.tenant.merchant_id
            payload["knowledge_version"] = self.tenant.knowledge_version
            payload.setdefault("document_id", "")
            payload.setdefault("chunk_id", "")
            payload.setdefault("document_type", "")
            payload.setdefault("source_type", "manual")
            payload.setdefault("language", self.tenant.language)
            payload.setdefault("product_id", "")
            payload.setdefault("category_id", "")
            payload.setdefault("brand_id", "")
            points.append(PointStruct(id=point_id, vector=vector, payload=payload))

        await client.upsert(
            collection_name=self._collection,
            points=points,
        )
        logger.debug("Upserted %d vectors into '%s'", len(points), self._collection)

    async def search(
        self,
        vector: list[float],
        top_k: int = 10,
        score_threshold: Optional[float] = None,
        extra_filter: Optional[dict[str, Any]] = None,
    ) -> list[dict[str, Any]]:
        await self._ensure_collection()
        client = self._manager.get_async()

        qfilter = self._tenant_filter()
        if extra_filter:
            for key, value in extra_filter.items():
                qfilter.must.append(
                    FieldCondition(key=key, match=MatchValue(value=value))
                )

        results = await client.search(
            collection_name=self._collection,
            query_vector=vector,
            limit=top_k,
            query_filter=qfilter,
            score_threshold=score_threshold or 0.0,
            with_payload=True,
        )

        return [
            {
                "id": str(r.id),
                "score": r.score,
                "payload": r.payload,
            }
            for r in results
        ]

    async def delete_by_ids(self, ids: list[str]) -> None:
        client = self._manager.get_async()
        await client.delete(
            collection_name=self._collection,
            points_selector=models.PointIdsList(points=ids),
            filter=self._tenant_filter(),
        )

    async def delete_by_filter(self, field: str, value: Any) -> None:
        client = self._manager.get_async()
        qfilter = self._tenant_filter()
        qfilter.must.append(
            FieldCondition(key=field, match=MatchValue(value=value))
        )
        await client.delete(
            collection_name=self._collection,
            points_selector=models.FilterSelector(filter=qfilter),
        )

    async def count(self) -> int:
        client = self._manager.get_async()
        result = await client.count(
            collection_name=self._collection,
            count_filter=self._tenant_filter(),
        )
        return result.count

    async def delete_collection(self) -> None:
        await self._manager.delete_collection(self._collection)
