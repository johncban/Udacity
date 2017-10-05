# Import Libraries
import webbrowser

# Movie Class
class Movie():
    """
    FILE: media.py
    ------------------------------------------------------------
    This class provides a way to store movie trailer related information that supports the following files: 
    - entertainment_center.py
    - fresh_tomatoes.py
    ------------------------------------------------------------
    CREDITS: 
    - http://www.tipue.com/tipr/
    - https://www.youtube.com/watch?v=FYP95WJmW3o
    - https://rawgit.com/
    - https://github.com/johncban/assets
    """
    
    # Function definition instances to support entertainment_center.py and fresh_tomatoes.py
    def __init__(self, movie_title, movie_storyline, movie_rated, poster_image, trailer_youtube):
        self.title = movie_title
        self.storyline = movie_storyline
        self.ratings = movie_rated
        self.poster_image_url = poster_image
        self.trailer_youtube_url = trailer_youtube
        
    # Function definition for youtube url fetching    
    def show_trailer(self):
        webbrowser.open(self.trailer_youtube_url)
