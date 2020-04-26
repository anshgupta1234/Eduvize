from . import db, login_manager
from flask_login import login_user, logout_user, login_required, current_user
import json
from flask import (
    Blueprint, abort, render_template, request, url_for, redirect, jsonify
)
from .models import User
from flask_mongoengine import DoesNotExist
from flask_cors import CORS

bp = Blueprint('auth', __name__, url_prefix='/auth')
CORS(bp)


@bp.route('/register/', methods=['POST'])
def register():
    request_json = request.get_json()
    try:
        email = request_json['email']
        pw = request_json['password']
        display_name = request_json['display_name']
    except KeyError:
        abort(400)
    try:
        existing_user = User.objects.get(email=request_json['email'])
        print(existing_user)
        return jsonify({"success": False, "cause": "user exists"})
    except DoesNotExist:
        print('creating user')
        new_user = User(email=request_json['email'], display_name=display_name)
        new_user.set_password(request_json['password'])
        new_user.save()
        login_user(new_user)
        return jsonify({"success": True})


@bp.route('/login/', methods=['POST'])
def login():
    request_json = request.get_json()
    try:
        existing_user = User.objects.get(email=request_json['email'])
        if existing_user.check_password(request_json['password']):
            login_user(existing_user)
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "cause": "bad password"})
    except DoesNotExist:
        return jsonify({"success": False, "cause": "bad email"})


@bp.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"success": True})


@bp.route('/web_profile/')
@login_required
def web_profile():
    return current_user.email
