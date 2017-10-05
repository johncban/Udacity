# Imported OMDB API Libraries and Class
"""
This File Provides Movie Trailer Records - entertainment_center.py
------------------------------------------------------------------
Note: 
------------------------------------------------------------------
Please download omdb library before running entertainment_center.py.
To download omdb, please type pip install omdb in your command prompt or terminal.
"""
import media
import fresh_tomatoes
import omdb

# OMDB API instances 
'''
    Fetch the selected movies through title from OMDB API.
'''
movOne = omdb.get(title="John Wick")
movTwo = omdb.get(title="The Bourne Legacy")
movThree = omdb.get(title="Casino Royale")
movFour = omdb.get(title="Zero Days")
movFive = omdb.get(title="Mobile Suit Gundam")
movSix = omdb.get(title="Pulp Fiction")

# Movie Trailer Arrays
'''
    Fetch the specific selected records from OMDB API class using OMDB API instance.
'''
johnwick = media.Movie(movOne['title'], 
                       movOne['plot'], 
                       movOne['rated'], 
                       movOne['poster'],
                       "https://www.youtube.com/watch?v=2AUmvWm5ZDQ")

bourne_legacy = media.Movie(movTwo['title'], 
                            movTwo['plot'], 
                            movTwo['rated'], 
                            movTwo['poster'],
                            "https://www.youtube.com/watch?v=jSzy9qQ3mDE")

james_bond_cr = media.Movie(movThree['title'], 
                            movThree['plot'], 
                            movThree['rated'], 
                            movThree['poster'],
                            "https://www.youtube.com/watch?v=36mnx8dBbGE&t=11s")

zero_days = media.Movie(movFour['title'], 
                        movFour['plot'], 
                        movFour['rated'], 
                        movFour['poster'],
                        "https://www.youtube.com/watch?v=C8lj45IL5J4")

mobilesuit_gundam = media.Movie(movFive['title'], 
                                movFive['plot'], 
                                movFive['rated'], 
                                movFive['poster'],
                                "https://www.youtube.com/watch?v=JCajy6B0aJw")

pulp_fiction = media.Movie(movSix['title'], 
                           movSix['plot'], 
                           movSix['rated'], 
                           movSix['poster'],
                           "https://www.youtube.com/watch?v=s7EdQ4FqbhY")


'''
    Obtain array of trailers from Movie Trailer Arrays.
'''
movies = [johnwick, bourne_legacy, james_bond_cr, zero_days, mobilesuit_gundam, pulp_fiction]
'''
    Push the movies class using Movie Trailer Arrays in fresh_tomatoes.py to generate the index page.
'''
fresh_tomatoes.open_movies_page(movies)
'''
    Print the comment note of media.py
'''
print(media.Movie.__doc__)