from flask import Blueprint,jsonify
from flask_jwt_extended import get_jwt_identity
from controllers.leaderboard import get_leaderboard,get_user_stats
from flask import Blueprint

# Blueprint definition
leaderboard = Blueprint('leaderboard', __name__)


@leaderboard.route('/top10', methods=['GET'])
def get_leaderboard_data():
    leaderboard = get_leaderboard()
    return jsonify(leaderboard)


@leaderboard.route('/<user_id>', methods=['GET'])
def myLeaderboad(user_id):
    return get_user_stats(user_id)