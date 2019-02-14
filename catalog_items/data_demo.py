from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db_setup import Base, UserInventory #Components, Base, PartItem, User
from sqlalchemy.ext.declarative import declarative_base

#from sqlalchemy.pool import StaticPool


#engine = create_engine('sqlite:///pcinventory.db')
# Source: https://docs.sqlalchemy.org/en/latest/dialects/sqlite.html
#engine = create_engine('sqlite:///pcinventory.db', connect_args={'check_same_thread':False}, poolclass=StaticPool)
engine = create_engine('postgresql://admin:fsnd@localhost:5432/pcinventory')

# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
# A DBSession() instance establishes all conversations with the database
# and represents a "staging zone" for all the objects loaded into the
# database session object. Any change made against the objects in the
# session won't be persisted into the database until you call
# session.commit(). If you're not happy about the changes, you can
# revert all of them back to the last commit by calling
# session.rollback()
session = DBSession()


# Create dummy user
User1 = UserInventory(name="Admin", email="johncban@gmail.com",
             picture='https://avatars2.githubusercontent.com/u/1221375?s=400&u=c54411d77467978a2268f48ffb44664420594c4e&v=4')
session.add(User1)
session.commit()
print ("Demo user Successfully Added!")


