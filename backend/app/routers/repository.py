import os
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.database import get_db
from app.models.entities import ResearchResource, AuditLog, User
from app.schemas import ResearchResourceResponse, ResearchResourceCreate
from app.auth import get_current_user, require_role
from app.config import settings

router = APIRouter(prefix="/repository", tags=["Research Repository"])

@router.get("/resources")
def list_resources(
    search: Optional[str] = None,
    domain: Optional[str] = None,
    resource_type: Optional[str] = None,
    is_sih_official: Optional[bool] = None,
    sort_by: str = Query("latest", pattern="^(latest|views|downloads|title)$"),
    page: int = 1,
    limit: int = 12,
    db: Session = Depends(get_db)
):
    query = db.query(ResearchResource)
    
    if search:
        s = f"%{search}%"
        query = query.filter(
            or_(
                ResearchResource.title.ilike(s),
                ResearchResource.abstract.ilike(s),
                ResearchResource.authors.ilike(s),
                ResearchResource.keywords.ilike(s),
                ResearchResource.organization.ilike(s)
            )
        )
        
    if domain:
        query = query.filter(ResearchResource.domain == domain)
        
    if resource_type:
        query = query.filter(ResearchResource.resource_type == resource_type)
        
    if is_sih_official is not None:
        query = query.filter(ResearchResource.is_sih_official == is_sih_official)

    if sort_by == "views":
        query = query.order_by(desc(ResearchResource.view_count))
    elif sort_by == "downloads":
        query = query.order_by(desc(ResearchResource.download_count))
    elif sort_by == "title":
        query = query.order_by(asc(ResearchResource.title))
    else:
        query = query.order_by(desc(ResearchResource.created_at))

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "items": [
            {
                "id": r.id,
                "title": r.title,
                "abstract": r.abstract,
                "resource_type": r.resource_type,
                "domain": r.domain,
                "authors": r.authors,
                "publication_year": r.publication_year,
                "organization": r.organization,
                "file_name": r.file_name,
                "file_size_kb": r.file_size_kb,
                "citation": r.citation,
                "is_sih_official": r.is_sih_official,
                "sih_doc_id": r.sih_doc_id,
                "sih_problem_code": r.sih_doc_id,
                "data_provenance": "Department of Land Resources (DoLR), Ministry of Rural Development",
                "reporting_period": "2024 - 2026",
                "file_url": f"/api/repository/resources/{r.id}/download" if r.file_name else None,
                "keywords": r.keywords,
                "download_count": r.download_count,
                "view_count": r.view_count,
                "is_featured": r.is_featured,
                "created_at": r.created_at.isoformat()
            }
            for r in items
        ]
    }

@router.get("/resources/{id}")
def get_resource_detail(id: int, db: Session = Depends(get_db)):
    res = db.query(ResearchResource).filter(ResearchResource.id == id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    res.view_count += 1
    db.commit()
    
    return {
        "id": res.id,
        "title": res.title,
        "abstract": res.abstract,
        "resource_type": res.resource_type,
        "domain": res.domain,
        "authors": res.authors,
        "publication_year": res.publication_year,
        "organization": res.organization,
        "file_name": res.file_name,
        "file_size_kb": res.file_size_kb,
        "citation": res.citation,
        "is_sih_official": res.is_sih_official,
        "sih_doc_id": res.sih_doc_id,
        "extracted_text_preview": res.extracted_text[:2500] if res.extracted_text else None,
        "keywords": res.keywords,
        "download_count": res.download_count,
        "view_count": res.view_count,
        "is_featured": res.is_featured,
        "created_at": res.created_at.isoformat()
    }

@router.get("/resources/{id}/download")
def download_resource_file(id: int, db: Session = Depends(get_db)):
    res = db.query(ResearchResource).filter(ResearchResource.id == id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    res.download_count += 1
    db.commit()
    
    if res.file_name:
        fpath = os.path.join(settings.SIH_RAW_DATASET_DIR, res.file_name)
        if os.path.exists(fpath):
            return FileResponse(
                fpath,
                filename=res.file_name,
                media_type="application/pdf"
            )

    # If standalone physical file is not in raw folder, return text stream
    return JSONResponse(
        content={
            "message": "Digital document preview extracted from MoRD central repository",
            "title": res.title,
            "text": res.extracted_text or res.abstract
        }
    )

@router.post("/resources", status_code=201)
def submit_resource(
    res_in: ResearchResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["researcher", "institution_admin", "policymaker", "platform_admin"]))
):
    resource = ResearchResource(
        title=res_in.title,
        abstract=res_in.abstract,
        resource_type=res_in.resource_type,
        domain=res_in.domain,
        authors=res_in.authors,
        publication_year=res_in.publication_year,
        organization=res_in.organization,
        file_name=res_in.file_name,
        citation=res_in.citation,
        keywords=res_in.keywords,
        is_sih_official=False,
        download_count=0,
        view_count=1
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    
    db.add(AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="RESOURCE_SUBMISSION",
        module="Repository",
        details=f"Submitted resource ID {resource.id}: {resource.title}"
    ))
    db.commit()
    
    return {"message": "Resource successfully published to national repository", "id": resource.id}
