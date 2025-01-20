from flask import jsonify
from app import bcrypt, mongo
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def login(username_or_email, password):
    try:
        if not username_or_email or not password:
            return jsonify({"message": "Username/email and password are required"}), 400

        user_data = mongo.db.users.find_one({
            "$or": [
                {"username": username_or_email},
                {"email": username_or_email}
            ]
        })

        if user_data and bcrypt.check_password_hash(user_data['password'], password):
            from flask_jwt_extended import create_access_token
            access_token = create_access_token(identity=user_data['username'])
            return jsonify({
                "message": "Login successful",
                "access_token": access_token,
                "username": user_data['username'],
                "email": user_data['email'],
                "stats": user_data.get('stats', {})
            }), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify({"message": "An error occurred during login"}), 500


def register(username, email, password):
    try:
        if not username or not email or not password:
            return jsonify({"message": "Username, email, and password are required"}), 400

        if "@" not in email or "." not in email:
            return jsonify({"message": "Invalid email format"}), 400

        existing_user = mongo.db.users.find_one({"$or": [{"username": username}, {"email": email}]})
        if existing_user:
            if existing_user["username"] == username:
                return jsonify({"message": "Username already exists"}), 400
            else:
                return jsonify({"message": "Email already exists"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        mongo.db.users.insert_one({
            "username": username,
            "email": email,
            "password": hashed_password,
            "stats": {
                "total_games": 0,
                "average_wpm": 0,
                "best_wpm": 0
            },
            "created_at": datetime.utcnow()
        })

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        logger.error(f"Error during registration: {e}")
        return jsonify({"message": "An error occurred during registration"}), 500