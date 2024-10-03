# define the URL routes and 
# the view functions that handle requests to these routes

from flask import request, jsonify
from app import app, db
from app.models import User
import jwt #JSON Web Token generation and verification
from datetime import datetime, timedelta

# USER REGISTRATION - expects JSON data with 'username' and 'password'
app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

# USER LOGIN - handles POST registration requests to /login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        return jsonify({'token': token})
    return jsonify({'message': 'Invalid username or password'}), 401

# PROTECTED ROUTE
@app.route('/protected')
def protected():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        current_user = User.query.get(data['user_id'])
        return jsonify({'message': f'Hello, {current_user.username}!'}), 200
    except:
        return jsonify({'message': 'Token is invalid'}), 401

