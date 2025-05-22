import os
from datetime import timedelta

class Config:
    # Core Security Settings
    SECRET_KEY = os.getenv("SECRET_KEY", "prod-secure-key-123!@#")
    SECURITY_PASSWORD_SALT = os.getenv("SECURITY_PASSWORD_SALT", "secure-salt-456$%^")
    SECURITY_PASSWORD_HASH = "bcrypt"
    
    # Flask-Security Configuration
    SECURITY_REGISTERABLE = True
    SECURITY_CONFIRMABLE = False  # No email confirmation needed
    SECURITY_USERNAME_ENABLE = True
    SECURITY_USERNAME_REQUIRED = True
    SECURITY_TRACKABLE = False
    
    # Role Management
    SECURITY_ROLES_INITIALIZE = True
    SECURITY_ROLES_REQUIRED = True
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = "sqlite:///goodwillai.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Redis Configuration
    CELERY_BROKER_URL = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/0"
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_URL = "redis://localhost:6379/1"
    
    # Session Management
    PERMANENT_SESSION_LIFETIME = timedelta(hours=12)
    
    # API Security
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = 3600  # 1 hour
    
    # User Registration Settings
    SECURITY_MSG_USERNAME_NOT_PROVIDED = ("Username is required", "error")
    SECURITY_MSG_USERNAME_INVALID = ("Invalid username", "error")

class LocalDevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
    WTF_CSRF_ENABLED = False  # Disable for testing VueJS CDN integration
    SECURITY_EMAIL_VALIDATOR_ARGS = {"check_deliverability": False}
    
    # Development-specific security overrides
    SECRET_KEY = "dev-secret-key-123"
    SECURITY_PASSWORD_SALT = "dev-salt-456"
