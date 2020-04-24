import json
from khan_api import KhanAcademySignIn, KhanAPI
from flask import (
    Blueprint, render_template, request, url_for, redirect
)
from flask_cors import CORS
import requests
from connected_apis import khanUpdate, duolingoUpdate, nitroUpdate, nitroSearch
bp = Blueprint('api', __name__, url_prefix='/api')
CORS(bp)

@bp.route('/ka')
def oauth_authorize():
    # uid = request.args.get('userId')
    oauth = KhanAcademySignIn()
    request_token, request_token_secret, url = oauth.authorize()
    # add request tokens to db for specific user
    return redirect(url)

@bp.route("/oauth_callback")
def oauth_callback():
    oauth = KhanAcademySignIn()
    access_token, access_token_secret, request_token, request_token_secret = oauth.callback()
    # save access_token and access_token_secret to db field with mathing request token and request token secret
    nickname, points = khanUpdate(access_token, access_token_secret)
    return "Account {} is now connected! You have added {} points to your Eduvise account!".format(nickname, points)

@bp.route("/update")
def update():
    # uid = request.args.get('userId')
    # TODO: only make function calls to update APIs if the data needed for the API exists in their account
    # TODO: return not only points but a list of all APIs used in their account
    access_token = "t6564182086795264" # this is my personal temp token
    access_token_secret = "shyNWuxVazvXZMWP" # this is my personal temp secret token plz no steal
    username = 'EricAndrechek' # my personal duolingo username but pull from db in actual usage
    ntid = "39345240" # grab this from db
    nickname, points = khanUpdate(access_token, access_token_secret)
    dpoints = duolingoUpdate(username)
    ntpoints = nitroUpdate(ntid)
    eduvise_points = dpoints + points + (ntpoints * 100)
    return str(eduvise_points)

@bp.route("/duolingo", methods=("POST", "GET"))
def duolingo():
    if request.method == 'GET':
        return redirect("https://www.duolingo.com/o/zxvxbm")
    elif request.method == 'POST':
        # username = request.get_json()["username"]
        # uid = request.get_json()["userId"]
        return "ok send to this url as a get request in browser now"

@bp.route("/nt", methods=("POST", "GET"))
def nitrotype():
    q = request.args.get('q')
    if request.method == "GET":
        return nitroSearch(q)
    elif request.method == "POST":
        # uid = request.get_json()["userId"]
        ntid = request.get_json()["accountId"]
        return "Account now linked!"
