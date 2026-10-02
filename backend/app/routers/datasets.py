import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import DatasetItem, User, AuditLog
from app.auth import get_current_user
from app.services.gis_service import get_all_states, get_watershed_points, get_infrastructure_projects

router = APIRouter(prefix="/datasets", tags=["Dataset Management"])

@router.get("")
def list_datasets(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(DatasetItem)
    if category:
        query = query.filter(DatasetItem.category == category)
    datasets = query.order_by(DatasetItem.created_at.desc()).all()
    
    results = []
    for d in datasets:
        fields = []
        if d.fields_schema:
            try:
                fields = json.loads(d.fields_schema)
            except Exception:
                fields = []
        results.append({
            "id": d.id,
            "name": d.name,
            "description": d.description,
            "category": d.category,
            "source_agency": d.source_agency,
            "file_format": d.file_format,
            "record_count": d.record_count,
            "geographic_coverage": d.geographic_coverage,
            "temporal_coverage": d.temporal_coverage,
            "fields": fields,
            "validation_status": d.validation_status,
            "integration_status": d.integration_status,
            "is_sih_official": d.is_sih_official,
            "sih_file_code": d.sih_file_code,
            "import_date": d.created_at.strftime("%Y-%m-%d")
        })
    return results

@router.get("/{id}")
def get_dataset_details(id: int, db: Session = Depends(get_db)):
    d = db.query(DatasetItem).filter(DatasetItem.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Dataset not found")

    fields = []
    if d.fields_schema:
        try:
            fields = json.loads(d.fields_schema)
        except Exception:
            fields = []

    # Generate sample record preview based on dataset category
    preview_records = []
    if "DILRMP" in d.name:
        preview_records = get_all_states()[:6]
    elif "Watershed" in d.name:
        preview_records = get_watershed_points()[:5]
    elif "Acquisition" in d.name:
        preview_records = get_infrastructure_projects()[:4]
    else:
        preview_records = [
            {"record_id": 1, "state": "Pan-India", "indicator": "Validated via MoRD API", "status": "Active"},
            {"record_id": 2, "state": "Maharashtra", "indicator": "Cadastral Layer Ingested", "status": "Verified"}
        ]

    return {
        "id": d.id,
        "name": d.name,
        "description": d.description,
        "category": d.category,
        "source_agency": d.source_agency,
        "file_format": d.file_format,
        "record_count": d.record_count,
        "geographic_coverage": d.geographic_coverage,
        "temporal_coverage": d.temporal_coverage,
        "fields": fields,
        "validation_status": d.validation_status,
        "integration_status": d.integration_status,
        "is_sih_official": d.is_sih_official,
        "sih_file_code": d.sih_file_code,
        "import_date": d.created_at.strftime("%Y-%m-%d"),
        "preview_records": preview_records
    }

@router.post("", status_code=201)
def create_dataset(
    dataset_in: dict,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    if current_user.role != "platform_admin":
        raise HTTPException(status_code=403, detail="Access denied: Only Platform Administrators can register official system datasets.")

    ds = DatasetItem(
        name=dataset_in["name"],
        description=dataset_in["description"],
        category=dataset_in["category"],
        source_agency=dataset_in["source_agency"],
        file_format=dataset_in["file_format"],
        record_count=dataset_in.get("record_count", 0),
        geographic_coverage=dataset_in.get("geographic_coverage", "National"),
        temporal_coverage=dataset_in.get("temporal_coverage", "2024-2026"),
        fields_schema=json.dumps(dataset_in.get("fields", [])),
        validation_status="VERIFIED",
        integration_status="FULLY_INTEGRATED",
        is_sih_official=dataset_in.get("is_sih_official", False)
    )
    db.add(ds)
    db.commit()
    db.refresh(ds)

    db.add(AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="DATASET_REGISTERED",
        module="Datasets",
        details=f"Dataset '{ds.name}' registered by platform admin"
    ))
    db.commit()

    return {"message": "Dataset registered successfully", "id": ds.id}

@router.put("/{id}/status")
def update_dataset_status(
    id: int,
    status_update: dict,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    if current_user.role != "platform_admin":
        raise HTTPException(status_code=403, detail="Access denied: Only Platform Administrators can verify or approve datasets.")

    ds = db.query(DatasetItem).filter(DatasetItem.id == id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")

    ds.validation_status = status_update.get("validation_status", ds.validation_status)
    ds.integration_status = status_update.get("integration_status", ds.integration_status)
    db.add(AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="DATASET_STATUS_UPDATED",
        module="Datasets",
        details=f"Dataset #{ds.id} status updated to {ds.validation_status}/{ds.integration_status}"
    ))
    db.commit()
    return {"message": "Dataset status updated", "id": ds.id}
