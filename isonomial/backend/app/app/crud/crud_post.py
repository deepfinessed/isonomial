from datetime import datetime
from typing import List, Optional, Tuple, Union

from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.backend_pre_start import logger
from app.core.config import settings
from app.schemas import PostCreate, LocationScope
from app import models


class CRUDPost:
    def create_post(
            self, db: Session, post: PostCreate, user_id: int
    ) -> models.Post:
        new_post = models.Post(**post.dict(), user_id=user_id)
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        return new_post

    def get_posts(
            self, db: Session, scopes: List[LocationScope], active_scope: LocationScope, page: int,
            order_by: str, after_date: datetime, user_id: Optional[int]
    ) -> Union[List[models.Post], List[Tuple[models.Post, Optional[models.PostVote]]]]:

        # get subquery for individual votes
        if user_id:
            vote_subquery = db.query(models.PostVote.post_id, models.PostVote.value)\
                .filter(models.PostVote.user_id == user_id).subquery()
            query = db.query(models.Post, models.PostVote).outerjoin(vote_subquery, models.Post.id == vote_subquery.c.post_id)
        else:
            query = db.query(models.Post)
        # filter query by scopes
        try:
            for scope in scopes[scopes.index(active_scope):]:
                query = query.filter(getattr(models.Post, scope.type) == scope.name)
        except ValueError:
            raise HTTPException(
                status_code=404,
                detail="The active location scope is not in the user's list of scopes"
            )
        dated_query = query.filter(models.Post.date >= after_date)

        retval = dated_query.order_by(getattr(models.Post, order_by).desc()).offset(page * settings.POSTS_PER_PAGE). \
            limit(settings.POSTS_PER_PAGE).all()
        logger.info(retval)
        return retval



post = CRUDPost()
