import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import DatasetItem
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
