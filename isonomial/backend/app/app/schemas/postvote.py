from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PostVoteBase(BaseModel):
    value: int
    post_id: int
    date: Optional[datetime]


class PostVoteInDB(PostVoteBase):
    user_id: int

    class Config:
        orm_mode = True


class PostVote(PostVoteInDB):
    pass
