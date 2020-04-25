from flask_login import UserMixin, user_loader
from . import db, login_manager
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Document):
    email = db.StringField(max_length=30, unique=True)
    password = db.StringField(True)
    points = db.IntField(default=0)
    first_name = db.StringField()
    last_name = db.StringField()

    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)

    #flask_login stuff
    def is_authenticated(self):
        return True 
    def is_active(self):
        return True
    def is_anonymous(self):
        return False
    def get_id(self):
        return self.id

@login_manager.user_loader
def load_user(user_id):
    return User.get(id=user_id)
