""" 
Contains models that define the database structure
   - Allows us to create, modify, and interact with the db in general
   - Database relationships are defined here
   - handling the database is done through these models using
     SQLAlchemy (db: an ORM library)
"""

from app import db, bcrypt
from datetime import datetime


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

    def __repr__(self):
        return f"<User {self.id}: {self.username}>"


class TestResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    wpm = db.Column(db.Float, nullable=False)
    accuracy = db.Column(db.Float, nullable=False)
    round_length = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<TestResult {self.id} - User {self.user_id} - WPM {self.wpm}>"


"""
class GeneratedWords(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    round_length = db.Column(db.Integer, nullable=False)
    words = db.Column(db.String(256))  # is 256 enough of should be use max?
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
"""
