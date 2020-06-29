from datetime import datetime
from typing import List

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
            order_by: str, after_date: datetime
    ) -> List[models.Post]:
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
