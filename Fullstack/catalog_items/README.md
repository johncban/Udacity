
# FSND Linux Project

Project deployment process and app demonstration.

## Amazon Lightsail

![lightsaillogo.jpg](http://blog.aws.electromech.info/wp-content/uploads/2017/10/lightsail.jpg)

In this project, Amazon AWS Lightsail will be utilize using Ubuntu 18.04 as its OS support and Flask as its framework.

### To Begin
It require to create an account instance by selecting Linux as a platform while the blueprint would be OS Only called Ubuntu 18.04.

![lightsail.png](https://raw.githubusercontent.com/johncban/Udacity/fsnd-prjsix/Fullstack/catalog_items/img/lightsail.png)


#### Instance Plan
![price.png](https://raw.githubusercontent.com/johncban/Udacity/fsnd-prjsix/Fullstack/catalog_items/img/price.png)
The AWS Lightsail Plan will be $3.50 under the following specs:
- 512 MB RAM
- 1 vCPU processor
- 20 GB SSD
- 1TB bandwidth transfer

### Default SSH or .pem Keys

.pem keys are default ssh keys provided by AWS Lightsail from their respective server location registered in the AWS account.

To begin the process of client SSH in AWS Lightsail, download the SSH pem file key pair as shown below.
![ssh.png](https://raw.githubusercontent.com/johncban/Udacity/fsnd-prjsix/Fullstack/catalog_items/img/ssh.png)

Move the default lightsail key for your root access in the local machine's .ssh folder then change the file's permission.
```
chmod 600 LightSailDefaultKey-us-east-1.pem
```

From the .ssh folder run the following command to begin remote login as root.

```
ssh -i LightSailDefaultKey-us-east-1.pem ubuntu@<PUBCLIC IP>
```
Do not forget to turn provided public IP into static IP by doing the following procedure.
1. On the Lightsail console page, choose Networking.
2. Under Networking page choose Create static IP.
3. Select the AWS Region that the server is designated to create the static IP.
4. Choose the Lightsail resource that the static IP needs to be attach.
5. Label or name the static IP then choose Create.

## Preparation
Once login with the static public IP, its time to update the apporpriate time zone.
In this case as per requirement, UTC is the time zone that is applicable for the AWS OS server. 
To change the timezone, enter the following command.
```
sudo timedatectl set-timezone UTC
```
As the timezone is updated it will require the Lightsail's Ubuntu OS to be updated and upgraded its libraries as follows.
```
sudo apt-get update && sudo apt-get upgrade && sudo apt-get dist-upgrade
```

####


### Create User (Grader)

Creating another user with proper provileages is important to manage users and for security.
Using root account that controls all the OS environment from the server is a recipe for disaster.
To create a user called grader do the following while in root account.
```
sudo adduser grader
```
After entering the command above it will prompt for several questions about the new user. However, in order to provide proper permission or privilleage to the said user it will require the following command.
```
sudo usermod -aG sudo grader
```

### Securing the New User and RSA Key

Creating a password or keys per user is another good remote client security practice to avoid invalid users and man in the middle attacks.
These keys are generated in the user's local machine supported with RSA encryption; hence, man in the middle attacks is almost impossible.

To generate local machine ssh-keys, enter the following in the local machine.
```
ssh-keygen
```
There would be a prompt for RSA file name, in my case I use grader_udacity then a prompt for passphrase will show asking for the designated pass.
After filling up the prompts for the key's information, it will generate two files:
- grader_udacity
- grader_udacity.pub

#### Deploy client RSA to remote RSA 
Login to grader user account.
```
ssh -i grader@<PUBLIC IP>
```
In the said user account and under the current directory create a folder called .ssh
```
mkdir .ssh
```
Then crate a file called authorized_keys
```
touch .ssh/authorized_keys
```
Copy then paste the content of grader_udacity.pub from the local machine to grader's authorized_keys in Lightsail server.
After successfully pasting its contents it will require to adjust the .ssh permission adjustment as follows.
```
chmod 700 .ssh
chmod 644 .ssh/authorized_keys
```
Logoff to the ssh Lightsail terminal then use the following command to login from local machine inside the .ssh folder
```
ssh -i grader_udacity grader@<PUBLIC IP>
```
Type the appropriate passphrase for the prompt as shown below.
```
Enter passphrase for key 'grader_udacity':
```


### Disable root users
Login to Lightsail root access and do the following commands.
```
sudo nano /etc/ssh/sshd_config
```

Inside sshd_config, change 
```
#PermitRootLogin prohibit-password
```
To
```
PermitRootLogin no 
```
Then add 
```
AllowUsers grader
```
The AllowUsers will setup grader to ssh and not the root. 

##### Restart the SSH service
```
sudo service ssh restart
```

Disconnect then try to reconnect again; hence, the output will be the following
```
Connection closed by <PUBLIC IP>
```

### Change SSH Port
In the same setting but in grader user, change the default ssh port from 22 to 2200.
```
sudo nano /etc/ssh/sshd_config
```
![sshport.png](https://raw.githubusercontent.com/johncban/Udacity/fsnd-prjsix/Fullstack/catalog_items/img/sshport.png)

Then restart the ssh service.
```
sudo service sshd restart
```

### The Firewall and UFW
To make sure the server is properly protected it will require only the following ports and protocols are allowed.
- Port 80
- Port 2200
- Port 123
- NTP
- SSH
- HTTP
- TCP
In Lightsail's case its different but workable with UFW. 
![firewall.png](https://raw.githubusercontent.com/johncban/Udacity/fsnd-prjsix/Fullstack/catalog_items/img/firewall.png)

To adjust the UFW firewall policy enter the following commands.
```
sudo ufw default deny incoming
sudo ufw default deny outgoing
sudo ufw allow ntp
sudo ufw allow http
sudo ufw allow 2200/tcp
```

To monitor ufw status, enter the following command
```
$ sudo ufw status
```
```
grader@PUBLIC-IP:/etc/apache2/sites-available$ sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
2200/tcp                   ALLOW       Anywhere                  
80/tcp                     ALLOW       Anywhere                  
123                        ALLOW       Anywhere                  
2200/tcp (v6)              ALLOW       Anywhere (v6)             
80/tcp (v6)                ALLOW       Anywhere (v6)             
123 (v6)                   ALLOW       Anywhere (v6)
```
## Software Installation

The following software will be installed to support Python, Flask and Apache.
	- Python mod_wsgi
	- Pip and Flask
	- Apache2
	- PostgreSQL
	- Github

### Python and mod_wsgi
Use the following command to install mod_wsgi and apache (Python is installed by default)
To install WSGI
```
sudo apt-get install libapache2-mod-wsgi python-dev
```
To install apache and enable WSGI
```
sudo apt-get install apache2
sudo a2enmod wsgi
```
To install Github
```
sudo apt-get install git
```
To install PostgresSQL
```
sudo apt-get install postgresql postgresql-contrib
sudo update-rc.d postgresql enable
```
To install pip
```
sudo apt-get install python-pip
```

## Project Deployment
To begin fetching the project from Github, navigate first to /var/www then inside clone the application.
```
sudo git clone -b fsnd-prjfour https://github.com/johncban/Udacity.git
```
After the repository is cloned, move the catalog_item to /var/www from Udacity folder then adjust the catalog_item's ownership.
```
sudo chown grader -R catalog_items
```

### Application Libraries
In the catalog_items app inside terminal, enter pip freeze > requirements.txt in order to obtain the packages within the deployed app in lightsail.
As the requirements.txt is generated, install the libraries recursively by using the following command
```
sudo pip install -r requirements.txt
```

## Application Deployment
Database, Oauth Client and Tables

#### Client Services and Oauth
The client_secrets.json require to be created and not to be uploaded in github because it’s a private key from Google's oauth (in respect to security).
Inside catalog_items or the app, create a client_secrets.json then copy and paste the generated client_secrets.json contents from google oauth console.
```
/var/www/catalog_items$ sudo nano client_secrets.json
```
#### Oauth Client ID
The Oauth client id path or url needs to be adjusted by editing the application.py and adding the /var/www/ directory as follows.
```
CLIENT_ID = json.loads(open('/var/www/catalog_items/client_secrets.json', 'r').read())['web']['client_id']

oauth_flow = flow_from_clientsecrets('/var/www/catalog_items/client_secrets.json', scope='')

```

#### Database
To login in psql it require to operate as postgres user as follows
```
sudo su - postgres
```

Then follow these commands to create pcinventory database and admin user of the said database.
```
postgres@ip-<PUBLIC IP>:~$ psql
```
```
psql (10.6 (Ubuntu 10.6-0ubuntu0.18.04.1))
Type "help" for help.
postgres=# CREATE USER admin WITH PASSWORD 'fsnd';
CREATE ROLE
postgres=# ALTER USER admin CREATEDB;
ALTER ROLE
postgres=# CREATE DATABASE pcinventory WITH OWNER admin;
CREATE DATABASE
```

Connect to the pcinventory database to transfer schema to pcinventory and to admin
```
postgres=# \c pcinventory
You are now connected to database "pcinventory" as user "postgres".
pcinventory=# REVOKE ALL ON SCHEMA public FROM public;
REVOKE
pcinventory=# GRANT ALL ON SCHEMA public TO admin;
GRANT
```

Exit from pcinventory database and postgres
```
pcinventory=# \q
postgres@ip-172-26-2-3:~$ exit
logout
```

#### Table Creation
Inside catalog_items app, run db_setup.py to create the tables and check the tables  within postgresql
```
python db_setup.py
```
```
grader@<PUBLIC IP>:/var/www/catalog_items$ sudo su - postgres
postgres@<PUBLIC IP>:~$ psql
psql (10.6 (Ubuntu 10.6-0ubuntu0.18.04.1))
Type "help" for help.

postgres=# \c pcinventory
You are now connected to database "pcinventory" as user "postgres".
pcinventory=# \dt
List of relations

Schema |     Name      | Type  | Owner
--------+--------------+-------+-------
public | parts_item   | table | admin
public | pccomponents | table | admin
public | usr          | table | admin
(3 rows)
```

Then exit from database and postgres.


### User Creation
The whole app can only create or access the admin page under the user name admin. To generate the admin row, run the following python file from /var/www/catalog_items
```
$ python data_demo.py
Demo user Successfully Added!  
```

### Entry Point and Virtual Hosting
Create a .wsgi file in order to support the app's startup inside apache.
To do this create catalog_items.wsgi inside the root folder of catalog_items root folder
```
grader@<PUBLIC IP>:/var/www/catalog_items$ sudo touch catalog_items.wsgi
```
```
grader@PUBLIC-IP:/var/www/catalog_items$ tree
.
├── PC Parts Inventory Catalog-c86e96fe12e3.json
├── README.txt
├── application.py
├── **catalog_items.wsgi**
├── client_secrets.json
├── data_demo.py
├── db_setup.py
├── db_setup.pyc
├── login_auth.py
├── package-lock.json
├── pcinventory.db
├── requirements.txt
├── static
│   ├── css
│   │   ├── button.css
│   │   ├── flash.css
│   │   ├── form.css
│   │   ├── login.css
│   │   ├── main.css
│   │   ├── response.css
│   │   └── tab.css
│   ├── img
│   │   ├── cpu.png
│   │   ├── hd.png
│   │   ├── icon
│   │   │   └── glyphicons-260-barcode.png
│   │   ├── mb.png
│   │   └── ram.png
│   └── js
│       ├── google_signInCallback.js
│       └── main.js
└── templates
    ├── components.html
    ├── deleteComponent.html
    ├── deletePartComponent.html
    ├── editComponent.html
    ├── editPartComponent.html
    ├── header.html
    ├── login.html
    ├── newComponent.html
    ├── newPartItem.html
    └── pcParts.html
```

##### catalog_items.wsgi content
```
import sys

sys.path.insert(0, '/var/www/catalog_items')

from application import app as application
```

#### Virtual Host

Create a virtual host .conf file inside /etc/apache2/sites-available it would be called catalog_items.conf
```
/etc/apache2/sites-available$ tree
.
├── 000-default.conf
├── **catalog_items.conf**
└── default-ssl.conf
```

##### catalog_items. content
```
<VirtualHost *:80>
     ServerName  3.208.138.116.xip.io
     ServerAdmin johncban@gmail.com
     # WSGI Location
     WSGIScriptAlias / /var/www/catalog_items/catalog_items.wsgi
     # Apache Permissions
     <Directory /var/www/catalog_items>
          Order allow,deny
          Allow from all
     </Directory>
     # Deploy static assets 
     <Directory /var/www/catalog_items/static>
        Order allow,deny
        Allow from all
      </Directory>
       ErrorLog ${APACHE_LOG_DIR}/error.log
       LogLevel warn
       CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```


As both Entry point and Virtual host files are complete, enter the following command to make the project page run as default.
```
sudo a2dissite 000−default.conf
sudo a2ensite catalog_items.conf
sudo service apache2 reload
```


If experienced error 500 page, enter the following command to see the source of error from the apache2 error log.
```
sudo tail −f /var/log/apache2/error.log
```

## Deployed App
[PC Components Catalog](http://fsndportfolio.ml)

![screen.png](https://raw.githubusercontent.com/johncban/Udacity/fsnd-prjsix/Fullstack/catalog_items/img/site.png)


## Resources

* http://www.aodba.com/fix-warning-remote-host-identification-changed/

* https://stackoverflow.com/questions/46028907/how-do-i-connect-to-a-new-amazon-lightsail-instance-from-my-mac

* https://lightsail.aws.amazon.com/ls/docs/en/articles/lightsail-create-static-ip

* https://askubuntu.com/questions/3375/how-to-change-time-zone-settings-from-the-command-line

* https://www.godaddy.com/help/changing-the-ssh-port-for-your-linux-server-7306
	
* https://www.a2hosting.com/kb/getting-started-guide/accessing-your-account/disabling-ssh-logins-for-root
	
* https://askubuntu.com/questions/904850/changing-permissions-for-var-www-html

* https://askubuntu.com/questions/889798/ufw-delete-all-rules

* https://mudspringhiker.github.io/deploying-a-flask-web-app-on-lightsail-aws.html

* https://www.digitalocean.com/community/tutorials/how-to-setup-a-firewall-with-ufw-on-an-ubuntu-and-debian-cloud-server

* https://stackoverflow.com/questions/20627327/invalid-command-wsgiscriptalias-perhaps-misspelled-or-defined-by-a-module-not

* https://medium.com/@JoshuaTheMiller/creating-a-simple-website-with-a-custom-domain-on-amazon-lightsail-docker-86600f19273


