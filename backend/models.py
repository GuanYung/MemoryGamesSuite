from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class ScoreEntry(Base):
    __tablename__ = "leaderboard"

    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String(15), index=True)
    game_id = Column(String, index=True)
    difficulty = Column(String, index=True)
    score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
