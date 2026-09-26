from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class QCO(Base):
    __tablename__ = "qcos"

    id = Column(Integer, primary_key=True, index=True)

    standard_id = Column(
        Integer,
        ForeignKey("standards.id"),
        nullable=False
    )

    qco_title = Column(String(500), nullable=False)
    notification_number = Column(String(200), nullable=True)
    issuing_ministry = Column(String(200), nullable=True)

    notification_date = Column(Date, nullable=True)
    effective_date = Column(Date, nullable=True)

    status = Column(String(50), default="Unverified")

    source_url = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    standard = relationship(
        "Standard",
        foreign_keys=[standard_id]
    )