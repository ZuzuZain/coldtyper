""" 
Contains models that represent the structure of the DB table
  - db.Model 
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


class TestResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    wpm = db.Column(db.Float, nullable=False)
    accuracy = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<TestResult {self.id} - User {self.user_id} - WPM {self.wpm}>"


"""
model for storing our generated words. Unsure how to model this and will talk to the team
"""


class GeneratedWords(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    round_length = db.Column(db.Integer, nullable=False)
    words = db.Column(db.String(256))  # is 256 enough of should be use max?
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
