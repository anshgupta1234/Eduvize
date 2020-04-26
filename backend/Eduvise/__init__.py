import os

from flask import Flask, render_template, send_from_directory
from flask_login import LoginManager
from flask_mongoengine import MongoEngine
from flask.json import JSONEncoder
from bson import json_util
db = MongoEngine()
login_manager = LoginManager()
from . import api, auth, models, webviews, explore

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj): return str(obj)

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.json_encoder = CustomJSONEncoder
    login_manager.init_app(app)
    with open("Eduvise/secrets.txt") as f:
        lines = f.readlines()   
        secret_key = lines[0].strip()
        mongo_pw = lines[1].strip()
    app.config.from_mapping(
        SECRET_KEY='secret_key',
        static_url_path='static/',
        MONGODB_HOST="mongodb+srv://admin:{}@eduvise-f0zco.gcp.mongodb.net/Eduvise?retryWrites=true&w=majority".format(mongo_pw)
    )
    db.init_app(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.register_blueprint(api.bp)
    app.register_blueprint(webviews.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(explore.bp)
    return app
