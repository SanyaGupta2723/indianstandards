from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class StandardVersion(Base):
    __tablename__ = "standard_versions"

    id = Column(Integer, primary_key=True, index=True)

    standard_id = Column(
        Integer,
        ForeignKey("standards.id"),
        nullable=False
    )

    edition = Column(
        String(100),
        nullable=False
    )

    publication_date = Column(
        Date,
        nullable=True
    )

    status = Column(
        String(50),
        default="Active"
    )

    source_url = Column(
        Text,
        nullable=True
    )

    notes = Column(
        Text,
        nullable=True
    )

    standard = relationship(
        "Standard",
        foreign_keys=[standard_id]
    )