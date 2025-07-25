from src.db.base import PydanticBase


class Token(PydanticBase):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(PydanticBase):
    sub: str | None = None
    exp: int | None = None       # Optional expiration timestamp
    token_type: str | None = None  # "access" or "refresh"



