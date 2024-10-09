from flask import Blueprint, request, jsonify, current_app
from app import db, bcrypt
from app.models import User, TestResult
import jwt
from datetime import datetime, timedelta
from functools import wraps
from app.schemas import UserSchema
from marshmallow import ValidationError


main = Blueprint("main", __name__)


def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]

        if not token:
            return jsonify({"message": "token missing"}), 401

        try:
            data = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"message": "user not found"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "invalid token"}), 401

        # add user to the request
        request.current_user = current_user
        return func(*args, **kwargs)

    return decorated


@main.route("/register", methods=["POST"])
def register():
    user_schema = UserSchema()
    try:
        data = user_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_user = User(username=data["username"])
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify(user_schema.dump(new_user)), 201


@main.route("/login", methods=["POST"])
def login():
    # get JSON data from the request
    data = request.get_json()
    # check if user exists and verify password entered
    user = User.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        token = jwt.encode(
            {"user_id": user.id, "exp": datetime.utcnow() + timedelta(hours=24)},
            current_app.config["SECRET_KEY"],
        )
        return jsonify({"token": token})
        return jsonify({"message": "invalid username or password"}), 401


@main.route("/protected")
@token_required
def protected():
    return jsonify({"message": f"hi {request.current_user.username}!"}), 200


@main.route("/submit_test", methods=["POST"])
@token_required
def results(current_user):
    data = request.get_json()
    new_result = results(
        user_id=current_user.id,
        wpm=data["wpm"],
        accuracy=data["accuracy"],
        round_length=data["round_length"],
    )
    db.session.add(new_result)
    db.session.commit()
    return jsonify({"message": "test result submitted"}), 201
