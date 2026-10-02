from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import User, AuditLog
from app.schemas import UserCreate, UserLogin, Token, UserResponse
from app.auth import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
    
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        organization=user_in.organization,
        department=user_in.department,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Audit log
    db.add(AuditLog(
        user_id=user.id,
        user_email=user.email,
        action="USER_REGISTRATION",
        module="Auth",
        details=f"User registered with role {user.role}"
    ))
    db.commit()
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "full_name": user.full_name,
        "organization": user.organization,
        "email": user.email
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated.")
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    db.add(AuditLog(
        user_id=user.id,
        user_email=user.email,
        action="USER_LOGIN",
        module="Auth",
        details="User successfully authenticated"
    ))
    db.commit()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "full_name": user.full_name,
        "organization": user.organization,
        "email": user.email
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return current_user

@router.get("/users")
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        
    if current_user.role not in ["platform_admin", "institution_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: User directory is restricted to Platform Administrators and Institution Administrators."
        )
    
    # Institution Admins only see members of their own institution
    if current_user.role == "institution_admin":
        term = current_user.organization.split()[0] if current_user.organization else "National"
        users = db.query(User).filter(User.organization.ilike(f"%{term}%")).all()
    else:
        # Platform Admin sees all users across the nation
        users = db.query(User).order_by(User.id.asc()).all()

    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "organization": u.organization,
            "department": u.department,
            "is_active": u.is_active,
            "created_at": u.created_at.strftime("%Y-%m-%d")
        }
        for u in users
    ]

@router.put("/users/{user_id}/status")
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        
    if current_user.role != "platform_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Only Platform Administrators can alter user account authorization status."
        )
        
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    target_user.is_active = not target_user.is_active
    db.add(AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="USER_STATUS_TOGGLED",
        module="Auth",
        details=f"User {target_user.email} active status set to {target_user.is_active}"
    ))
    db.commit()
    db.refresh(target_user)
    
    return {
        "message": f"User status updated to {'active' if target_user.is_active else 'deactivated'}",
        "user_id": target_user.id,
        "is_active": target_user.is_active
    }

@router.get("/audit-logs")
def get_audit_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
        
    if current_user.role != "platform_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: System Audit Logs are strictly restricted to Platform Administrators."
        )
        
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "action": l.action,
            "module": l.module,
            "user_email": l.user_email,
            "details": l.details,
            "ip_address": l.ip_address,
            "created_at": l.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        for l in logs
    ]
