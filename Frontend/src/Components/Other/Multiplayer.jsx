import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Lobby from "../Other/Lobby";
import Game from "../Other/Game";

const socket = io("http://127.0.0.1:5000", {
    transports: ["websocket", "polling"], // Try WebSocket first, then fallback to polling
  });   
export default function Multiplayer() {
  const [gameState, setGameState] = useState("lobby"); // "lobby" or "game"
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const [sentence, setSentence] = useState("");
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    socket.on("game_created", (data) => {
      setGameId(data.game_id);
      setIsCreator(data.is_creator);
      setGameState("game");
    });

    socket.on("game_started_for_all", (data) => {
      setSentence(data.sentence);
    });

    return () => {
      socket.off("game_created");
      socket.off("game_started_for_all");
    };
  }, []);

  const handleCreateGame = (mode, wordCount, timeDuration) => {
    socket.emit("create_game", username, mode, wordCount, timeDuration);
  };

  const handleJoinGame = () => {
    socket.emit("join_game", { game_id: gameId, username: username });
    setGameState("game");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Multiplayer Typing Speed Test</h1>
      {gameState === "lobby" ? (
        <Lobby
          username={username}
          setUsername={setUsername}
          gameId={gameId}
          setGameId={setGameId}
          onCreateGame={handleCreateGame}
          onJoinGame={handleJoinGame}
        />
      ) : (
        <Game sentence={sentence} isCreator={isCreator} />
      )}
    </div>
  );
}