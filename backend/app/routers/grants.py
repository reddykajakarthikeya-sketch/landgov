from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import GrantOpportunity, GrantApplication, User, AuditLog
from app.schemas import GrantOpportunityResponse, GrantApplicationCreate
from app.auth import get_current_user

router = APIRouter(prefix="/grants", tags=["Innovation and Grants Portal"])

@router.get("")
def list_grants(db: Session = Depends(get_db)):
    grants = db.query(GrantOpportunity).order_by(GrantOpportunity.created_at.desc()).all()
    return [
        {
            "id": g.id,
            "title": g.title,
            "organizer": g.organizer,
            "opportunity_type": g.opportunity_type,
            "funding_amount": g.funding_amount,
            "deadline": g.deadline,
            "eligibility": g.eligibility,
            "description": g.description,
            "focus_areas": g.focus_areas,
            "status": g.status,
            "applicants_count": g.applicants_count
        }
        for g in grants
    ]

@router.get("/{id}")
def get_grant_detail(id: int, db: Session = Depends(get_db)):
    g = db.query(GrantOpportunity).filter(GrantOpportunity.id == id).first()
    if not g:
        raise HTTPException(status_code=404, detail="Grant opportunity not found")
    return {
        "id": g.id,
        "title": g.title,
        "organizer": g.organizer,
        "opportunity_type": g.opportunity_type,
        "funding_amount": g.funding_amount,
        "deadline": g.deadline,
        "eligibility": g.eligibility,
        "description": g.description,
        "focus_areas": g.focus_areas,
        "status": g.status,
        "applicants_count": g.applicants_count
    }

@router.post("/{id}/apply", status_code=201)
def apply_for_grant(
    id: int,
    app_in: GrantApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    grant = db.query(GrantOpportunity).filter(GrantOpportunity.id == id).first()
    if not grant:
        raise HTTPException(status_code=404, detail="Grant opportunity not found")
        
    application = GrantApplication(
        grant_id=grant.id,
        user_id=current_user.id if current_user else None,
        applicant_name=app_in.applicant_name,
        institution=app_in.institution,
        proposal_title=app_in.proposal_title,
        abstract=app_in.abstract,
        budget_requested=app_in.budget_requested,
        status="submitted"
    )
    db.add(application)
    grant.applicants_count += 1
    db.commit()
    db.refresh(application)

    if current_user:
        db.add(AuditLog(
            user_id=current_user.id,
            user_email=current_user.email,
            action="GRANT_APPLICATION_SUBMITTED",
            module="Grants",
            details=f"Applied for grant: {grant.title} with proposal: {app_in.proposal_title}"
        ))
        db.commit()

    return {
        "message": "Application successfully submitted for technical scrutiny",
        "application_id": application.id,
        "tracking_number": f"DoLR-GR-{grant.id}-{application.id:04d}"
    }

@router.get("/my/applications")
def get_my_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user:
        return []
    apps = db.query(GrantApplication).filter(GrantApplication.user_id == current_user.id).all()
    return [
        {
            "id": a.id,
            "grant_title": a.grant.title if a.grant else "Grant Opportunity",
            "proposal_title": a.proposal_title,
            "institution": a.institution,
            "budget_requested": a.budget_requested,
            "status": a.status,
            "submission_date": a.submission_date.isoformat()
        }
        for a in apps
    ]
