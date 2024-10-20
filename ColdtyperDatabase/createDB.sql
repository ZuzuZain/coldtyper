-- Database: coldtyper_db

-- DROP DATABASE IF EXISTS coldtyper_db;

CREATE DATABASE coldtyper_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE coldtyper_db
    IS 'The database for the typing test web application, Coldtyper';

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id SERIAL PRIMARY KEY, -- Change to SERIAL for auto-increment
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER TO postgres;

-- Table: public.user_statistics

-- DROP TABLE IF EXISTS public.user_statistics;

CREATE TABLE IF NOT EXISTS public.user_statistics
(
    id SERIAL PRIMARY KEY, -- Change to SERIAL for auto-increment
    user_id INTEGER REFERENCES public.users(id),
    fastest_wpm DOUBLE PRECISION NOT NULL,
    highest_accuracy DOUBLE PRECISION NOT NULL,
    total_tests INTEGER NOT NULL DEFAULT 0
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_statistics
    OWNER TO postgres;

-- Insert test users
INSERT INTO public.users (first_name, last_name, username, email, password) VALUES 
('test', 'tester', 'test', 'tester@gmail.com', 'testing');

-- Insert statistics for the test user
INSERT INTO public.user_statistics (user_id, fastest_wpm, highest_accuracy, total_tests) VALUES 
(1, 75.5, 95.0, 10);