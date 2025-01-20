from flask import Flask
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from datetime import timedelta


mongo = None
bcrypt = None


def create_app():
    global mongo, bcrypt
    app = Flask(__name__)

    # MongoDB configuration
    app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
    app.config['SECRET_KEY'] = '1Word@Wars1'
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

    # Initialize extensions
    mongo = PyMongo(app)
    bcrypt = Bcrypt(app)
    jwt = JWTManager(app)

    # importing routes
    from routes.user import user
    from routes.game import game
    app.register_blueprint(user, url_prefix='/user')
    app.register_blueprint(game, url_prefix='/game')

    return app
