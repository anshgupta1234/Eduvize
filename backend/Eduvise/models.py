from flask_login import UserMixin
from . import db, login_manager
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin, db.Document):
    email = db.StringField(max_length=50, unique=True)
    password = db.StringField()
    display_name = db.StringField()
    nitrotype_id = db.StringField()
    khan_token = db.StringField()
    khan_secret = db.StringField()
    points = db.IntField(default=0)
    total_points = db.IntField(default=0)

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
    return User.objects.get(id=user_id)
