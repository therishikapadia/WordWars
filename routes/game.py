from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import logging
from bson.objectid import ObjectId
from datetime import datetime
from app import mongo

# Blueprint definition
game = Blueprint('game', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@game.route('/game/create', methods=['POST'])
@jwt_required()
def create_game():
    try:
        # Get game type and difficulty from request
        game_type = request.json.get('type')
        difficulty = request.json.get('difficulty')

        # Validate input
        if not game_type or not difficulty:
            return jsonify({"message": "Game type and difficulty are required"}), 400

        # Fetch a random text based on difficulty
        text_data = mongo.db.texts.aggregate([
            {"$match": {"difficulty": difficulty}},
            {"$sample": {"size": 1}}
        ]).next()

        # Get the current user's identity from the JWT token
        current_user = get_jwt_identity()

        # Create a new game session
        game_id = mongo.db.games.insert_one({
            "type": game_type,
            "text": text_data["content"],
            "difficulty": difficulty,
            "players": [{
                "user_id": ObjectId(current_user),
                "wpm": 0,
                "accuracy": 0,
                "finished_at": None
            }],
            "status": "waiting",
            "started_at": None,
            "ended_at": None,
            "created_at": datetime.utcnow()
        }).inserted_id

        return jsonify({
            "message": "Game session created successfully",
            "game_id": str(game_id),
            "text": text_data["content"]
        }), 201

    except Exception as e:
        logger.error(f"Error creating game session: {e}")
        return jsonify({"message": "An error occurred while creating the game session"}), 500