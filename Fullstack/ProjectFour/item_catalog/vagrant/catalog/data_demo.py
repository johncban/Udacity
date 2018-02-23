from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db_setup import Components, Base, PartItem, User

engine = create_engine('sqlite:///pcinventory.db')
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
User1 = User(name="Admin", email="johncban@gmail.com",
             picture='https://avatars2.githubusercontent.com\
             /u/1221375?s=400&u=c54411d77467978a2268f48ffb44664420594c4e&v=4')
session.add(User1)
session.commit()
print ("Demo user Successfully Added!")

# Component Demo Record
pccomponents1 = Components(user_id=User1.id, c_name="CPU Processor")
session.add(pccomponents1)
session.commit()
print("PC Component One Successfully Added!")

partItem1 = PartItem(user_id=User1.id, p_name="Intel\
                     Core i7-7700K Kaby Lake Quad Core",
                     description="Supports Windows 10 OS, \
                     VR and it can reach 4.5 GHz turbo frequency.",
                     cost="$350", qty="2", pccomponents=pccomponents1)
session.add(partItem1)
session.commit()

partItem2 = PartItem(user_id=User1.id, p_name="AMD RYZEN Threadripper 1900X",
                     description="It have 8 cores with 16 threads for up \
                     to 4.0 GHz clock speed and supports DDR4 memory",
                     cost="$550", qty="3", pccomponents=pccomponents1)

session.add(partItem2)
session.commit()
print("PC Part Successfully Added!")

pccomponents2 = Components(user_id=User1.id, c_name="RAM Memory")
session.add(pccomponents2)
session.commit()
print("PC Component Two Successfully Added!")

partItem1 = PartItem(user_id=User1.id, p_name="Corsair Dominator Platinum",
                     description="DDR3 2400 (PC3 19200) 8GB with CAS \
                     Latency 11 and 1.65V consumption.",
                     cost="$180", qty="2", pccomponents=pccomponents2)

session.add(partItem1)
session.commit()

partItem2 = PartItem(user_id=User1.id, p_name="Corsair Vengeance LPX",
                     description="DDR4 2666 (PC4 21200) 16GB with CAS \
                     Latency 16 and 1.2V consumption.",
                     cost="$180", qty="2", pccomponents=pccomponents2)

session.add(partItem1)
session.commit()
print("PC Part Successfully Added!")
