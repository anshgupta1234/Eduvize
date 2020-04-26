import numpy as np
from sklearn.preprocessing import label_binarize
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from .models import User
from flask import (
    Blueprint, abort, render_template, request, url_for, redirect, jsonify
)
from flask_login import current_user, login_required
from flask_cors import CORS

bp = Blueprint('explore', __name__, url_prefix='/explore')
CORS(bp)

N_CLUSTERS=3
BADGE_CLASSES = ["red", "green", "blue"]

def get_badges(user):
    label_binarize(user.badges, classes=BADGE_CLASSES)

def train_kmeans():
    raw_training_data = np.array([])
    user_stack = []
    for user in User.objects:
        raw_training_data.append(get_badges(user))
        user_stack.append(user)

    #Perform PCA - avoid curse of dimensionality
    training_data = PCA().fit_trainsform(raw_training_data)

    kmeans = KMeans(n_clusters=N_CLUSTERS).fit(training_data)
    labels = kmeans.predict(training_data)
    for i in range(len(user_stack)):
        user_stack[i].user_type = labels[i]

@bp.route('/train/')
def train():
    train_kmeans()
    return "ok"

@bp.route('/recommend/', methods=["POST"])
@login_required
def recommend():
    user_badges = set(current_user.badges)
