from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.game.game_controller import start_game, end_game
from app import mongo

# Blueprint definition
game = Blueprint('game', __name__)

@game.route('/start', methods=['POST'])
@jwt_required()
def start_game_route():
    current_user = get_jwt_identity()
    mode = request.json.get('mode')
    word_count = request.json.get('word_count')
    time_duration = request.json.get('time_duration')
    return start_game(current_user, mode, word_count, time_duration)

@game.route('/end', methods=['POST'])
@jwt_required()
def end_game_route():
    current_user = get_jwt_identity() 
    game_id = request.json.get('game_id')
    wpm = request.json.get('wpm')
    accuracy = request.json.get('accuracy')
    time_taken =request.json.get('time_taken')
    print(time_taken)

    # Fetch user from the database using `current_user`
    user = mongo.db.users.find_one({"username": current_user})
    if not user:
        return jsonify({"message": "User not found"}), 404

    user_id = str(user["_id"])  # Convert the ObjectId to a string
    return end_game(game_id, user_id, wpm, accuracy,time_taken)
