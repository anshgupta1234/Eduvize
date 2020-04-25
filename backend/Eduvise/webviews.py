from flask import (
    Blueprint, render_template, url_for
)
bp = Blueprint('webviews', __name__)

@bp.route('/')
def index():
    return render_template("index.html")
