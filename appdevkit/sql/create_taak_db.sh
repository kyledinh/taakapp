#!/bin/sh
echo "create taakapp user"
sudo psql -h localhost -u postgres createuser \
    --no-superuser \
    --no-createdb \
    --no-createrole \
    --pwprompt \
    taakapp 

echo "create taak-app database"
sudo psql -h localhost -u postgres createdb --owner taakapp taakapp

echo "create tables"
psql taak-app taak-app -h localhost <<EndCreateTables

CREATE TABLE tasks (
    id SERIAL NOT NULL,
    user_id VARCHAR(10),
    google_id VARCHAR(20),
    task_title VARCHAR(40),
    task_type VARCHAR(40),
    task_desc VARCHAR(400),
    task_status VARCHAR(40),
    date_created timestamp,
    date_due timestamp,
    date_completed timestamp,
    active BOOLEAN default 't'
);

CREATE TABLE users (
    id SERIAL NOT NULL,
    user_name VARCHAR(60),
    user_email VARCHAR(60),
    active BOOLEAN default 't'
);

EndCreateTables


