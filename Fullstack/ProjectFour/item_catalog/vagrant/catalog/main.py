#!/usr/bin/python
# -*- coding: utf-8 -*-

# main.py

"""
Import essential Flask, SQLalchemy libraries and Database setup.
"""
import json
import datetime
import random
import string
import google.oauth2.credentials
import google_auth_oauthlib.flow
import httplib2
import requests

from flask import Flask, render_template, request
from flask import redirect, url_for, flash, jsonify, make_response
from sqlalchemy import create_engine, asc
from sqlalchemy.orm import sessionmaker
from flask import session as login_session
from db_setup import Base, Components, PartItem, User
from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError

from flask_wtf import Form
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired

from login_auth import login_authrequired

"""
Import DebugToolbarExtension for debugging.
"""
#from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)

app.debug = True
app.config['SECRET_KEY'] = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

"""
Toolbar Debug variable
to startup with app.config
"""
#toolbar = DebugToolbarExtension(app)
#app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

CLIENT_ID = json.loads(open('client_secrets.json', 'r').read())[
    'web']['client_id']
APPLICATION_NAME = 'PC Parts Inventory Catalog'

engine = create_engine('sqlite:///pcinventory.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

usr_date = datetime.datetime.utcnow

@app.after_request
def add_header(response):
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


"""
'ReuseForm' - it support's WTForms that
validate all the form fields through csrf
"""


class ReuseForm(Form):
    name = StringField('PC Component Name:', validators=[DataRequired()])
    ec_name = StringField('Edit Component Name:', validators=[DataRequired()])
    prt_name = StringField('Part Name ', validators=[DataRequired()])
    description = TextAreaField(
        'Part Description ', validators=[
            DataRequired()])
    cost = StringField('Price ', validators=[DataRequired()])
    qty = StringField('Unit Quantity ', validators=[DataRequired()])



"""
App Login Page
"""

"""
Crate Local User Account - HELPER
"""
def createUser(login_session):
    newUser = User(name=login_session['username'], email=login_session[
                   'email'], picture=login_session['picture'])
    session.add(newUser)
    session.commit()
    user = session.query(User).filter_by(email=login_session['email']).one()
    return user.id


def getUserInfo(user_id):
    user = session.query(User).filter_by(id=user_id).one()
    return user


def getUserID(email):
    try:
        user = session.query(User).filter_by(email=email).one()
        return user.id
    except:
        return None

@app.route('/login')
def showLogin():
    state = ''.join(
        random.choice(
            string.ascii_uppercase +
            string.digits) for x in xrange(32))
    login_session['state'] = state
    # return "The current session state is %s" % login_session['state']
    return render_template('login.html', STATE=state)


"""
CONNECT - Use a current user's token and conenct their login session.
"""


@app.route('/gconnect', methods=['POST'])
def gconnect():
    # Validate state token
    if request.args.get('state') != login_session['state']:
        response = make_response(json.dumps('Invalid state parameter.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    # Obtain authorization code
    code = request.data
    try:
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets('client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        response = make_response(
            json.dumps('Failed to upgrade the authorization code.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Check that the access token is valid.
    access_token = credentials.access_token
    url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s' % access_token
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])

    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
        response = make_response(json.dumps(result.get('error')), 500)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        response = make_response(
            json.dumps("Token's user ID doesn't match given user ID."), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        response = make_response(
            json.dumps("Token's client ID does not match app's."), 401)
        print "Token's client ID does not match app's."
        response.headers['Content-Type'] = 'application/json'
        return response

    stored_access_token = login_session.get('access_token')
    stored_gplus_id = login_session.get('gplus_id')

    if stored_access_token is not None and gplus_id == stored_gplus_id:
        response = make_response(
            json.dumps('Current user is already connected.'), 200)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Store the access token in the session for later use.
    login_session['access_token'] = credentials.access_token
    login_session['gplus_id'] = gplus_id

    # Get user info
    userinfo_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)

    data = answer.json()

    login_session['username'] = data['name']
    login_session['picture'] = data['picture']
    login_session['email'] = data['email']

    output = ''
    output += '<h1>Welcome, '
    output += login_session['username']
    output += '!</h1>'
    output += '<img src="'
    output += login_session['picture']
    output += ' " style = "width: 300px; height: 300px;border-radius: 150px;-webkit-border-radius: 150px;-moz-border-radius: 150px;"> '
    flash('You are now logged in as %s' % login_session['username'], 'logged')
    return output


"""
DISCONNECT - Revoke a current user's token and reset their login session.
"""


@app.route('/gdisconnect')
def gdisconnect():
    # Only disconnect a connected user.
    # credentials = login_session.get('credentials')
    access_token = login_session.get('access_token')
    if access_token is None:

        print 'Access Token is None'

        response = make_response(json.dumps('Current user not conencted'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    print 'In gdisconnect access token is %s', access_token
    print 'User name is: '
    print login_session['username']

    # Execute HTTP GET request to revoke current token.
    # access_token = credentials.access_token
    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' % login_session['access_token']
    h = httplib2.Http()
    result = h.request(url, 'GET')[0]

    print 'result is '
    print result

    if result.status == 200:
        del login_session['access_token']
        del login_session['gplus_id']
        del login_session['username']
        del login_session['email']
        del login_session['picture']

        response = make_response(json.dumps('Successfully disconnected.'), 200)
        response.headers['Connect-Type'] = 'application/json'

        # return response
        return redirect(url_for('showLogin'))
    else:
        response = make_response(
            json.dumps(
                'Failed to revoke token for given user.',
                400))
        response.headers['Content-Type'] = 'application/json'
        return response


"""
Root directory to PC Component Item Cateogry App
"""


@app.route('/')
def showIndex():
    flash('Welcome to PC Components Categorizer Inventory', 'welcome')
    return redirect(url_for('showComponents'))


"""
Define 'showComponents' to SELECT or
show all pc component categories not pc items
"""


@app.route('/components')
def showComponents():
    pc_components = session.query(Components).all()
    pc_parts = session.query(PartItem).order_by(
        PartItem.id.desc()).join('pccomponents').all()
    flash('Components Section', 'section')
    return render_template('components.html',
                           pc_components=pc_components,
                           pc_parts=pc_parts)



"""
Define 'newComponent' to CREATE a single pc component
"""


@app.route('/components/new', methods=['GET', 'POST'])
@login_authrequired
def newComponent():
        flash('Add Components Section', 'section')
        form = ReuseForm(request.form)
        if request.method == 'POST':
            form.validate_on_submit()
            if request.form['name']:
                newComponent = Components(c_name=form.name.data)
                session.add(newComponent)
                session.commit()
                flash('New Component Added!', 'compadd')
                return redirect(url_for('showComponents'))
            return render_template('newComponent.html', form=form)
        else:
            return render_template('newComponent.html', form=form)


"""
Define 'editComponent' to UPDATE a single pc component
"""


@app.route('/components/<int:pccomponents_id>/edit', methods=['GET', 'POST'])
def editComponent(pccomponents_id):
    editedComponent = session.query(Components).filter_by(id=pccomponents_id).one_or_none()
    admin = getUserInfo(editedComponent.user_id)
    form = ReuseForm(request.form)
    if 'username' not in login_session or editedComponent.user_id != login_session.get('user_id'):
        flash ("Updating Component Row Only Authorize: %s" % admin.name, 'auth')
        return redirect(url_for('showComponents'))
    if request.method == 'POST':
        flash('Component Update Section', 'section')
        form.validate_on_submit()
        if request.form['ec_name']:
            editedComponent.name = request.form['ec_name']
        session.add(editedComponent)
        session.commit()
        flash('Category Item Successfully Edited!')
        return  redirect(url_for('showComponents'))
    else:
        return render_template('editComponent.html',
                                pccomponents=editedComponent,
                                form=form)


"""
Define 'deleteComponent' to DELETE
specific pc component related to single or multiple pc part item(s)
"""


@app.route('/components/<int:pccomponents_id>/delete', methods=['GET', 'POST'])
def deleteComponent(pccomponents_id):
    deleteTheComponent = session.query(
            Components).filter_by(id=pccomponents_id).one_or_none()
    admin = getUserInfo(deleteTheComponent.user_id)
    form = ReuseForm(request.form)
    if admin.id != login_session.get('user_id'):
        flash ("Deleting PC Component Only Authorize: %s" % admin.name, 'auth')
        return redirect(url_for('showComponents'))
    if request.method == 'POST':
        session.delete(deleteTheComponent)
        session.commit()
        flash('PC Component Deleted!', 'compdelete')
        return redirect(url_for(
                    'showComponents',
                    pccomponents_id=pccomponents_id))
    else:
            return render_template(
                'deleteComponent.html', pccomponents=deleteTheComponent)


"""
Define 'showParts' to SELECT all records related specifically
to both each pc parts and pc components
"""


@app.route('/components/<int:pccomponents_id>/componentparts')
def showParts(pccomponents_id):
    pc_components = session.query(
        Components).filter_by(id=pccomponents_id).one_or_none()
    pc_parts = session.query(PartItem).filter_by(
        pccomponents_id=pccomponents_id).all()
    flash('PC Parts Section', 'section')
    return render_template(
        'pcParts.html', pc_components=pc_components, pc_parts=pc_parts)


"""
Define 'newPartItem' to CREATE specific pc part(s)
item that is related from a component
"""


@app.route('/components/<int:pccomponents_id>/componentparts/new',
           methods=['GET', 'POST'])
@login_authrequired
def newPartItem(pccomponents_id):
    pc_items = session.query(
        PartItem).filter_by(id=pccomponents_id).one()
    # admin = getUserInfo(pc_items.user_id)
    form = ReuseForm(request.form)
    """
    if admin.id != login_session.get('user_id'):
        flash ("Creating PC Component Item Only Authorize: %s" % admin.name, 'auth')
        return redirect(url_for('showComponents'))
    """
    if request.method == 'POST':
        flash('New Parts Section', 'section')
        form.validate_on_submit()
        if request.form['prt_name']:
            newPart = PartItem(p_name=form.prt_name.data,
                                   description=form.description.data,
                                   cost=form.cost.data,
                                   qty=form.qty.data,
                                   pccomponents_id=pccomponents_id)
            session.add(newPart)
            session.commit()
            flash('New PC Part Item Added!', 'partnew')
            return redirect(
                url_for(
                    'showParts',
                    pccomponents_id=pccomponents_id,
                    form=form))
        return render_template('newPartItem.html',
                                   pccomponents_id=pccomponents_id,
                                   form=form)
    else:
        return render_template(
            'newPartItem.html', pccomponents_id=pccomponents_id, form=form)


"""
Define 'editPartItem' to UPDATE specific
pc part(s) item related from a component.
"""


@app.route('/components/<int:pccomponents_id>/<int:part_id>/edit',
           methods=['GET', 'POST'])
@login_authrequired
def editPartItem(pccomponents_id, part_id):
    editThePartItem = session.query(PartItem).filter_by(id=part_id).one_or_none()
    admin = getUserInfo(editThePartItem.user_id)
    form = ReuseForm(request.form)
    if editThePartItem.user_id != login_session.get('user_id'):
        flash ("Updating Component Item Only Authorize: %s" % admin.name, 'auth')
        return redirect(url_for('showComponents'))
    if request.method == 'POST':
        flash('Edit Parts Section', 'section')
        form.validate_on_submit()
        if request.form['prt_name']:
            editThePartItem.p_name = request.form['prt_name']
            editThePartItem.description = request.form['description']
            editThePartItem.cost = request.form['cost']
            editThePartItem.qty = request.form['qty']
            session.commit()
            flash('PC Part Item Updated!', 'partedit')
            return redirect(url_for(
                    'showParts', pccomponents_id=pccomponents_id, form=form))
        return render_template('editPartComponent.html',
                                pccomponents_id=pccomponents_id,
                                part_id=part_id,
                                item=editThePartItem, form=form)
    else:
        return render_template('editPartComponent.html',
                                   pccomponents_id=pccomponents_id,
                                   part_id=part_id,
                                   item=editThePartItem, form=form)


"""
Define 'deletePartItem' to DELETE specific pc part(s) related from a component.
"""


@app.route(
    '/components/<int:pccomponents_id>/componentparts/<int:part_id>/delete',
    methods=['GET', 'POST'])
def deletePartItem(pccomponents_id, part_id):
    delete_thepart_item = session.query(
            PartItem).filter_by(id=part_id).one_or_none()
    admin = getUserInfo(delete_thepart_item.user_id)
    if delete_thepart_item.user_id != login_session.get('user_id'):
        flash ("Deleting Component Item Only Authorize: %s" % admin.name, 'auth')
        return redirect(url_for('showComponents'))
    if request.method == 'POST':
        session.delete(delete_thepart_item)
        session.commit()
        flash('PC Part Item Deleted!', 'partdelete')
        return redirect(
                url_for('showParts', pccomponents_id=pccomponents_id))
    else:
        return render_template(
            'deletePartComponent.html', item=delete_thepart_item)


"""
JSON Parsing of PC Component Records, PC Parts Records and Single PC Part
"""


@app.route('/components/JSON')
@login_authrequired
def componentJSON():
        componentAll = session.query(Components).all()
        return jsonify(Components=[i.serialize for i in componentAll])


@app.route('/components/<int:pccomponents_id>/part/JSON')
@login_authrequired
def componentItemJSON(pccomponents_id):
        componentItem = \
            session.query(Components).filter_by(id=pccomponents_id).one_or_none()
        item_c = session.query(PartItem).filter_by(
            pccomponents_id=pccomponents_id).all()
        return jsonify(PartItem=[i.serialize for i in item_c])


@app.route('/components/<int:pccomponents_id>/part/<int:part_id>/JSON')
@login_authrequired
def componentPartItemJSON(pccomponents_id, part_id):
        part_item = session.query(PartItem).filter_by(id=part_id).one_or_none()
        return jsonify(PartItem=part_item.serialize)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
