#!/usr/bin/python
# -*- coding: utf-8 -*-

import psycopg2

DBNAME = 'news'


def exe_query(qry):
    """Start Database Connection"""

    try:
        dat = psycopg2.connect(database=DBNAME)
        cur = dat.cursor()
        cur.execute(qry)
        results = cur.fetchall()
    except (Exception, psycopg2.DatabaseError), error:
        print error
    finally:
        dat.close()
        return results


q1 = '1. What are the most popular three articles of all time? \n'
"""Query the most popular three articles"""
queryOne = \
    """
              SELECT title, count(*)
              FROM log, articles
              WHERE log.path = concat('/article/', articles.slug)
              GROUP BY articles.id
              ORDER BY count
              DESC
              LIMIT 3;
           """

q2 = '2. Who are the most popular article authors of all time? \n'
"""Query the most popular article authors"""
queryTwo = \
    """
              SELECT name, count(*)
              FROM log, articles, authors
              WHERE log.path = concat('/article/', articles.slug)
              AND author = authors.id
              GROUP BY name
              ORDER BY count DESC;
           """

q3 = '3. On which days did more than 1% of requests lead to errors? \n'
"""Query the date and percentage of request errors"""
queryThree = \
    """
              SELECT * FROM (SELECT a.err_date,
              ROUND(CAST((100*b.errs) as numeric)/
              CAST(a.errs as numeric), 2)
              AS roundoff_error
              FROM
              (SELECT DATE(time)
              AS err_date, COUNT(*)
              AS errs FROM log
              GROUP BY err_date)
              AS a
              INNER JOIN
              (SELECT DATE(time)
              AS err_date, COUNT(*)
              AS errs FROM log
              WHERE status
              LIKE '%404%' GROUP BY err_date) AS b
              ON a.err_date = b.err_date)
              AS t_days WHERE roundoff_error > 1.0;
             """


def pop_articles():
    """Run Question 1 Query"""

    return exe_query(queryOne)


def pop_author():
    """Run Question 2 Query"""

    return exe_query(queryTwo)


def error_percentage():
    """Run Question 3 Query"""

    return exe_query(queryThree)


def print_log(questionLog, resultLog):
    """Print log questions then log answers"""

    print questionLog
    for (name, views) in resultLog:
        print '"{}" - {} views'.format(name, views)
    print '\n'


def print_error(days):
    """Print the error log dates then log error percentage"""

    print q3
    for (date, error_rate) in days:
        print '{:%B %d %Y} - {:0.2f}%'.format(date, error_rate)


if __name__ == '__main__':
    print_log(q1, pop_articles())
    print_log(q2, pop_author())
    print_error(error_percentage())
