from flask import jsonify
from app import mongo
from datetime import datetime
import logging
from bson import ObjectId

logger = logging.getLogger(__name__)

def start_game(username_or_email, mode, word_count=None, time_duration=None):
    try:
        if mode not in ["words", "time"] or \
           (mode == "words" and word_count not in [15, 30, 45]) or \
           (mode == "time" and time_duration not in [15, 30, 60]):
            return jsonify({"message": "Invalid input"}), 400

        user = mongo.db.users.find_one({"$or": [{"username": username_or_email}, {"email": username_or_email}]})
        if not user:
            logger.error(f"User not found: {username_or_email}")
            return jsonify({"message": "User not found"}), 404

        game_data = {
            "type": "singleplayer",
            "mode": mode,
            "text": "This is a sample text for typing practice. Adjust it as needed.",
            "players": [{
                "user_id": user["_id"],
                "wpm": 0,
                "accuracy": 0.0,
                "finished_at": None
            }],
            "started_at": datetime.utcnow(),
            "ended_at": None,
            "word_count": word_count if mode == "words" else None,
            "time_duration": time_duration if mode == "time" else None
        }

        game_id = str(mongo.db.games.insert_one(game_data).inserted_id)
        return jsonify({"message": "Game started successfully", "game_id": game_id, "text": game_data["text"]}), 200

    except Exception as e:
        logger.error(f"Error starting game: {e}")
        return jsonify({"message": "An error occurred while starting the game"}), 500

def end_game(game_id, user_id, wpm, accuracy):
    try:
        try:
            game_id, user_id = ObjectId(game_id), ObjectId(user_id)
        except Exception as e:
            logger.error(f"Invalid game_id or user_id: {e}")
            return jsonify({"message": "Invalid game_id or user_id"}), 400

        update_result = mongo.db.games.update_one(
        {"_id": game_id, "players.user_id._id": user_id},
        {"$set": {
        "players.$.wpm": wpm,
        "players.$.accuracy": accuracy,
        "players.$.finished_at": datetime.utcnow(),
        "ended_at": datetime.utcnow()
        }}
)


        if not update_result.matched_count:
            logger.error(f"No matching game or player found for game_id: {game_id}, user_id: {user_id}")
            return jsonify({"message": "Game or player not found"}), 404

        game = mongo.db.games.find_one({"_id": game_id})
        user = mongo.db.users.find_one({"_id": user_id})
        if not game or not user:
            logger.error(f"Game or user not found: game_id={game_id}, user_id={user_id}")
            return jsonify({"message": "Game or user not found"}), 404

        stats = user["stats"]["overall"]
        total_tests = stats["tests_completed"] + 1
        new_avg_wpm = (stats["average_wpm"] * stats["tests_completed"] + wpm) / total_tests
        new_avg_accuracy = (stats["overall_accuracy"] * stats["tests_completed"] + accuracy) / total_tests

        all_time_best = stats["all_time_best"]
        if game["mode"] == "time" and wpm > all_time_best["time_mode"]["wpm"]:
            all_time_best["time_mode"] = {"wpm": wpm, "seconds": game["time_duration"]}
        elif game["mode"] == "words" and wpm > all_time_best["words_mode"]["wpm"]:
            all_time_best["words_mode"]["wpm"] = wpm

        mongo.db.users.update_one(
            {"_id": user_id},
            {"$inc": {"stats.overall.tests_completed": 1},
             "$set": {
                 "stats.overall.average_wpm": new_avg_wpm,
                 "stats.overall.overall_accuracy": new_avg_accuracy,
                 "stats.overall.all_time_best": all_time_best
             },
             "$push": {
                 "stats.test_history": {
                     "mode": game["mode"],
                     "wpm": wpm,
                     "accuracy": accuracy,
                     "timestamp": datetime.utcnow(),
                     "word_count": game.get("word_count"),
                     "time_duration": game.get("time_duration")
                 }
             }}
        )

        logger.info(f"Game {game_id} ended successfully for user {user_id}")
        return jsonify({"message": "Game ended successfully"}), 200

    except Exception as e:
        logger.error(f"Error ending game: {e}", exc_info=True)
        return jsonify({"message": "An error occurred while ending the game"}), 500
