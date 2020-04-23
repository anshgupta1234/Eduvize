import json
from khan_api import KhanAcademySignIn, KhanAPI
from flask import (
    Blueprint, render_template, request, url_for, redirect
)
from flask_cors import CORS
import requests
from connected_apis import khanUpdate, duolingoUpdate
bp = Blueprint('api', __name__, url_prefix='/api')
CORS(bp)

@bp.route('/ka')
def oauth_authorize():
    # accept some sort of userId from eduvise
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
    # get eduvise userId thing and query the needed api tokens for stuff
    access_token = "t6564182086795264" # this is my personal temp token
    access_token_secret = "shyNWuxVazvXZMWP" # this is my personal temp secret token plz no steal
    username = 'EricAndrechek' # my personal duolingo username but pull from db in actual usage
    nickname, points = khanUpdate(access_token, access_token_secret)
    dpoints = duolingoUpdate(username)
    eduvise_points = dpoints + points
    return str(eduvise_points)

@bp.route("/duolingo", methods=("POST", "GET"))
def duolingo():
    if request.method == 'GET':
        return redirect("https://www.duolingo.com/o/zxvxbm")
    elif request.method == 'POST':
        # get eduvise userId and the duolingo username then redirect them to join the class
        return "ok send to this url as a get request in browser now"
