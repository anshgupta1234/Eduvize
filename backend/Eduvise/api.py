import json
from flask import (
    Blueprint, render_template, request, url_for
)
from flask_cors import CORS
bp = Blueprint('api', __name__, url_prefix='/api')
CORS(bp)

@bp.route('/example', methods=['POST'])
def recipe_info():
    request_json = request.get_json() 
    return request_json