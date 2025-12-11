# backend/app/utils.py
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

# 🔐 生产环境请务必修改这个 Key，并放入环境变量！
SECRET_KEY = "jellyfish_secret_key_change_me_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30  # 30天过期

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 1. 密码哈希
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# 2. 密码校验
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# 3. 生成 JWT Token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt