from rauth import OAuth1Service
import requests
from flask import url_for, request, redirect, session
from time import time
import json

CONSUMER_KEY = "pjNzt4sQN9DCeb4N"
CONSUMER_SECRET = "N9X29EnHgHQsnZnw"

SERVER_URL = "https://www.khanacademy.org"
REQUEST_TOKEN_URL = SERVER_URL + "/api/auth2/request_token"
ACCESS_TOKEN_URL = SERVER_URL + "/api/auth2/access_token"
AUTHORIZE_URL = SERVER_URL + "/api/auth2/authorize"
BASE_URL = SERVER_URL + "/api/auth2"

class KhanAcademySignIn:
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
    
    def get_callback_url(self):
        return url_for("api.oauth_callback", _external=True)

    def authorize(self):
        request_token, request_token_secret = self.service.get_request_token(
            params={"oauth_callback": self.get_callback_url()}, method="POST"
        )
        session["request_token"] = request_token
        session["request_token_secret"] = request_token_secret
        return request_token, request_token_secret, self.service.get_authorize_url(request_token)

    def callback(self, request_token, request_token_secret):

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
    def __init__(self, access_token, access_token_secret, data_url):
        self.authorized = False
        self.data_uri = data_url
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
        return self.get_resource(self.data_uri, params=identifier)
