import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Float, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(64), unique=True, nullable=False)
    email_hash = Column(String(64), unique=True, nullable=False)
    encrypted_email = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    identities = relationship("Identity", back_populates="user", cascade="all, delete-orphan")
    canaries = relationship("CanaryToken", back_populates="user", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="user", cascade="all, delete-orphan")

class Identity(Base):
    __tablename__ = "identities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    identity_type = Column(String(32), nullable=False)  # EMAIL, USERNAME, DOMAIN, GITHUB
    hash_prefix5 = Column(String(5), index=True, nullable=False)  # K-Anonymity 5-char prefix
    blinded_hash = Column(String(64), index=True, nullable=False)  # Full salted hash
    encrypted_identifier = Column(Text, nullable=False)
    status = Column(String(32), default="ACTIVE", nullable=False)  # ACTIVE, PAUSED, COMPROMISED
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="identities")

class CanaryToken(Base):
    __tablename__ = "canary_tokens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    token_type = Column(String(32), nullable=False)  # GITHUB_PAT, AWS_KEY, OPENAI_KEY, EMAIL_ALIAS
    label = Column(String(128), nullable=False)
    token_value = Column(String(255), unique=True, nullable=False)
    hash_prefix5 = Column(String(5), index=True, nullable=False)
    blinded_hash = Column(String(64), index=True, nullable=False)
    is_triggered = Column(Boolean, default=False, nullable=False)
    triggered_at = Column(DateTime, nullable=True)
    trigger_source = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="canaries")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    affected_asset = Column(String(128), nullable=False)
    severity = Column(String(32), default="HIGH", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(32), default="ACTION_REQUIRED", nullable=False)  # DETECT, ASSESS, CONTAIN, RECOVER, VERIFY, RESOLVED
    ai_risk_score = Column(Float, default=0.85, nullable=False)
    attack_path_summary = Column(Text, nullable=False)
    evidence_source = Column(String(128), nullable=False)
    verification_type = Column(String(64), default="GITHUB_PAT", nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="incidents")
    recovery_actions = relationship("RecoveryAction", back_populates="incident", cascade="all, delete-orphan")

class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    incident_id = Column(String(36), ForeignKey("incidents.id"), nullable=False)
    title = Column(String(255), nullable=False)
    stage = Column(String(32), default="CONTAIN", nullable=False)  # CONTAIN, RECOVER, VERIFY
    is_completed = Column(Boolean, default=False, nullable=False)
    probe_endpoint = Column(String(255), nullable=True)

    incident = relationship("Incident", back_populates="recovery_actions")
