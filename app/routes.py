from flask import Blueprint, request, jsonify, current_app
from app import db, bcrypt
from app.models import User, TestResult
import jwt
from datetime import datetime, timedelta
from functools import wraps

main = Blueprint("main", __name__)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "token is missing"}), 401
        try:
            data = jwt.decode(
                token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
            )
            current_user = User.query.get(data["user_id"])
        except:
            return jsonify({"message": "token is invalid"}), 401
        return f(current_user, *args, **kwargs)

    return decorated


@main.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    # check if username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "uh oh :o that username already exists"}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "user created successfully"}), 201


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
def protected(current_user):
    return jsonify({"message": f"you look cool, {current_user.username}!"}), 200


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
    return jsonify({"message": "test result submitted successfully"}), 201
