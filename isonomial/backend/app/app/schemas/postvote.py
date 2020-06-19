from datetime import datetime

from pydantic import BaseModel


class PostVoteBase(BaseModel):
    type: str


class PostVoteInDB(PostVoteBase):
    user_id: int
    post_id: int
    date: datetime

    class Config:
        orm_mode = True


class PostVote(PostVoteInDB):
    pass
