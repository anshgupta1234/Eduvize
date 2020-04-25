from flask_user import UserMixin
from . import db
class User(UserMixin, db.Document):
    meta = {'collection': '<---YOUR_COLLECTION_NAME--->'}
    email = db.StringField(max_length=30)
    password = db.StringField()
g