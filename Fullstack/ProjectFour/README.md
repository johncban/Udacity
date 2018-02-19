<<<<<<< HEAD
=======

>>>>>>> 5d018b5537547cbd50e68deb7909239826925936
# Project Item Catalog

In fulfillment of Udacity Fullstack Nanodegree (Plus) Project, this app or Item Catalog (PC Inventory Catalog) let the user log-in using google's oauth and utilize CRUD capability.

However, if the user is not able to login it will only preview or show basic information using Bootstrap's modal.

## Screenshot
#### Login Page
![Main Login Page](https://cdn.rawgit.com/johncban/Udacity/fsnd-prjfour/Fullstack/ProjectFour/Screen%20Shot%202018-02-12%20at%207.55.33%20PM.png)

#### Main Page
![Component Page](https://cdn.rawgit.com/johncban/Udacity/fsnd-prjfour/Fullstack/ProjectFour/Screen%20Shot%202018-02-12%20at%207.56.04%20PM.png)

#### Record Preview
![Component Preview](https://cdn.rawgit.com/johncban/Udacity/fsnd-prjfour/Fullstack/ProjectFour/Screen%20Shot%202018-02-12%20at%207.56.17%20PM.png)

#### Logged-In Edit Page
![Edit Page](https://cdn.rawgit.com/johncban/Udacity/fsnd-prjfour/Fullstack/ProjectFour/Screen%20Shot%202018-02-12%20at%207.57.54%20PM.png)



### Prerequisites
The app requires vagrant in able to run the app, it requires you to follow these [steps](https://github.com/johncban/Udacity/blob/fsnd-prjfour/Fullstack/ProjectFour/item_catalog/README.md) to install vagrant.
It also requires python 2 and pip for installing the library requirements within vagrant.
<<<<<<< HEAD
In addition it requires to set-up Google OAuth credentials through google developer site.
=======
In addition it requires to set-up Google OAuth credentials through google developer site. 
>>>>>>> 5d018b5537547cbd50e68deb7909239826925936


### Installing

<<<<<<< HEAD
After installing vagrant it will require to install python 2 within vagrant. To install python 2 but in this vagrant folder python is already installed. For details installing python in vagrant ubuntu box please check this youtube [video](https://youtu.be/S8H7gQUdysU) from techbytes.
=======
After installing vagrant it will require to install python 2 within vagrant. To install python 2 but in this vagrant folder python is already installed. For details installing python in vagrant ubuntu box please check this youtube [video](https://youtu.be/S8H7gQUdysU) from techbytes. 
>>>>>>> 5d018b5537547cbd50e68deb7909239826925936

#### Generate and Obtain Google OAuth credentials
Google OAuth is utilize by the app in order for the user to login and it requires token credentials from Google Dev.
Here is the [video](https://youtu.be/sGLEcsRg0IM) to obtain Google OAuth.
After obtaining Google OAuth, download the client_secrets.json then make sure its embedded in the CLIENT_ID in main.py like the following:

```
CLIENT_ID = json.loads(open('client_secrets.json', 'r').read())[
    'web']['client_id']
```

<<<<<<< HEAD
Under gconnect, check in main.py place or embed client_secrets.json file name so it will identify the CLIENT_ID while checking for the google connect account.
=======
Under gconnect, check in main.py place or embed client_secrets.json file name so it will identify the CLIENT_ID while checking for the google connect account. 
>>>>>>> 5d018b5537547cbd50e68deb7909239826925936

```
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
...
```

Test the Google OAuth if its operational by running the app ```python main.py``` then typing in the browser ```http://localhost:5000/gconnect/```.
It will redirect the user in the google plus login prompt.  

#### App Libraries
The App is dependent in the libraries listed at ```requiresments.txt`` or the following:
```
bleach==2.1.2
cachetools==2.0.1
certifi==2018.1.18
chardet==3.0.4
click==6.7
Flask==0.12.2
Flask-HTTPAuth==3.2.3
Flask-SQLAlchemy==2.3.2
Flask-WTF==0.14.2
google-auth==1.3.0
google-auth-oauthlib==0.2.0
html5lib==1.0.1
httplib2==0.10.3
idna==2.6
itsdangerous==0.24
Jinja2==2.10
MarkupSafe==1.0
oauth2client==4.1.2
oauthlib==2.0.6
packaging==16.8
passlib==1.7.1
psycopg2==2.7.4
pyasn1==0.4.2
pyasn1-modules==0.2.1
pyparsing==2.2.0
redis==2.10.6
requests==2.18.4
requests-oauthlib==0.8.0
rsa==3.4.2
six==1.11.0
SQLAlchemy==1.2.2
uritemplate==3.0.0
urllib3==1.22
webencodings==0.5.1
Werkzeug==0.14.1
WTForms==2.1
<<<<<<< HEAD
```
However, it can be install using ```pip``` by typing ```pip install requirements.txt```


=======
``` 
However, it can be install using ```pip``` by typing ```pip install requirements.txt```

>>>>>>> 5d018b5537547cbd50e68deb7909239826925936
## Running the App

After making the vagrant operational and successfully installed the requirements above, in vagrant folder inside catalog folder just type ```python main.py``` and it will forward you to the components page if you're not logged in; otherwise, if you'll logged in you will see some activated menus for CRUD.

### Running JSON
The app have also JSON serializer capability, just click JSON Report and it will re-forward you to this page:
![JSON page](https://cdn.rawgit.com/johncban/Udacity/fsnd-prjfour/Fullstack/ProjectFour/Screen%20Shot%202018-02-12%20at%207.58.27%20PM.png)

<<<<<<< HEAD

## Features

=======
## Features
>>>>>>> 5d018b5537547cbd50e68deb7909239826925936
The app have WTForms that prompt the user if form is submitted with an empty form field; hence, the user is require to enter information. In addition, there is a [CSRF or cross site request forgery token protection](http://flask-wtf.readthedocs.io/en/stable/csrf.html) that secure the app and its information within the database from being attacked through malicious javascript commands. 

### Future Features
There are some upgrades that will make the app better, such as adding image upload capability, more third party OAuth and the use of phone authenticator such as [Google authenticator phone app](https://pypi.python.org/pypi/authenticator).

<<<<<<< HEAD

## Acknowledgments
* Google
* Github
* Udacity
* Mr. Evan, Udacity Mentor
* Stack Overflow
=======
## Acknowledgments
* Google
* Github
* Udacity 
* Mr. Evan, Udacity Mentor
* Stack Overflow 
>>>>>>> 5d018b5537547cbd50e68deb7909239826925936
