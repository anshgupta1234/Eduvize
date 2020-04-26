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
import json
from random import shuffle, sample

bp = Blueprint('explore', __name__, url_prefix='/explore')
CORS(bp)

N_CLUSTERS=3

with open("Eduvise/badges.json") as f:
    badge_data = json.load(f)["all_badges"]
    badge_classes = [badge['badge_name'] for badge in badge_data]
    badge_img_map = {badge['badge_name']:badge['badge_url'] for badge in badge_data}

BADGE_CLASSES = ["red", "green", "blue"]

def get_badges(user):
    if user.badge_names:
        return label_binarize(user.badge_names, classes=badge_classes)
    return []

def train_kmeans():
    raw_training_data = []
    user_stack = []
    for user in User.objects:
        raw_training_data.append(get_badges(user))
        user_stack.append(user)

    #Perform PCA - avoid curse of dimensionality
    print(raw_training_data)
    training_data = PCA().fit_transform(raw_training_data[0])

    kmeans = KMeans(n_clusters=N_CLUSTERS).fit(training_data)
    labels = kmeans.predict(training_data)
    for i in range(len(user_stack)):
        user_stack[i].user_type = labels[i]
        user_stack[i].save()

@bp.route('/train/')
def train():
    train_kmeans()
    return "ok"

@bp.route('/recommend/', methods=["POST"])
@login_required
def recommend():
    user_badges = set(current_user.badge_names)
    nearest_users = User.objects(user_type=current_user.user_type, pk__ne=current_user.pk)
    neighbors = list(nearest_users)
    shuffle(neighbors)
    badge_options = set()
    print(neighbors)
    for neighbor in neighbors:
        badge_options = badge_options.union(set(neighbor.badge_names) - user_badges)
    try:
        badge_recs = sample(badge_options, 3)
        badge_recs_img = {rec:badge_img_map[rec] for rec in badge_recs}
        return json.dumps(badge_recs_img)
    except:
        return jsonify({"success": False})