""" 
Contains models that represent the structure of the DB Table and
give an interface to work with the data

DATABASE:
- import db is an SQLAlchemy instance to do database operations

PASSWORD HASHING ALGORITHMS:
- bcrypt (current in this file): computationally expensive
- Argon2: newest and designed to be memory-hard
- Scrypt: computationally expensive, normally used with other algorithms  
"""

from app import db, bcrypt
from datetime import datetime

"""
USER MODEL: (SKELETON)
   - id: will be our way of uniquely identify users
   - password_hash: stores the HASHED password into our db
   - tests: works with TestResult model and gives us access to user's results
   - set_password: hashes password then stores it
   - check_password: verifies if entered password matches stored hashed password  
"""


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    tests = db.relationship("TestResult", backref="user", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


"""
RESULTS OF TYPING TEST: (SKELETON)
- db.Model represents this class as a table in our db
- db.Column() let's SQLAlchemy know how to create and/or interact with 
"""


class TestResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    wpm = db.Column(db.Float, nullable=False)
    accuracy = db.Column(db.Float, nullable=False)
    text_hash = db.Column(db.String(64), nullable=False)  # Hash of the generated text
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<TestResult {self.id} - User {self.user_id} - WPM {self.wpm}>"
