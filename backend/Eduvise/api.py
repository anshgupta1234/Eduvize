import json
from khan_api import KhanAcademySignIn, KhanAPI
from flask import (
    Blueprint, render_template, request, url_for, redirect
)
from flask_cors import CORS
bp = Blueprint('api', __name__, url_prefix='/api')
CORS(bp)

@bp.route('/ka')
def oauth_authorize():
    oauth = KhanAcademySignIn()
    request_token, request_token_secret, url = oauth.authorize()
    # add request tokens to db for specific user
    return redirect(url)

@bp.route("/oauth_callback")
def oauth_callback():
    oauth = KhanAcademySignIn()
    access_token, access_token_secret, request_token, request_token_secret = oauth.callback()
    # save access_token and access_token_secret to db field with mathing request token and request token secret
    kapi = KhanAPI(access_token, access_token_secret, "/api/internal/user")
    kaid = kapi.user()["kaid"]
    profile = KhanAPI(access_token, access_token_secret, "/api/internal/user/profile")
    person = profile.user({"kaid": kaid})
    nickname = person["nickname"]
    videos = person["countVideosCompleted"]
    badges = person["badgeCounts"]
    date_joined = person["dateJoined"]
    ka_email = person["email"]
    points = person["points"]
    latest = person["streakLastExtended"]
    last_streak_length = person["streakLastLength"]
    streak_length = person["streakLength"]
    coaches = KhanAPI(access_token, access_token_secret, "/api/internal/user/coaches")
    teachers = coaches.user({"kaid": kaid})
    teacher_names = []
    for name in teachers:
        teacher_names.append(name["nickname"])
    # add all that crap to db
    return "Account {} is now connected! You have added {} points to your Eduvise account!".format(nickname, points)
