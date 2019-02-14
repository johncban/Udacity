from sqlalchemy import Column, ForeignKey, Integer, String, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from sqlalchemy import create_engine
#from sqlalchemy.pool import StaticPool

Base = declarative_base()


class UserInventory(Base):
    __tablename__ = 'usr'

    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)
    picture = Column(String(250))


class Components(Base):
    __tablename__ = 'pccomponents'

    id = Column(Integer, primary_key=True)
    c_name = Column(String(250), nullable=False)
    pic_name = Column(String(300), nullable=False)
    pic = Column(LargeBinary, nullable=False)
    user_id = Column(Integer, ForeignKey('usr.id'))
    user = relationship(UserInventory, backref="pccomponents")

    @property
    def serialize(self):
        """Serialize data object for JSON"""
        return {
            'id': self.id,
            'c_name': self.c_name,
            'pic_name': self.pic_name
        }

class PartItem(Base):
    __tablename__ = 'parts_item'

    p_name = Column(String(80), nullable=False)
    id = Column(Integer, primary_key=True)
    description = Column(String(250))
    picpart_name = Column(String(300), nullable=False)
    picpart = Column(LargeBinary, nullable=False)
    cost = Column(Integer())
    qty = Column(Integer())
    pccomponents_id = Column(Integer, ForeignKey('pccomponents.id'))
    pccomponents = relationship(Components, backref=backref('parts_item', cascade='all, delete'))
    user_id = Column(Integer, ForeignKey('usr.id'))
    user = relationship(UserInventory)

    @property
    def serialize(self):
        """Serialize data object for JSON"""
        return {
            'id': self.id,
            'p_name': self.p_name,
            'description': self.description,
            'picpart_name': self.picpart_name,
            'cost': self.cost,
            'qty': self.qty
        }


#engine = create_engine('sqlite:///pcinventory.db')

#Source: https://docs.sqlalchemy.org/en/latest/dialects/sqlite.html
"""
engine = create_engine('sqlite:///pcinventory.db', connect_args={'check_same_thread':False}, poolclass=StaticPool)
"""
engine = create_engine('postgresql://admin:fsnd@localhost:5432/pcinventory')
Base.metadata.create_all(engine)