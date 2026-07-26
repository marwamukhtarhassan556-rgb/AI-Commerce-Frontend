from typing import Any, Generic, List, Optional, Tuple, Type, TypeVar

from bson import ObjectId

from app.domain.knowledge.value_objects.tenant_context import TenantContext
from app.infrastructure.mongodb.documents.base_document import BaseMongoDocument
from app.infrastructure.mongodb.repositories.base_repository import BaseMongoRepository
from app.shared.kernel.entity import Entity
from app.core.exceptions import ConcurrencyException

DocType = TypeVar("DocType", bound=BaseMongoDocument)
EntityType = TypeVar("EntityType", bound=Entity)


class TenantAwareRepository(BaseMongoRepository[DocType, EntityType], Generic[DocType, EntityType]):
    """Repository that automatically scopes all queries by tenant context.

    Every read/write operation is transparently filtered by
    organization_id and store_id from the injected TenantContext.
    Business services never need to pass tenant filters explicitly.
    """

    def __init__(self, collection: Any, doc_class: Type[DocType], tenant: TenantContext):
        super().__init__(collection, doc_class)
        self.tenant = tenant

    def _tenant_filter(self, extra: dict | None = None) -> dict:
        f = self.tenant.scope_filter()
        if extra:
            f.update(extra)
        return f

    def _inject_tenant_fields(self, data: dict) -> dict:
        data["organization_id"] = self.tenant.organization_id
        data["store_id"] = self.tenant.store_id
        data["merchant_id"] = self.tenant.merchant_id
        data["knowledge_version"] = self.tenant.knowledge_version
        data.setdefault("processing_status", "pending")
        data.setdefault("embedding_status", "pending")
        data.setdefault("summary_status", "pending")
        data.setdefault("checksum", "")
        data.setdefault("document_version", 1)
        data.setdefault("source_type", "manual")
        return data

    async def create(self, entity: EntityType, session: Any = None) -> EntityType:
        try:
            doc = self.doc_class.from_entity(entity)
            data = doc.to_mongo_dict()
            data = self._inject_tenant_fields(data)
            await self.collection.insert_one(data, session=session)
            return entity
        except Exception as e:
            self._handle_db_error(e)
            raise

    async def update(self, entity: EntityType, session: Any = None) -> EntityType:
        if not ObjectId.is_valid(entity.id):
            raise ValueError(f"Entity contains an invalid ObjectId format: {entity.id}")
        try:
            doc = self.doc_class.from_entity(entity)
            data = doc.to_mongo_dict()
            data = self._inject_tenant_fields(data)
            result = await self.collection.replace_one(
                self._tenant_filter({"_id": ObjectId(entity.id)}),
                data,
                upsert=False,
                session=session,
            )
            if result.matched_count == 0:
                raise ConcurrencyException(
                    f"Entity {entity.id} not found or not owned by this tenant"
                )
            return entity
        except Exception as e:
            self._handle_db_error(e)
            raise

    async def delete(self, id: str, session: Any = None) -> bool:
        if not ObjectId.is_valid(id):
            return False
        try:
            result = await self.collection.delete_one(
                self._tenant_filter({"_id": ObjectId(id)}),
                session=session,
            )
            return result.deleted_count > 0
        except Exception as e:
            self._handle_db_error(e)
            raise

    async def find_by_id(self, id: str, session: Any = None) -> Optional[EntityType]:
        if not ObjectId.is_valid(id):
            return None
        try:
            data = await self.collection.find_one(
                self._tenant_filter({"_id": ObjectId(id)}),
                session=session,
            )
            if not data:
                return None
            doc = self.doc_class.from_mongo_dict(data)
            return doc.to_entity()
        except Exception as e:
            self._handle_db_error(e)
            raise

    async def find_many(
        self,
        filters: dict,
        limit: int = 100,
        skip: int = 0,
        session: Any = None,
    ) -> List[EntityType]:
        return await super().find_many(
            self._tenant_filter(filters), limit=limit, skip=skip, session=session
        )

    async def paginate(
        self,
        filters: dict,
        page: int = 1,
        page_size: int = 20,
        session: Any = None,
    ) -> Tuple[List[EntityType], int]:
        return await super().paginate(
            self._tenant_filter(filters), page=page, page_size=page_size, session=session
        )

    async def exists(self, id: str, session: Any = None) -> bool:
        if not ObjectId.is_valid(id):
            return False
        try:
            count = await self.collection.count_documents(
                self._tenant_filter({"_id": ObjectId(id)}),
                limit=1,
                session=session,
            )
            return count > 0
        except Exception as e:
            self._handle_db_error(e)
            raise

    async def bulk_insert(self, entities: List[EntityType], session: Any = None) -> int:
        if not entities:
            return 0
        try:
            docs = []
            for e in entities:
                doc = self.doc_class.from_entity(e).to_mongo_dict()
                doc = self._inject_tenant_fields(doc)
                docs.append(doc)
            result = await self.collection.insert_many(docs, session=session)
            return len(result.inserted_ids)
        except Exception as e:
            self._handle_db_error(e)
            raise

    async def bulk_update(self, entities: List[EntityType], session: Any = None) -> int:
        if not entities:
            return 0
        try:
            from pymongo import ReplaceOne

            operations = []
            for e in entities:
                if not ObjectId.is_valid(e.id):
                    raise ValueError(f"Entity contains an invalid ObjectId format: {e.id}")
                doc = self.doc_class.from_entity(e)
                data = doc.to_mongo_dict()
                data = self._inject_tenant_fields(data)
                operations.append(
                    ReplaceOne(self._tenant_filter({"_id": ObjectId(e.id)}), data)
                )
            result = await self.collection.bulk_write(operations, session=session)
            return result.modified_count
        except Exception as e:
            self._handle_db_error(e)
            raise
