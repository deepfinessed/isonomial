from datetime import datetime
from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.backend_pre_start import logger
from app.core.config import settings
from app.utils import send_new_account_email

router = APIRouter()


@router.post("/create", response_model=schemas.Post)
def create_post(post: schemas.PostCreate,
                current_user: models.User = Depends(deps.get_current_active_user),
                db: Session = Depends(deps.get_db)) -> Any:
    new_post = schemas.PostBase(text=post.text, date=datetime.utcnow())
    for scope in post.scopes:
        setattr(new_post, scope.type, scope.name)
    returned_post = crud.post.create_post(db=db, post=new_post, user_id=current_user.id)
    return returned_post


@router.post("/get", response_model=List[schemas.Post])
def get_posts(post_request: schemas.PostRequest,
              current_user: models.User = Depends(deps.get_current_active_user),
              db: Session = Depends(deps.get_db)) -> Any:
    retval = crud.post.get_posts(db=db, scopes=post_request.scopes, active_scope=post_request.active_scope,
                                 page=post_request.page, order_by=post_request.order_by,
                                 after_date=post_request.after_date)
    return retval
