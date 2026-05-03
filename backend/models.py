from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # RBAC: True if the user is an admin
    is_admin = Column(Boolean, default=False)
    
    # Email Verification Status
    is_email_verified = Column(Boolean, default=False)
    
    # 2FA (for all users, as requested)
    is_2fa_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String, nullable=True)
