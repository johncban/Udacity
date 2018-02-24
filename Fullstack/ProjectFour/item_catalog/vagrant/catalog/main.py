#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import print_function

import httplib2
import json
import requests
import random
import string

import sys

from flask import Flask, render_template, request, redirect, jsonify, \
    url_for, flash
from sqlalchemy import create_engine, asc
from sqlalchemy.orm import sessionmaker
from db_setup import Base, Components, PartItem, User
from flask import session as login_session

from oauth2client.client import flow_from_clientsecrets
from oauth2client.client import FlowExchangeError
from flask import make_response
from flask_wtf import Form
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired
from login_auth import login_authrequired

"""
Import DebugToolbarExtension
for debugging. (OPTIONAL)
"""

from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

"""Toolbar Debug variable to startup with app.config"""

toolbar = DebugToolbarExtension(app)
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

CLIENT_ID = json.loads(open('client_secrets.json', 'r').read())['web'
                                                                ]['client_id']
APPLICATION_NAME = 'PC Parts Inventory Catalog'

"""Connect to Database and create database session"""

engine = create_engine('sqlite:///pcinventory.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()


"""
REUSEFORM CLASS
It support's WTForms that
validate all the form fields through CSRF
"""


class ReuseForm(Form):

    """
    Fields: name, ec_name, description, cost and qty.
    """

    name = StringField('PC Component Name:',
                       validators=[DataRequired()])
    ec_name = StringField('Edit Component Name:',
                          validators=[DataRequired()])
    prt_name = StringField('Part Name ', validators=[DataRequired()])
    description = TextAreaField('Part Description ',
                                validators=[DataRequired()])
    cost = StringField('Price ', validators=[DataRequired()])
    qty = StringField('Unit Quantity ', validators=[DataRequired()])


"""
CACHE HEADERS
Add headers to both force latest IE rendering engine
or Chrome Frame,and also to
cache the rendered page for 10 minutes.
"""


@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = \
        'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    response.headers['Cache-Control'] = 'public, max-age=0'
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


"""
ANTI-FORGERY STATE
Detects invalid state token in login stage.
"""


@app.route('/login')
def showLogin():
    state = ''.join(random.choice(
        string.ascii_uppercase +
        string.digits)
                    for x
                    in range(32))
    login_session['state'] = state
    print('The current session state is %s' % login_session['state'])
    return render_template('login.html', STATE=state)

"""
GOOGLE OAUTH LOGIN API
Authenticates the user with Google Plus Account
to access most of the app's features.
"""


@app.route('/gconnect', methods=['POST'])
def gconnect():

    # Validate state token

    if request.args.get('state') != login_session['state']:
        response = make_response(json.dumps('Invalid state parameter.'
                                            ), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Obtain authorization code, now compatible with Python3

    request.get_data()
    code = request.data.decode('utf-8')
    try:

        # Upgrade the authorization code into a credentials object

        oauth_flow = flow_from_clientsecrets('client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        response = \
            make_response(json.dumps('Failed to upgrade \
                                     the authorization code.'),
                          401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Check that the access token is valid.

    access_token = credentials.access_token
    url = \
        'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s' \
        % access_token

    # Submit request, parse response - Python3 compatible

    h = httplib2.Http()
    response = h.request(url, 'GET')[1]
    str_response = response.decode('utf-8')
    result = json.loads(str_response)

    # If there was an error in the access token info, abort.

    if result.get('error') is not None:
        response = make_response(json.dumps(result.get('error')), 500)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is used for the intended user.

    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        response = \
            make_response(json.dumps("Token's user ID doesn't \
                                     match given user ID."), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is valid for this app.

    if result['issued_to'] != CLIENT_ID:
        response = \
            make_response(json.dumps("Token's client ID \
                                     does not match app's."), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    stored_access_token = login_session.get('access_token')
    stored_gplus_id = login_session.get('gplus_id')
    if stored_access_token is not None and gplus_id == stored_gplus_id:
        response = \
            make_response(json.dumps('Current user is \
                                     already connected.'), 200)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Store the access token in the session for later use.

    login_session['access_token'] = access_token
    login_session['gplus_id'] = gplus_id

    # Get user info

    userinfo_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
    params = {'access_token': access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)

    data = answer.json()

    login_session['username'] = data['name']
    login_session['picture'] = data['picture']
    login_session['email'] = data['email']

    # see if user exists, if it doesn't make a new one

    user_id = getUserID(login_session['email'])
    if not user_id:
        user_id = createUser(login_session)
    login_session['user_id'] = user_id

    output = ''
    output += '<h1>Welcome, '
    output += login_session['username']
    output += '!</h1>'
    output += '<img src="'
    output += login_session['picture']
    output += \
        ' " style = "width: 300px; height: 300px;border-radius: 150px;\
        -webkit-border-radius: 150px;-moz-border-radius: 150px;"> '
    flash('you are now logged in as %s' % login_session['username'])
    return output


"""
GOOGLE OAUTH LOG-OFF API
Revokes or disconenct the user's
OAuth token.
"""


@app.route('/gdisconnect')
def gdisconnect():

    # Only disconnect a connected user.

    access_token = login_session.get('access_token')
    if access_token is None:
        response = \
            make_response(json.dumps('Current user not connected.'),
                          401)
        response.headers['Content-Type'] = 'application/json'
        return response
    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' \
        % access_token
    h = httplib2.Http()
    result = h.request(url, 'GET')[0]
    if result['status'] == '200':

        # Reset the user's sesson.

        del login_session['access_token']
        del login_session['gplus_id']
        del login_session['username']
        del login_session['email']
        del login_session['picture']

        response = make_response(json.dumps('Successfully \
                                            disconnected.'), 200)
        response.headers['Content-Type'] = 'application/json'
        print(response)
        return redirect(url_for('showLogin'))
    else:

        # For whatever reason, the given token was invalid.

        response = \
            make_response(json.dumps('Failed to revoke token \
                                     for given user.', 400))
        response.headers['Content-Type'] = 'application/json'
        return response

        requests.post('https://accounts.google.com/o/oauth2/revoke',
                      params={'token': credentials.token},
                      headers={'content-type': '\
                               application/x-www-form-urlencoded'})

"""
AUTHORIZATION FIELD ASSIST
The following fields in these 3 functions
supports the user's authenticated authorization from
the database.
"""


def createUser(login_session):
    """Get the user's user_id and match it to login_session."""

    newUser = User(name=login_session['username'],
                   email=login_session['email'],
                   picture=login_session['picture'])
    session.add(newUser)
    session.commit()
    user = session.query(User).filter_by(email=login_session['email\
                                                             ']).one_or_none()
    return user.id


def getUserInfo(user_id):
    """Query the user's data for authorization."""

    user = session.query(User).filter_by(id=user_id).one_or_none()
    return user


def getUserID(email):
    """Authorize the user if user's email matches from the database."""

    try:
        user = session.query(User).filter_by(email=email).one_or_none()
        return user.id
    except:
        return None


"""
JSON PARSING OF ALL RECORDS
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
        session.query(Components).filter_by(id=pccomponents_id).one()
    item_c = \
        session.query(PartItem).\
        filter_by(pccomponents_id=pccomponents_id).all()
    return jsonify(PartItem=[i.serialize for i in item_c])


@app.route('/components/<int:pccomponents_id>/part/<int:part_id>/JSON')
@login_authrequired
def componentPartItemJSON(pccomponents_id, part_id):
    part_item = session.query(PartItem).filter_by(id=part_id).one()
    return jsonify(PartItem=part_item.serialize)


@app.route('/')
def showIndex():
    print('This error output', file=sys.stderr)
    print('This standard output', file=sys.stdout)
    flash('Welcome to PC Components Categorizer Inventory', 'welcome')
    return redirect(url_for('showComponents'))


"""
SHOW ALL MAIN COMPONENTS ROUTE (/components)
"""


@app.route('/components')
def showComponents():
    pc_components = session.query(Components).all()
    pc_parts = \
        session.query(PartItem).order_by(PartItem.id.desc()).\
        join('pccomponents').all()
    flash('Components Section', 'section')
    return render_template('components.html',
                           pc_components=pc_components,
                           pc_parts=pc_parts)


"""
CREATE NEW COMPONENT ROUTE (/components/new)
"""


@app.route('/components/new', methods=['GET', 'POST'])
@login_authrequired
def newComponent():
    form = ReuseForm(request.form)
    newComponentItem = Components(c_name=form.name.data,
                                  user_id=login_session.get('user_id'))
    admin = getUserInfo(newComponentItem.user_id)
    if newComponentItem.user_id != login_session['user_id']:
        flash('You are not Authorized to Create a New Category', 'auth')
        print(admin.name)  # Identify if user is authorized
        return redirect(url_for('showComponents'))
    else:
        if request.method == 'POST':
            flash('Add Components Section', 'section')
            form.validate_on_submit()
            if request.form['name']:
                newComponentItem = \
                    Components(
                        c_name=form.name.data,
                        user_id=login_session['user_id']
                    )
                session.add(newComponentItem)
                session.commit()
                """Informs the user that a \
                new component is added successfully"""
                flash('Component Successfully Added: %s'
                      % newComponentItem.c_name, 'compadd')
                return redirect(url_for('showComponents'))
            return render_template('newComponent.html', form=form)
        else:
            return render_template('newComponent.html', form=form)


"""
EDIT COMPONENT ROUTE (/components/#/edit)
"""


@app.route('/components/<int:pccomponents_id>/edit', methods=['GET',
           'POST'])
@login_authrequired
def editComponent(pccomponents_id):
    form = ReuseForm(request.form)
    editedComponent = \
        session.query(Components).filter_by(id=pccomponents_id).one_or_none()
    admin = getUserInfo(editedComponent.user_id)
    if editedComponent.user_id != login_session.get('user_id'):
        flash('You are Not Authorized to Update a Category', 'auth')
        print(admin.name)  # Identify if user is authorized
        return redirect(url_for('showComponents'))
    else:
        if request.method == 'POST':
            flash('Component Update Section', 'section')
            form.validate_on_submit()
            if request.form['ec_name']:
                editedComponent.c_name = request.form['ec_name']
                session.commit()
                """
                Informs the user that the
                component is updated successfully
                """
                flash('Component Successfully Edited: %s'
                      % editedComponent.c_name, 'compupdate')
                return redirect(url_for('showComponents'))
            return render_template('editComponent.html',
                                   pccomponents=editedComponent,
                                   form=form)
        else:
            return render_template('editComponent.html',
                                   pccomponents=editedComponent,
                                   form=form)


"""
DELETE COMPONENT ROUTE (/components/#/delete)
"""


@app.route('/components/<int:pccomponents_id>/delete', methods=['GET',
           'POST'])
@login_authrequired
def deleteComponent(pccomponents_id):
    deleteTheComponent = \
        session.query(Components).filter_by(id=pccomponents_id).one_or_none()
    admin = getUserInfo(deleteTheComponent.user_id)
    if login_session.get('user_id') != deleteTheComponent.user_id:
        flash('You are Not Authorized to Delete a Category', 'auth')
        print(admin.name)  # Identify if user is authorized
        return redirect(url_for('showComponents'))
    if request.method == 'POST':
        session.delete(deleteTheComponent)
        session.commit()
        flash('Component Successfully Deleted: %s'
              % deleteTheComponent.c_name, 'compdelete')
        return redirect(url_for('showComponents',
                        pccomponents_id=pccomponents_id))
    else:
        return render_template('deleteComponent.html',
                               pccomponents=deleteTheComponent)


"""
SHOW ALL PARTS AND SPECIFIC
PARTS ROUTE (/components/#/componentparts)
"""


@app.route('/components/<int:pccomponents_id>/componentparts')
def showParts(pccomponents_id):
    pc_components = \
        session.query(Components).filter_by(id=pccomponents_id).one_or_none()
    admin = getUserInfo(pc_components.user_id)
    pc_parts = \
        session.query(PartItem). \
        filter_by(pccomponents_id=pccomponents_id).all()
    print(admin.name)  # Identify if user is authorized
    return render_template('pcParts.html', pc_parts=pc_parts,
                           pc_components=pc_components, admin=admin)


"""
NEW PART ITEM ROUTE
(/components/#/componentparts/new)
"""


@app.route('/components/<int:pccomponents_id>/componentparts/new',
           methods=['GET', 'POST'])
@login_authrequired
def newPartItem(pccomponents_id):
    pc_components = \
        session.query(Components).filter_by(id=pccomponents_id).one_or_none()
    admin = getUserInfo(pc_components.user_id)
    form = ReuseForm(request.form)
    if login_session.get('user_id') != pc_components.user_id:
        flash('You are Not Authorized to Create a New Part Item', 'auth'
              )
        print(admin.name)  # Identify if user is authorized
        return redirect(url_for('showComponents'))
    else:
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
                """Informs the user that a new part is created successfully"""
                flash('New PC Part Item Added: %s' % newPart.p_name,
                      'partnew')
                return redirect(url_for('showParts',
                                pccomponents_id=pccomponents_id,
                                form=form))
            return render_template('newPartItem.html',
                                   pccomponents_id=pccomponents_id,
                                   form=form)
        else:
            return render_template('newPartItem.html',
                                   pccomponents_id=pccomponents_id,
                                   form=form)


"""
PART UPDATE ROUTE
(/components/#/componentparts/#/edit)
"""


@app.route('/components/<int:pccomponents_id>/\
 componentparts/<int:part_id>/edit', methods=['GET', 'POST'])
@login_authrequired
def editPartItem(pccomponents_id, part_id):
    form = ReuseForm(request.form)
    pc_components = \
        session.query(Components).filter_by(id=pccomponents_id).one_or_none()
    editThePartItem = \
        session.query(PartItem).filter_by(id=part_id).one_or_none()
    admin = getUserInfo(editThePartItem.user_id)
    if login_session.get('user_id') != pc_components.user_id:
        flash('You are Not Authorized to Update a Part Item', 'auth')
        print(admin.name)  # Identify if user is authorized
        return redirect(url_for('showComponents'))
    else:
        flash('Edit Parts Section', 'section')
        if request.method == 'POST':
            form.validate_on_submit()
            if request.form['prt_name']:
                editThePartItem.p_name = request.form['prt_name']
                editThePartItem.description = request.form['description']
                editThePartItem.cost = request.form['cost']
                editThePartItem.qty = request.form['qty']
                session.commit()
                """Informs the user that a part is updated successfully"""
                flash('PC Part Item Updated Row: %s'
                      % editThePartItem.id, 'partedit')
                return redirect(url_for('showParts',
                                pccomponents_id=pccomponents_id,
                                form=form))
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
DELETE PART ROUTE
(/components/#/componentparts/#/delete)
"""


@app.route('/components/\
           <int:pccomponents_id>/componentparts/\
           <int:part_id>/delete', methods=['GET', 'POST'])
@login_authrequired
def deletePartItem(pccomponents_id, part_id):
    pc_components = \
        session.query(Components).filter_by(id=pccomponents_id).one()
    delete_thepart_item = \
        session.query(PartItem).filter_by(id=part_id).one_or_none()
    admin = getUserInfo(pc_components.user_id)
    if login_session.get('user_id') != pc_components.user_id:
        flash('You are Not Authorized to Delete Part Item', 'auth')
        print(admin.name)  # Identify if user is authorized
        return redirect(url_for('showComponents'))
    else:
        if request.method == 'POST':
            session.delete(delete_thepart_item)
            session.commit()
            """Informs the user that a part is deleted successfully"""
            flash('PC Part Item Deleted Row: %s'
                  % delete_thepart_item.id, 'partdelete')
            return redirect(url_for('showParts',
                            pccomponents_id=pccomponents_id))
        else:
            return render_template('deletePartComponent.html',
                                   item=delete_thepart_item)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
