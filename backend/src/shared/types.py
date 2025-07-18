from typing import Annotated, Optional
from sqlalchemy import String
from sqlalchemy.orm import mapped_column

str_20 = Annotated[str, mapped_column(String(20))]
str_40 = Annotated[str, mapped_column(String(40))]
str_50 = Annotated[str, mapped_column(String(50))]
str_100 = Annotated[str, mapped_column(String(100))]
str_500 = Annotated[Optional[str], mapped_column(String(500), nullable=True)]
