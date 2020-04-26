import numpy as np
from sklearn.preprocessing import label_binarize
from .models import User
from flask_login import current_user

def get_badges(user):
    label_binarize(user.badges)