from flask import jsonify
from app import mongo
from datetime import datetime
import logging
from bson import ObjectId
from utils.fake_data import generate_sample_text

logger = logging.getLogger(__name__)


def start_game(username_or_email, mode, word_count=None, time_duration=None,time_taken=None):
    try:
        if mode not in ["words", "time"] or \
           (mode == "words" and word_count not in [15, 30, 45]) or \
           (mode == "time" and time_duration not in [15, 30, 60]):
            return jsonify({"message": "Invalid input"}), 400

        user = mongo.db.users.find_one({"$or": [{"username": username_or_email}, {"email": username_or_email}]})
        if not user:
            return jsonify({"message": "User not found"}), 404

        text = generate_sample_text(word_count) if mode == "words" else generate_sample_text(45)

        game_data = {
            "type": "singleplayer",
            "mode": mode,
            "players": [{
                "user_id": user["_id"],
                "wpm": 0,
                "accuracy": 0.0,
                # "finished_at": None
            }],
            "started_at": datetime.utcnow(),
            # "ended_at": None,
            # "word_count": word_count if mode == "words" else None, 
            # "time_duration": time_duration if mode == "time" else None,
            # "time_taken": None
        }

        if game_data["mode"] == "time":
            game_data["time_duration"] = time_duration
        elif game_data["mode"] == "words" and word_count is not None:
            game_data["word_count"] = word_count
        elif game_data["mode"] == "words" and time_taken is not None:
            game_data["time_taken"] = time_taken

        game_id = str(mongo.db.games.insert_one(game_data).inserted_id)
        return jsonify({"message": "Game started successfully", "game_id": game_id, "text": text}), 200

    except Exception as e:
        return jsonify({"message": "An error occurred while starting the game"}), 500

def end_game(game_id, user_id, wpm, accuracy, time_taken=None):
    try:
        # Validate game_id and user_id
        if not (ObjectId.is_valid(game_id) and ObjectId.is_valid(user_id)):
            return jsonify({"message": "Invalid game_id or user_id"}), 400

        game_id, user_id = ObjectId(game_id), ObjectId(user_id)

        # Update game document
        update_data = {
            "players.$.wpm": wpm,
            "players.$.accuracy": accuracy,
            "players.$.finished_at": datetime.now(),
            "ended_at": datetime.now()
        }
        if time_taken is not None:
            update_data["players.$.time_taken"] = time_taken

        update_result = mongo.db.games.update_one(
            {"_id": game_id, "players.user_id": user_id},
            {"$set": update_data}
        )

        if not update_result.matched_count:
            return jsonify({"message": "Game or player not found"}), 404

        # Fetch game and user
        game = mongo.db.games.find_one({"_id": game_id})
        user = mongo.db.users.find_one({"_id": user_id})
        
        if not game or not user:
            return jsonify({"message": "Game or user not found"}), 404

        # Update user statistics
        stats = user["stats"]["overall"]
        total_tests = stats["tests_completed"] + 1
        new_avg_wpm = (stats["average_wpm"] * stats["tests_completed"] + wpm) / total_tests
        new_avg_accuracy = (stats["overall_accuracy"] * stats["tests_completed"] + accuracy) / total_tests

        all_time_best = stats["all_time_best"]
        if game["mode"] == "time" and wpm > all_time_best["time_mode"]["wpm"]:
            all_time_best["time_mode"] = {"wpm": wpm, "seconds": game["time_duration"]}
        elif game["mode"] == "words" and wpm > all_time_best["words_mode"]["wpm"]:
            all_time_best["words_mode"]["wpm"] = wpm

        # Prepare test_history entry
        test_history_entry = {
            "mode": game["mode"],
            "wpm": wpm,
            "accuracy": accuracy,
            "timestamp": datetime.now(),
            # "word_count": game.get("word_count")
        }
        if game["mode"] == "time":
            test_history_entry["time_duration"] = game.get("time_duration")
        elif game["mode"] == "words" and time_taken is not None:
            test_history_entry["word_count"] = game.get("word_count")
        elif game["mode"] == "words" and time_taken is not None:
            test_history_entry["time_taken"] = time_taken

        # Update user document
        mongo.db.users.update_one(
            {"_id": user_id},
            {
                "$inc": {"stats.overall.tests_completed": 1},
                "$set": {
                    "stats.overall.average_wpm": new_avg_wpm,
                    "stats.overall.overall_accuracy": new_avg_accuracy,
                    "stats.overall.all_time_best": all_time_best
                },
                "$push": {"stats.test_history": test_history_entry}
            }
        )

        return jsonify({"message": "Game ended successfully"}), 200

    except Exception as e:
        logger.error(f"An error occurred while ending the game: {str(e)}")
        return jsonify({"message": "An error occurred while ending the game"}), 500
    

def start_game_without_login(mode, word_count=None, time_duration=None):
    try:
        if mode not in ["words", "time"] or \
           (mode == "words" and word_count not in [15, 30, 45]) or \
           (mode == "time" and time_duration not in [15, 30, 60]):
            return jsonify({"message": "Invalid input"}), 400

        text = generate_sample_text(word_count) if mode == "words" else generate_sample_text(45)
        return jsonify({"message": "Game started successfully", "text": text}), 200

    except Exception as e:
        return jsonify({"message": "An error occurred while starting the game"}), 500