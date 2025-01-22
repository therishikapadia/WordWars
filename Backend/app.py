from flask import Flask, send_from_directory
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from sockets.game_sockets import register_game_sockets

# Global variables for extensions
mongo = None
bcrypt = None
socketio = None

def create_app():
    global mongo, bcrypt, socketio
    app = Flask(__name__)

    # MongoDB configuration
    app.config["MONGO_URI"] = "mongodb://localhost:27017/mydatabase"
    app.config['SECRET_KEY'] = '1Word@Wars1'
    # app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

    # Initialize extensions
    mongo = PyMongo(app)
    bcrypt = Bcrypt(app)
    jwt = JWTManager(app)
    socketio = SocketIO(app)

    # Register Socket.IO event handlers
    register_game_sockets(socketio)

    # Importing routes
    from routes.user import user
    from routes.game import game
    from routes.profile import profile
    from routes.leaderboard import leaderboard
    app.register_blueprint(user, url_prefix='/user')
    app.register_blueprint(game, url_prefix='/game')
    app.register_blueprint(profile, url_prefix='/profile')
    app.register_blueprint(leaderboard, url_prefix='/leaderboard')

    @app.route('/')
    def index():
        return send_from_directory('static', 'index.html')

    return app  # Return the app instance

app = create_app()  # Assign the returned app instance

if __name__ == '__main__':
    socketio.run(app, debug=True, transport=['websockets'])