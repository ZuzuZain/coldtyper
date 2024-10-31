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

-- Create sequences for ID generation
CREATE SEQUENCE IF NOT EXISTS users_id_seq;
CREATE SEQUENCE IF NOT EXISTS user_statistics_id_seq;

CREATE TABLE IF NOT EXISTS public.user_statistics
(
    id integer NOT NULL DEFAULT nextval('user_statistics_id_seq'::regclass),
    fastest_wpm double precision NOT NULL,
    highest_accuracy double precision NOT NULL,
    total_tests integer NOT NULL DEFAULT 0,
    CONSTRAINT user_statistics_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    first_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    username character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_username_key UNIQUE (username)
);