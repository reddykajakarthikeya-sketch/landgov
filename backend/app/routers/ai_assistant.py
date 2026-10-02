from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AIQueryRequest, AIQueryResponse
from app.services.ai_service import AIResearchService

router = APIRouter(prefix="/ai", tags=["AI Research Assistant"])
ai_service = AIResearchService()

@router.post("/query", response_model=AIQueryResponse)
def handle_ai_query(req: AIQueryRequest, db: Session = Depends(get_db)):
    result = ai_service.process_query(
        db=db,
        query=req.query,
        mode=req.mode,
        document_id=req.document_id
    )
    return result
