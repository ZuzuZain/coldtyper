from dotenv import load_dotenv

load_dotenv()  # env variables loaded at the beginning of app execution

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
import os
from config import Config


db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()


def create_app(config_name="development"):
    app = Flask(__name__)  # need static path here

    app.config.from_object(config[config_name])

    # init Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    CORS(app)

    # register Blueprint after configuration is complete
    from app.routes import main as main_blueprint

    app.register_blueprint(main_blueprint)

    return app  # return the configured app
