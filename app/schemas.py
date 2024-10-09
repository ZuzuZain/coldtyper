"""
schemas.py will handle validation of given data 
so that we only take in data of the correct form
if there was a validation error, a validation error will be raised 
"""

from marshmallow import Schema, fields, validate, validates, ValidationError
from app.models import User


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    created_at = fields.DateTime(dump_only=True)

    @validates("username")
    def validate_username(self, value):
        if User.query.filter_by(username=value).first():
            raise ValidationError("Username already exists")

    class Meta:
        strict = True


class TokenSchema(Schema):
    token = fields.Str(required=True)
    expires_at = fields.DateTime(required=True)


class TestResultSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    wpm = fields.Float(required=True, validate=validate.Range(min=0))
    accuracy = fields.Float(required=True, validate=validate.Range(min=0, max=100))
    round_length = fields.Int(required=True, validate=validate.Range(min=1))
    created_at = fields.DateTime(dump_only=True)

    class Meta:
        strict = True
