from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None


class RefreshToken(Token):
    refresh_token: str


class RefreshTokenPost(BaseModel):
    refresh_token: str
