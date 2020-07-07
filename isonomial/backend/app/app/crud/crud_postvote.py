from datetime import datetime
from typing import List, Optional

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.backend_pre_start import logger
from app.core.config import settings
from app.schemas import PostVoteBase, LocationScope
from app import models


class CRUDPostVote:
    def create_vote(self, db: Session, vote: PostVoteBase, user_id: int) -> models.PostVote:
        new_vote = models.PostVote(**vote.dict(), user_id=user_id)
        post: Optional[models.Post] = db.query(models.Post).get(vote.post_id)
        if not post:
            raise HTTPException(
                status_code=404,
                detail='The post could not be located'
            )
        post.score = post.score + new_vote.value
        db.add(new_vote)
        db.commit()
        db.refresh(new_vote)
        return new_vote

    def get_vote(self, db: Session, user_id: int, post_id: int) -> Optional[models.PostVote]:
        return db.query(models.PostVote).filter(models.PostVote.post_id == post_id)\
            .filter(models.PostVote.user_id == user_id).first()

    def update_vote(self, db: Session, new_vote: PostVoteBase, old_vote: models.PostVote) -> models.PostVote:
        post = db.query(models.Post).get(old_vote.post_id)
        post.score = post.score + new_vote.value - old_vote.value
        old_vote.value = new_vote.value
        old_vote.date = new_vote.date
        db.commit()
        db.refresh(old_vote)
        return old_vote


post_vote = CRUDPostVote()
