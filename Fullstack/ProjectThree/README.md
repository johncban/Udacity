# Logs Analysis Project - Articles, Authors and Errors 

In the fulfillment to complete [Udacity's Fullstack Nanodegree](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd004) Third Project.



## About 

The third project represents a scenario about a newspaper site that needs a **internal reporting tool**. 

In this scenario, you have to connect to the database provided by the newspapaer company then collect specific data through SQL queries to analyze the data logs. 
It can print the questions and answers in the terminal or any CLI without further user input (just run the program)


### Log Analysis Project Prerequisites

* [Python 2](https://www.python.org/downloads/release/python-2713/) or [Python 3](https://www.python.org/downloads/release/python-362/)
* [Vagrant](https://www.vagrantup.com/downloads.html)
* [VMware](https://www.virtualbox.org/wiki/Downloads)
* [PEP8](https://pypi.python.org/pypi/pep8)


## Getting Started

These instructions will set you up to run the project from installing the required software above to running the log analysis project.

### Software Installation and Setup

1. Install Vagrant then VirtualBox, please check this youtube [video](https://www.youtube.com/watch?v=RhhF8Yh7OnE) for detail instructions. 
2. Download the [FSND-VM file](https://d17h27t6h515a5.cloudfront.net/topher/2017/August/59822701_fsnd-virtual-machine/fsnd-virtual-machine.zip) (NOTE: Step 1 is mandatory).
3. After step 1 and 2, copy then paste the FSDN-VM folder to the appropriate workspace directory you want.
4. Inside your workspace, cd or change directory to FSDN-VM folder then type the following:  
    ```
    vagrant up
    ```
5. Once the VM is up and running, type the following command to log in the Linux VM:
    ```
    vagrant ssh
    ```

### Preparing the Data

Now you're inside Linux VM, its time to prepare the data.

1. Download the database in this [link](https://d17h27t6h515a5.cloudfront.net/topher/2016/August/57b5f748_newsdata/newsdata.zip).
2. After downloading the database unzip the downloaded file then copy newsdata.sql and paste it to vagrant folder inside FSDN-VM folder under your workspace direcotry.
3. Run or connect to the database using ```psql``` command. 
    ```
    psql -d news -f newsdata.sql
    ```
4. Run the psql command ```\dt``` to show the tables.
    ```
    news=> \dt
    ```
    Output:
    ```
            List of relations
    Schema |   Name   | Type  |  Owner  
    --------+----------+-------+---------
    public | articles | table | vagrant
    public | authors  | table | vagrant
    public | log      | table | vagrant
    (3 rows)
    ``` 


As shown above in step 4 the news database have 3 tables:
* articles
* authors
* log

## Running the Project

After the database setup it is time to run the tool by typing the following command.
```
python main_log.py
```

### Project output or report log output

After typing the command above and while the program runs it will generate the following result in the terminal.

```
1. What are the most popular three articles of all time? 

"Candidate is jerk, alleges rival" - 338647 views
"Bears love berries, alleges bear" - 253801 views
"Bad things gone, say good people" - 170098 views


2. Who are the most popular article authors of all time? 

"Ursula La Multa" - 507594 views
"Rudolf von Treppenwitz" - 423457 views
"Anonymous Contributor" - 170098 views
"Markoff Chaney" - 84557 views


3. On which days did more than 1% of requests lead to errors? 

July 17 2016 - 2.26%
```

### Coding Style

[PEP8](https://www.python.org/dev/peps/pep-0008/) is a helpful tool to check python coding style properly; however, there are other online alternatives such as [PEP8 online](http://pep8online.com/) or a plugin tool for your IDE (Microsoft Visual Studio Code, Brackets, Atom and others).


## Authors

* **Juan Carlo A. Banayo** 
*PC Tech and Udacity FSDN Student* - [FSDN Portfolio](https://github.com/johncban/Udacity)


## Acknowledgments

* Google
* Stack Overflow
* Mr. Evan, Udacity Mentor
