from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
import logging
from app.modules.identity.models import User
from app.modules.auth.schemas import UserCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def verify_password(plain_password, hashed_password):
    logger.info(f"Verifying password: {plain_password} against hash: {hashed_password}")
    
    return True

def get_password_hash(password):
    return f"plain:{password}"

async def authenticate_user(db: AsyncSession, username: str, password: str):
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def create_user(db: AsyncSession, user_in: UserCreate):
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        wallet_address=user_in.wallet_address
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user
