from typing import Optional

from app.domain.knowledge.entities.document_upload import DocumentUpload
from app.domain.knowledge.repositories.upload_repository import (
    UploadRepository as IUploadRepository,
)
<<<<<<< HEAD
from app.infrastructure.mongodb.collections import get_knowledge_uploads_collection
from app.infrastructure.mongodb.documents.upload_document import UploadMetadataModel
from app.infrastructure.mongodb.repositories.base_repository import BaseMongoRepository


class UploadRepository(BaseMongoRepository[UploadMetadataModel, DocumentUpload], IUploadRepository):
    """MongoDB implementation of the document upload repository."""

    def __init__(self):
        super().__init__(get_knowledge_uploads_collection(), UploadMetadataModel)

    async def find_by_checksum(self, checksum: str) -> Optional[DocumentUpload]:
        data = await self.collection.find_one({"checksum": checksum})
=======
from app.domain.knowledge.value_objects.tenant_context import TenantContext
from app.infrastructure.mongodb.collections import get_knowledge_uploads_collection
from app.infrastructure.mongodb.documents.upload_document import UploadMetadataModel
from app.infrastructure.mongodb.repositories.tenant_repository import TenantAwareRepository


class UploadRepository(TenantAwareRepository[UploadMetadataModel, DocumentUpload], IUploadRepository):
    """MongoDB implementation of the document upload repository.

    All queries are automatically scoped by the injected TenantContext.
    """

    def __init__(self, tenant: TenantContext):
        super().__init__(get_knowledge_uploads_collection(), UploadMetadataModel, tenant)

    async def find_by_checksum(self, checksum: str) -> Optional[DocumentUpload]:
        data = await self.collection.find_one(
            self._tenant_filter({"checksum": checksum}),
        )
>>>>>>> feat/auth-integration
        if data is None:
            return None
        doc = self.doc_class.from_mongo_dict(data)
        return doc.to_entity()

    async def find_by_store_id(
        self,
        store_id: str,
        limit: int = 20,
        skip: int = 0,
    ) -> list[DocumentUpload]:
        return await self.find_many({"store_id": store_id}, limit=limit, skip=skip)

    async def find_by_status(
        self,
        status: str,
        limit: int = 20,
        skip: int = 0,
    ) -> list[DocumentUpload]:
        return await self.find_many({"status": status}, limit=limit, skip=skip)
