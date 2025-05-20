from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.modules.identity.models import User
from app.modules.auth.schemas import UserCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def authenticate_user(db: Session, username: str, password: str):
    user = await db.query(User).filter(User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def create_user(db: Session, user_in: UserCreate):
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
