from datetime import datetime
from typing import Any, List, Tuple, Optional

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


@router.post("/get", response_model=List[Tuple[schemas.Post, Optional[schemas.PostVote]]])
def get_posts(post_request: schemas.PostRequest,
              current_user: models.User = Depends(deps.get_current_active_user),
              db: Session = Depends(deps.get_db)) -> Any:
    retval = crud.post.get_posts(db=db, scopes=post_request.scopes, active_scope=post_request.active_scope,
                                 page=post_request.page, order_by=post_request.order_by,
                                 after_date=post_request.after_date, user_id=current_user.id)
    return retval


@router.post("/vote", response_model=schemas.PostVote)
def vote_post(vote_request: schemas.PostVoteBase, current_user: models.User = Depends(deps.get_current_active_user),
              db: Session = Depends(deps.get_db)) -> Any:
    new_vote = schemas.PostVoteBase(**vote_request.dict())
    new_vote.date = datetime.utcnow()
    old_vote = crud.post_vote.get_vote(db, current_user.id, new_vote.post_id)
    if old_vote:
        returned_vote = crud.post_vote.update_vote(db=db, new_vote=new_vote, old_vote=old_vote)
    else:
        returned_vote = crud.post_vote.create_vote(db=db, vote=new_vote, user_id=current_user.id)
    return returned_vote
