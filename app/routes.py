from flask import Blueprint, request, jsonify, current_app
from app import db, bcrypt
from app.models import User, TestResult  # possibly add GeneratedWords from models.py
import jwt
from datetime import datetime, timedelta
from functools import wraps
from app.schemas import UserSchema, TokenSchema, TestResultSchema, LoginSchema
from marshmallow import ValidationError


main = Blueprint("main", __name__)


def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]  # ["bearer","token"]

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
        # validate and deserialize (load)
        data = user_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    # check if user already exists
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "username already exists"}), 409

    # create new user
    new_user = User(username=data["username"])
    new_user.set_password(data["password"])

    try:  # add to database
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"error creating new user: {str(e)}")
        return jsonify({"message": "an error occurred. Please try again."}), 500

    return jsonify(user_schema.dump(new_user)), 201


@main.route("/login", methods=["POST"])
def login():
    login_schema = LoginSchema()
    token_schema = TokenSchema()

    try:
        # validate & deserialize (load)
        data = login_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    user = User.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        expiration = datetime.utcnow() + timedelta(hours=24)
        token = jwt.encode(
            {"user_id": user.id, "exp": expiration},
            current_app.config["SECRET_KEY"],
            algorithm="HS256",
        )

        # serialize & return token
        return (
            jsonify(token_schema.dump({"token": token, "expires_at": expiration})),
            200,
        )

    return jsonify({"message": "invalid username and/or password"}), 401

@main.route("/protected")
@token_required
def protected():
    return jsonify({"message": f"hi {request.current_user.username}!"}), 200


@main.route("/submit_test", methods=["POST"])
@token_required
def submit_test():
    test_result_schema = TestResultSchema()

    try:
        # validate & deserialize input (load)
        data = test_result_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    # create new test result
    new_result = TestResult(
        user_id=request.current_user.id,
        wpm=data["wpm"],
        accuracy=data["accuracy"],
        round_length=data["round_length"],
    )

    # add to db
    db.session.add(new_result)
    db.session.commit()

    # serialize & return token (dump)
    return jsonify(test_result_schema.dump(new_result)), 201


@main.route("/view/users")
def view_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "username": user.username} for user in users])


@main.route("/view/test_results")
def view_test_results():
    results = TestResult.query.all()
    return jsonify(
        [
            {
                "id": result.id,
                "user_id": result.user_id,
                "wpm": result.wpm,
                "accuracy": result.accuracy,
            }
            for result in results
        ]
    )
