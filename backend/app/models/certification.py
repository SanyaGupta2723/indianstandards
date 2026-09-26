from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)

    standard_id = Column(
        Integer,
        ForeignKey("standards.id"),
        nullable=False
    )

    scheme = Column(
        String(100),
        nullable=True
    )

    certification_required = Column(
        Boolean,
        default=False
    )

    product_category = Column(
        String(200),
        nullable=True
    )

    authority = Column(
        String(200),
        nullable=True
    )

    qco_reference = Column(
        String(500),
        nullable=True
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