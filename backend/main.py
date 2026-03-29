from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database
from .database import engine, get_db
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Initialize tables
models.Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Memory Games Suite - Global Leaderboard")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/leaderboard/submit", response_model=schemas.Score)
@limiter.limit("5/minute")
async def submit_score(request: Request, score: schemas.ScoreCreate, db: Session = Depends(get_db)):
    db_score = models.ScoreEntry(**score.dict())
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    return db_score

@app.get("/leaderboard/{game_id}/{difficulty}", response_model=List[schemas.Score])
async def get_leaderboard(game_id: str, difficulty: str, db: Session = Depends(get_db)):
    # Sorting: For memory games, usually higher is better (score), 
    # but for some games (like Card Match) lower might be better (moves).
    # We will assume higher is better for Number, Word, Poker. 
    # Card Match uses 'score' as moves + time/2, so lower is better.
    
    query = db.query(models.ScoreEntry).filter(
        models.ScoreEntry.game_id == game_id,
        models.ScoreEntry.difficulty == difficulty
    )
    
    if game_id == "card-match":
        # Lower is better
        return query.order_by(models.ScoreEntry.score.asc()).limit(10).all()
    else:
        # Higher is better
        return query.order_by(models.ScoreEntry.score.desc()).limit(10).all()

@app.get("/health")
async def health_check():
    return {"status": "operational", "version": "1.0.0"}
