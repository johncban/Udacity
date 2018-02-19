from functools import wraps
from flask import redirect, flash
from flask import session as login_session

def login_authrequired(f):
    '''Checks to see whether a user is logged in'''
    @wraps(f)
    def x(*args, **kwargs):
        if 'username' not in login_session:
            flash ("User Require To Login Using Google Plus", 'auth')
            return redirect('/login')
        return f(*args, **kwargs)
    return x
