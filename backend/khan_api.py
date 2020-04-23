from rauth import OAuth1Service
import requests
from flask import url_for, request, redirect, session
from time import time
import json

# You can get a CONSUMER_KEY and CONSUMER_SECRET for your app here:
# http://www.khanacademy.org/api-apps/register
CONSUMER_KEY = "pjNzt4sQN9DCeb4N"
CONSUMER_SECRET = "N9X29EnHgHQsnZnw"

# Oauth configuration values described at:
# https://github.com/Khan/khan-api/wiki/Khan-Academy-API-Authentication
SERVER_URL = "https://www.khanacademy.org"
REQUEST_TOKEN_URL = SERVER_URL + "/api/auth2/request_token"
ACCESS_TOKEN_URL = SERVER_URL + "/api/auth2/access_token"
AUTHORIZE_URL = SERVER_URL + "/api/auth2/authorize"
BASE_URL = SERVER_URL + "/api/auth2"

# This is the class we will import into our server to provide the authentication
# flow
class KhanAcademySignIn:
    """
    The basic oauth flow will require two endpoints in the flask app:
    1. An authorize endpoint, like @app.route('/authorize'), where you will
       instantiate the class and call the authorize method. i.e:
       @app.route('/authorize')
       def authorize():
           oauth = KhanAcademySignIn()
           return oauth.authorize()
    2. A callback endpoint that you can use to store your token and secret:
       @app.route("/oauth_callback")
       def oauth_callback():
           oauth = KhanAcademySignIn()
           ka_user, access_token, access_token_secret = oauth.callback()
           ## Developer created function to store the tokens ##
           set_access_tokens(access_token, access_token_secret)
           return redirect(url_for("index"))
    """

    def __init__(self):
        self.service = OAuth1Service(
            name="Eduvise",
            consumer_key=CONSUMER_KEY,
            consumer_secret=CONSUMER_SECRET,
            request_token_url=REQUEST_TOKEN_URL,
            access_token_url=ACCESS_TOKEN_URL,
            authorize_url=AUTHORIZE_URL,
            base_url=BASE_URL,
        )

    # expects that you have defined an endpoint /oauth_callback in your
    # flask server. Usually this looks like:
    # @app.route("/oauth_callback")
    # def oauth_callback():
    #   ...
    def get_callback_url(self):
        return url_for("api.oauth_callback", _external=True)

    def authorize(self):
        request_token, request_token_secret = self.service.get_request_token(
            params={"oauth_callback": self.get_callback_url()}, method="POST"
        )
        session["request_token"] = request_token
        session["request_token_secret"] = request_token_secret
        return request_token, request_token_secret, self.service.get_authorize_url(request_token)

    def callback(self):
        request_token = session.pop("request_token")
        request_token_secret = session.pop("request_token_secret")

        if "oauth_verifier" not in request.args:
            return None, None, None
        oauth_session = self.service.get_auth_session(
            request_token,
            request_token_secret,
            data={"oauth_verifier": request.args["oauth_verifier"]},
        )
        access_token = oauth_session.access_token
        access_token_secret = oauth_session.access_token_secret
        return access_token, access_token_secret, request_token, request_token_secret


class KhanAPI:
    """
    Basic api class to access the Khan Academy api. If instantiated with a token
    and secret it will allow for authenticated endpoints. More endpoints could
    be added to align with those found at https://api-explorer.khanacademy.org/
    """

    def __init__(self, access_token, access_token_secret, data_url):
        self.authorized = False
        self.data_uri = data_url
        # We need an access token and secret to make authorized calls
        # Otherwise we can only access open endpoints
        if access_token and access_token_secret:
            self.service = OAuth1Service(
                name="khan_oauth",
                consumer_key=CONSUMER_KEY,
                consumer_secret=CONSUMER_SECRET,
                request_token_url=REQUEST_TOKEN_URL,
                access_token_url=ACCESS_TOKEN_URL,
                authorize_url=AUTHORIZE_URL,
                base_url=BASE_URL,
            )
            self.session = self.service.get_session(
                (access_token, access_token_secret)
            )
            self.authorized = True
        self.get_resource = self.get

    def get(self, url, params={}):
        if self.authorized:
            response = self.session.get(SERVER_URL + url, params=params)
            try:
                return response.json()
            except ValueError:
                # Checking if it was a server error, in which case we will let
                # the programmer deal with a workaround. Otherwise, print the
                # response details to the console for debugging.
                if response.status_code == 500:
                    print(
                        "500 error receieved. You should do something with it!"
                    )
                    return {"error": 500}
                print("#" * 50)
                print("Status Code: ", response.status_code)
                print("Content-Type: ", response.headers["content-type"])
                print("Text:")
                print(response.text)
                print("#" * 50)
                raise

        else:

            return requests.get(SERVER_URL + url, params=params).json()

    def user(self, identifier={}):
        """Retrieve data about a user. If no identifier is provided, it will
        return the authenticated user.
        :param: identifier, one of three identifiers:
          username, userid, email
        """
        return self.get_resource(self.data_uri, params=identifier)
