from src.db.base import PydanticBase


class Token(PydanticBase):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(PydanticBase):
    sub: str | None = None



