""" 
SKELETON to manage settings across all environments
"""

import os
from dotenv import load_dotenv

load_dotenv()  # load environment variables from .env file


# we should move the secret key in the .env file (i believe) for security
class Config:
    SECRET_KEY = (
        os.environ.get(  # generated using 'openssl rand -base64 64'
            "c8TgJvWNQREt18pdzCM5deGFYfUCW8A4pX34pn8/RqPY"
            "pT4xn64AlgOYXsAXrhAopuCpURgoQ3qO63iBmUZ80Q=="
        )
        or "you-will-never-guess"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL") or "postgresql://zuzu@localhost/coldtyper"
    )

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("TEST_DATABASE_URL")
        or "postgresql://zuzu@localhost/coldtyper_test"
    )


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get("DATABASE_URL") or "postgresql://zuzu@localhost/coldtyper"
    )


config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
