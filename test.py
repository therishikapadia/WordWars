from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room
import random
import time

# Create the Socket.IO instance outside the create_app function
socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your_secret_key'

    # Initialize Socket.IO with the app
    socketio.init_app(app)

    # Predefined list of sentences for the typing test
    SENTENCES = [
        "The quick brown fox jumps over the lazy dog.",
        "Python is an amazing programming language.",
        "Real-time applications are fun to build.",
        "Flask and Socket.IO make a great combination.",
        "Practice makes perfect when it comes to typing."
    ]

    # Store active games and players
    games = {}

    @app.route('/')
    def index():
        return render_template('index.html')

    @socketio.on('create_game')
    def handle_create_game(username):
        print(f"Creating game for user: {username}")
        game_id = str(random.randint(1000, 9999))  # Generate a random 4-digit game ID
        games[game_id] = {
            'players': [],
            'sentence': random.choice(SENTENCES),
            'start_time': None,
            'results': {}
        }
        join_room(game_id)  # Add the creator to the room
        join_game(game_id, username)
        emit('game_created', {'game_id': game_id}, room=game_id)  # Send to the room

    @socketio.on('join_game')
    def handle_join_game(data):
        print(f"Joining game: {data}")
        game_id = data['game_id']
        username = data['username']
        if game_id in games:
            join_room(game_id)  # Add the player to the room
            join_game(game_id, username)
        else:
            emit('error', {'message': 'Game not found'})

    def join_game(game_id, username):
        print(f"User {username} joining game {game_id}")
        games[game_id]['players'].append(username)
        emit('player_joined', {'username': username}, room=game_id)  # Send to the room
        emit('update_players', {'players': games[game_id]['players']}, room=game_id)  # Send to the room

        # Start the game automatically when 2 players join
        if len(games[game_id]['players']) == 2:
            handle_start_game(game_id)

    @socketio.on('start_game')
    def handle_start_game(game_id):
        print(f"Starting game: {game_id}")
        if game_id in games:
            games[game_id]['start_time'] = time.time()  # Set the start time
            emit('game_started', {
                'sentence': games[game_id]['sentence'],
                'start_time': games[game_id]['start_time']
            }, room=game_id)  # Send to the room

    @socketio.on('submit_result')
    def handle_submit_result(data):
        print(f"Submitting result: {data}")
        game_id = data['game_id']
        username = data['username']
        typed_text = data['typed_text']
        if game_id in games:
            # Ensure the game has started (start_time is not None)
            if games[game_id]['start_time'] is None:
                emit('error', {'message': 'Game has not started yet'}, room=game_id)
                return

            sentence = games[game_id]['sentence']
            start_time = games[game_id]['start_time']
            end_time = time.time()

            # Calculate typing speed (words per minute)
            word_count = len(sentence.split())
            time_taken = end_time - start_time
            wpm = (word_count / time_taken) * 60

            # Store the result
            games[game_id]['results'][username] = wpm

            # Broadcast the result to all players in the room
            emit('result_submitted', {
                'username': username,
                'wpm': round(wpm, 2)
            }, room=game_id)

            # Check if all players have submitted their results
            if len(games[game_id]['results']) == len(games[game_id]['players']):
                emit('game_over', {'results': games[game_id]['results']}, room=game_id)
                del games[game_id]  # Clean up the game

    return app

# Create the app using the application factory
app = create_app()

if __name__ == '__main__':
    socketio.run(app, debug=True)