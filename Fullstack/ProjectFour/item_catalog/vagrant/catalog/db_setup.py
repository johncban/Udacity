from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from sqlalchemy import create_engine

Base = declarative_base()


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)
    picture = Column(String(250))


class Components(Base):
    __tablename__ = 'pccomponents'

    id = Column(Integer, primary_key=True)
    c_name = Column(String(250), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship(User, backref="pccomponents")

    @property
    def serialize(self):
        """Serialize data object for JSON"""
        return {
            'id': self.id,
            'c_name': self.c_name,
        }


class PartItem(Base):
    __tablename__ = 'parts_item'

    p_name = Column(String(80), nullable=False)
    id = Column(Integer, primary_key=True)
    description = Column(String(250))
    cost = Column(Integer())
    qty = Column(Integer())
    pccomponents_id = Column(Integer, ForeignKey('pccomponents.id'))
    pccomponents = relationship(Components, backref=backref('parts_item', cascade='all, delete'))
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship(User)

    @property
    def serialize(self):
        """Serialize data object for JSON"""
        return {
            'p_name': self.p_name,
            'description': self.description,
            'id': self.id,
            'cost': self.cost,
            'qty': self.qty,
        }


engine = create_engine('sqlite:///pcinventory.db')
Base.metadata.create_all(engine)