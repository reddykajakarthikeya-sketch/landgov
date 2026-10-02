from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.entities import (
    ResearchProject,
    ProjectObjective,
    ProjectTask,
    ProjectMilestone,
    ProjectComment,
    User,
    AuditLog
)
from app.schemas import (
    ResearchProjectCreate,
    TaskCreate,
    ObjectiveCreate,
    MilestoneCreate,
    CommentCreate
)
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/projects", tags=["Collaborative Research Workspace"])

@router.get("")
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(ResearchProject).order_by(desc(ResearchProject.created_at)).all()
    results = []
    for p in projects:
        results.append({
            "id": p.id,
            "title": p.title,
            "summary": p.summary,
            "domain": p.domain,
            "institution": p.institution,
            "status": p.status,
            "budget_inr": p.budget_inr,
            "target_state": p.target_state,
            "lead_researcher_name": p.lead_researcher.full_name if p.lead_researcher else "Principal Investigator",
            "tasks_count": len(p.tasks),
            "completed_tasks": sum(1 for t in p.tasks if t.status == "completed"),
            "milestones_count": len(p.milestones),
            "achieved_milestones": sum(1 for m in p.milestones if m.is_achieved),
            "created_at": p.created_at.isoformat()
        })
    return results

@router.post("", status_code=201)
def create_project(
    proj_in: ResearchProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["researcher", "institution_admin", "policymaker", "platform_admin"]))
):
    project = ResearchProject(
        title=proj_in.title,
        summary=proj_in.summary,
        domain=proj_in.domain,
        lead_researcher_id=current_user.id,
        institution=proj_in.institution,
        budget_inr=proj_in.budget_inr,
        target_state=proj_in.target_state,
        start_date=proj_in.start_date,
        end_date=proj_in.end_date,
        status="active"
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Add default milestone
    db.add(ProjectMilestone(project_id=project.id, title="Project Inception & Baseline Survey", due_date="2026-06-30", is_achieved=False))
    db.add(AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="PROJECT_CREATION",
        module="Workspace",
        details=f"Created research project ID {project.id}: {project.title}"
    ))
    db.commit()

    return {"message": "Research project created successfully", "id": project.id}

@router.get("/{id}")
def get_project_detail(id: int, db: Session = Depends(get_db)):
    p = db.query(ResearchProject).filter(ResearchProject.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")

    return {
        "id": p.id,
        "title": p.title,
        "summary": p.summary,
        "domain": p.domain,
        "institution": p.institution,
        "status": p.status,
        "budget_inr": p.budget_inr,
        "target_state": p.target_state,
        "lead_researcher_name": p.lead_researcher.full_name if p.lead_researcher else "Principal Investigator",
        "created_at": p.created_at.isoformat(),
        "objectives": [{"id": o.id, "title": o.title, "is_completed": o.is_completed} for o in p.objectives],
        "tasks": [
            {
                "id": t.id,
                "title": t.title,
                "assigned_to": t.assigned_to,
                "status": t.status,
                "priority": t.priority,
                "due_date": t.due_date
            }
            for t in p.tasks
        ],
        "milestones": [
            {
                "id": m.id,
                "title": m.title,
                "due_date": m.due_date,
                "is_achieved": m.is_achieved
            }
            for m in p.milestones
        ],
        "comments": [
            {
                "id": c.id,
                "user_name": c.user.full_name if c.user else "Researcher",
                "content": c.content,
                "created_at": c.created_at.isoformat()
            }
            for c in p.comments
        ]
    }

@router.post("/{id}/tasks", status_code=201)
def add_project_task(id: int, task_in: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    p = db.query(ResearchProject).filter(ResearchProject.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
        
    task = ProjectTask(
        project_id=p.id,
        title=task_in.title,
        description=task_in.description,
        assigned_to=task_in.assigned_to,
        status=task_in.status,
        priority=task_in.priority,
        due_date=task_in.due_date
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"message": "Task added", "id": task.id}

@router.post("/{id}/tasks/{task_id}/toggle")
def toggle_task_status(id: int, task_id: int, db: Session = Depends(get_db)):
    task = db.query(ProjectTask).filter(ProjectTask.id == task_id, ProjectTask.project_id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task.status = "completed" if task.status != "completed" else "todo"
    db.commit()
    return {"message": "Task status updated", "new_status": task.status}

@router.post("/{id}/comments", status_code=201)
def add_project_comment(
    id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    p = db.query(ResearchProject).filter(ResearchProject.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
        
    comment = ProjectComment(
        project_id=p.id,
        user_id=current_user.id if current_user else None,
        content=comment_in.content
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return {
        "message": "Comment posted",
        "id": comment.id,
        "user_name": current_user.full_name if current_user else "Researcher"
    }
