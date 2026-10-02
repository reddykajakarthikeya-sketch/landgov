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
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required to submit grant proposals")
    if current_user.role == "public_user":
        raise HTTPException(
            status_code=403, 
            detail="Access denied: Public users are not eligible to apply for institutional research grants."
        )

    grant = db.query(GrantOpportunity).filter(GrantOpportunity.id == id).first()
    if not grant:
        raise HTTPException(status_code=404, detail="Grant opportunity not found")
        
    application = GrantApplication(
        grant_id=grant.id,
        user_id=current_user.id,
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
def get_my_applications(db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_current_user)):
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

@router.get("/admin/applications")
def get_admin_applications(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    if current_user.role not in ["policymaker", "institution_admin", "platform_admin"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied: Grant evaluation queue is restricted to Institutional Administrators and Government Officials."
        )

    query = db.query(GrantApplication)
    # Institution Admins only see applications originating from their institution
    if current_user.role == "institution_admin":
        term = current_user.organization.split()[0] if current_user.organization else "National"
        query = query.filter(GrantApplication.institution.ilike(f"%{term}%"))
    # Policymakers and Platform Admins see all applications for national sanctions

    apps = query.order_by(GrantApplication.submission_date.desc()).all()
    return [
        {
            "id": a.id,
            "grant_id": a.grant_id,
            "grant_title": a.grant.title if a.grant else "Research Grant",
            "applicant_name": a.applicant_name,
            "applicant_email": a.applicant.email if a.applicant else "N/A",
            "institution": a.institution,
            "proposal_title": a.proposal_title,
            "abstract": a.abstract,
            "budget_requested": a.budget_requested,
            "status": a.status,
            "submission_date": a.submission_date.strftime("%Y-%m-%d")
        }
        for a in apps
    ]

@router.put("/applications/{app_id}/status")
def update_application_status(
    app_id: int,
    status_update: dict,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
        
    if current_user.role not in ["policymaker", "institution_admin", "platform_admin"]:
        raise HTTPException(status_code=403, detail="Access denied: Unauthorized to sanction or evaluate grant proposals.")

    app = db.query(GrantApplication).filter(GrantApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Grant application not found")

    new_status = status_update.get("status", "under_review")
    app.status = new_status
    db.add(AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="GRANT_STATUS_UPDATED",
        module="Grants",
        details=f"Application #{app.id} status updated to {new_status} by {current_user.role}"
    ))
    db.commit()
    db.refresh(app)

    return {"message": f"Application status updated to {new_status}", "id": app.id, "status": app.status}
