"""
this file holds the schema of User 
"""

from marshmallow import Schema, fields, validate, validates, ValidationError
from app.models import User


class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=64))
    password = fields.Str(
        required=True, validate=validate.Length(min=8), load_only=True
    )
    created_at = fields.DateTime(dump_only=True)

    @validates("username")
    def validate_username(self, value):
        if User.query.filter_by(username=value).first():
            raise ValidationError("username already exists")

    # catches and displays an error if fields entered were not as expected
    class Meta:
        strict = True
