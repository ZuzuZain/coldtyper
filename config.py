""" 
this file holds our configuration variables
for the three different environments
"""

import os


# secret_key and database_url are in .env (in project root)
class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "insert-hard-to-guess-string"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DEV_DATABASE_URL") or "sqlite:///dev.db"


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or "sqlite:///prod.db"


config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,  # this will be used if no config selected
}


def get_config(config_name):
    config_class = config.get(config_name, config["default"])
    print(f"Using configuration: {config_class.__name__}")
    print(f"Database URI: {config_class.SQLALCHEMY_DATABASE_URI}")
    return config_class
