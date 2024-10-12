from dotenv import load_dotenv

load_dotenv()  # env variables loaded at the beginning of app execution

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from config import config
import os


db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()

from config import get_config


def create_app(config_name="default"):
    app = Flask(__name__)  # need static path here
    app.config.from_object(get_config(config_name))

    # init Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    CORS(app)

    # register Blueprint after configuration is complete
    from app.routes import main as main_blueprint

    app.register_blueprint(main_blueprint)

    return app  # return the configure app
