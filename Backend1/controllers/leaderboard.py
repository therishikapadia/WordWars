from flask import jsonify
from app import mongo
import logging

# logger = logging.getLogger(__name__) 

def get_leaderboard():
    try:
        logger.info("Fetching leaderboard data from MongoDB...")
        users = mongo.db.users.find({}, {
            'username': 1,
            'stats.overall.tests_completed': 1,
            'stats.overall.average_wpm': 1,
            'stats.overall.overall_accuracy': 1,
            'stats.overall.all_time_best': 1
        }).sort('stats.overall.average_wpm', -1).limit(10)

        # Print users for debugging
        logger.debug("Printing users from MongoDB cursor:")
        for user in users:
            logger.debug(user)  # Print each user document

        # Reset the cursor (if needed)
        users.rewind()

        leaderboard = []
        for user in users:
            leaderboard.append({
                'username': user['username'],
                'tests_completed': user['stats']['overall']['tests_completed'],
                'average_wpm': user['stats']['overall']['average_wpm'],
                'overall_accuracy': user['stats']['overall']['overall_accuracy'],
                'all_time_best': user['stats']['overall']['all_time_best']
            })

        logger.info("Leaderboard data fetched successfully.")
        return leaderboard
    except KeyError as e:
        logger.error(f"Missing required field in user document: {e}", exc_info=True)
        return []
    except Exception as e:
        logger.error(f"An error occurred: {e}", exc_info=True)
        return []
    


def get_user_stats(user_id):
    try:
        user = mongo.db.users.find_one({"username": user_id})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_stats = {
            'username': user['username'],
            'stats': user['stats']
        }
        
        return jsonify(user_stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500