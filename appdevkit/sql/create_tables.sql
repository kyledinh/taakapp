CREATE TABLE tasks (
    id SERIAL NOT NULL,
    user_id INTEGER,
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

