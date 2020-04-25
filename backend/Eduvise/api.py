import json
from .khan_api import KhanAcademySignIn, KhanAPI
from flask import (
    Blueprint, render_template, request, url_for, redirect
)
from flask_cors import CORS
import requests
from .connected_apis import khanUpdate, duolingoUpdate, nitroUpdate, nitroSearch, caUpdate, caLink

from .pymongo_db import DataBase

from flask_login import current_user

bp = Blueprint('api', __name__, url_prefix='/api')
CORS(bp)

@bp.route('/ka')
def oauth_authorize():
    uid = current_user.id # this is a placeholder, that will be a cookie
    oauth = KhanAcademySignIn()
    request_token, request_token_secret, url = oauth.authorize()
    # add request tokens to db for specific user if cookies dont work for callback properly
    # DataBase(uid).updateMany({"kart": request_token, "karts": request_token_secret})
    return redirect(url)

@bp.route("/oauth_callback")
def oauth_callback():
    uid = current_user.id # this is a placeholder, that will be a cookie. 
    # if this doesnt work on callback we will nee line 21 uncommented and to add function here to search
    # for user with matching kart and karts
    oauth = KhanAcademySignIn()
    access_token, access_token_secret, request_token, request_token_secret = oauth.callback()
    DataBase(uid).updateMany({"kaat": access_token, "kaats": access_token_secret})
    # save access_token and access_token_secret to db field with mathing request token and request token secret
    nickname, points = khanUpdate(access_token, access_token_secret)
    return "Account {} is now connected! You have added {} points to your Eduvise account!".format(nickname, points)

@bp.route("/update")
def update():
    uid = current_user.id # this is a placeholder, that will be a cookie
    # TODO: only make function calls to update APIs if the data needed for the API exists in their account
    # TODO: return not only points but a list of all APIs used in their account

    db = DataBase(uid)
    point_dict = {}

    try:
        access_token = db.search("kaat")
        access_token_secret = db.search("kaats")
        nickname, kapoints = khanUpdate(access_token, access_token_secret)
        point_dict["Khan Academy"] = kapoints
    except:
        kapoints = 0

    try:
        username = db.search("dun")
        dpoints, language = duolingoUpdate(username)
        db.updateOne("language", language)
        point_dict["Duolingo"] = dpoints
    except:
        dpoints = 0
    
    try:
        ntid = db.search("ntid")
        ntpoints = nitroUpdate(ntid)
        point_dict["Nitrotype"] = ntpoints * 100
    except:
        ntpoints = 0
    
    try:
        caun = db.search("caun")
        capoints = caUpdate(caun)
        point_dict["Codeacademy"] = capoints * 10
    except:
        capoints = 0

    eduvise_points = dpoints + kapoints + ntpoints + capoints
    point_dict["Total Points"] = eduvise_points
    db.updateMany(point_dict)

    return json.dumps(point_dict)

@bp.route("/duolingo", methods=("POST", "GET"))
def duolingo():
    if request.method == 'GET':
        return redirect("https://www.duolingo.com/o/zxvxbm")
    elif request.method == 'POST':
        username = request.get_json()["username"]
        uid = current_user.id # this is a placeholder, that will be a cookie
        DataBase(uid).updateOne("dun", username)
        return "ok send to this url as a get request in browser now"

@bp.route("/nt", methods=("POST", "GET"))
def nitrotype():
    if request.method == "GET":
        q = request.args.get('q')
        return nitroSearch(q)
    elif request.method == "POST":
        uid = current_user.id # this is a placeholder, that will be a cookie
        ntid = request.get_json()["accountId"]
        DataBase(uid).updateOne("ntid", ntid)
        return "Account now linked!"

@bp.route("/ca")
def codeacademy():
    uid = current_user.id # this is a placeholder, that will be a cookie
    username = request.args.get('username')
    if caLink(username) == 404:
        return "Username not found. Try another one."
    else:
        DataBase(uid).updateOne("caun", username)
        return "Thank you. Your account has been linked."