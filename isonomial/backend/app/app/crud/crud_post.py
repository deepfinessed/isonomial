from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.schemas import PostCreate
from app import models


class CRUDPost:
    def create_post(
            self, db: Session, post: PostCreate, user_id: int
    ):
        new_post = models.Post(**post.dict(), user_id=user_id)
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        return new_post


post = CRUDPost()
