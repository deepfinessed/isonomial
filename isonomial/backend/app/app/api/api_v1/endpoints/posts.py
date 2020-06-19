from datetime import datetime
from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.utils import send_new_account_email

router = APIRouter()


@router.post("/create", response_model=schemas.Post)
def create_post(scopes: List[schemas.LocationScope], text: str,
                current_user: models.User = Depends(deps.get_current_active_user),
                db: Session = Depends(deps.get_db)) -> Any:
    new_post = schemas.PostCreate(text=text, date=datetime.now())
    for scope in scopes:
        setattr(new_post, scope.type, scope.name)
    returned_post = crud.post.create_post(db=db, post=new_post, user_id=current_user.id)
    return returned_post
