from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.profile import profile_section, bar_graph


# Blueprint definition
profile = Blueprint('profile', __name__)

@profile.route('/data', methods=['GET'])
@jwt_required()
def profile_route():
    current_user = get_jwt_identity()
    return profile_section(current_user)


@profile.route('/wpm-over-time', methods=['GET'])
@jwt_required()  # Protect the endpoint with JWT authentication
def get_wpm_over_time():
    current_user = get_jwt_identity()
    return bar_graph(current_user)
    