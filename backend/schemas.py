from pydantic import BaseModel, constr
from datetime import datetime
from typing import Optional

class ScoreBase(BaseModel):
    nickname: constr(min_length=1, max_length=15)
    game_id: str
    difficulty: str
    score: float

class ScoreCreate(ScoreBase):
    pass

class Score(ScoreBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
