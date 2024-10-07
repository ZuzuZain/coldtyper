from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config
from flask_bcrypt import Bcrypt
from flask_cors import CORS  # allows Cross-Origin Resourse Sharing
from config import config
from flask_migrate import Migrate

db = SQLAlchemy()  # allows access and management of the SQL db in Python
migrate = Migrate()
bcrypt = Bcrypt()  # password hashing


def create_app(config_name="default"):
    app = Flask(__name__, static_folder="static/react_build", static_url_path="/")
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    CORS(app)

    from app.routes import main as main_blueprint

    app.register_blueprint(main_blueprint)

    return app
