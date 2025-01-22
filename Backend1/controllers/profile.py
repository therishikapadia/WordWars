from flask import jsonify
from app import mongo
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def profile_section(current_user):
    try:
        user_data = mongo.db.users.find_one(
            {"username": current_user},
            {"password": 0}
        )

        if user_data:
            user_data["_id"] = str(user_data["_id"])
            return jsonify({
                "message": "Profile retrieved successfully",
                "user": user_data
            }), 200
        else:
            return jsonify({"message": "User not found"}), 404

    except Exception as e:
        logger.error(f"Error fetching profile: {e}")
        return jsonify({"message": "An error occurred while fetching profile"}), 500
    
def bar_graph(current_user):
    # Fetch games data for the current user only
    games = mongo.db.games.find({
        "players.user_id": current_user  # Filter games where the user is a player
    })

    wpm_by_day = {}  # Use a normal dictionary to store WPM data by day

    for game in games:
        for player in game['players']:
            # Ensure we only process data for the current user
            if player['user_id'] == current_user:
                finished_at = datetime.fromisoformat(player['finished_at'])
                day = finished_at.strftime('%Y-%m-%d')  # Extract the day in 'YYYY-MM-DD' format

                # Check if the day already exists in the dictionary
                if day not in wpm_by_day:
                    wpm_by_day[day] = []  # Initialize an empty list for the day

                # Append the WPM to the list for that day
                wpm_by_day[day].append(player['wpm'])

    # Calculate average WPM per day
    avg_wpm_by_day = {}
    for day, wpms in wpm_by_day.items():
        avg_wpm_by_day[day] = sum(wpms) / len(wpms)  # Calculate average

    return jsonify(avg_wpm_by_day)