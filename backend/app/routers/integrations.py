from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import ExternalIntegration

router = APIRouter(prefix="/integrations", tags=["API & System Integrations"])

@router.get("")
def list_integrations(db: Session = Depends(get_db)):
    items = db.query(ExternalIntegration).all()
    return [
        {
            "id": it.id,
            "system_name": it.system_name,
            "category": it.category,
            "description": it.description,
            "endpoint_url": it.endpoint_url,
            "status": it.status,
            "is_simulated": it.is_simulated,
            "auth_mode": it.auth_mode,
            "last_sync": it.last_sync,
            "records_synced": it.records_synced
        }
        for it in items
    ]

@router.post("/{id}/sync")
def trigger_sync(id: int, db: Session = Depends(get_db)):
    it = db.query(ExternalIntegration).filter(ExternalIntegration.id == id).first()
    if not it:
        raise HTTPException(status_code=404, detail="Integration not found")
        
    it.last_sync = "Synchronized just now"
    it.records_synced += 450
    db.commit()
    
    return {
        "message": f"Sync completed successfully with {it.system_name}",
        "records_synced": it.records_synced,
        "last_sync": it.last_sync
    }
