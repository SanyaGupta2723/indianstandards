from sqlalchemy import Column, Integer, String, Text, Date

from app.database import Base


class Standard(Base):
    __tablename__ = "standards"

    id = Column(Integer, primary_key=True, index=True)

    is_number = Column(String(50), unique=True, nullable=False, index=True)

    title = Column(String(500), nullable=False)

    scope = Column(Text, nullable=True)

    standard_type = Column(String(100), nullable=True)

    category = Column(String(100), nullable=True)

    edition = Column(String(50), nullable=True)

    publication_date = Column(Date, nullable=True)

    status = Column(String(50), default="Active")

    source_url = Column(Text, nullable=True)