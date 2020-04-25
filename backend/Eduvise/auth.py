from . import db, login_manager
from flask_login import login_user, login_required, current_user
import json
from flask import (
    Blueprint, abort, render_template, request, url_for, redirect
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
    except KeyError:
        abort(400)
    try:   
        existing_user = User.objects.get(email=request_json['email'])
        print(existing_user)
        return 'user exists'
    except DoesNotExist:
        print('creating user')
        new_user = User(email=request_json['email'])
        new_user.set_password(request_json['password'])
        new_user.save()
        login_user(new_user)
        return 'user created'

@bp.route('/login/', methods=['POST'])
def login():
    request_json = request.get_json()
    try:   
        existing_user = User.objects.get(email=request_json['email'])
        if existing_user.check_password(request_json['password']):
            login_user(existing_user)
            return 'user logged in'
        else:
            return 'bad password'
    except DoesNotExist:
        return 'user does not exist'  

@bp.route('/web_profile/')
@login_required
def web_profile():
    return current_user.email