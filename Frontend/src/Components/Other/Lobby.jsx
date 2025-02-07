import React, { useState } from "react";

export default function Lobby({ username, setUsername, gameId, setGameId, onCreateGame, onJoinGame }) {
  const [mode, setMode] = useState("words");
  const [wordCount, setWordCount] = useState(15);
  const [timeDuration, setTimeDuration] = useState(15);

  const handleCreateGame = () => {
    if (!username) {
      alert("Please enter a username.");
      return;
    }
    onCreateGame(mode, mode === "words" ? wordCount : null, mode === "time" ? timeDuration : null);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button onClick={handleCreateGame} className="w-full p-2 mb-4 bg-blue-500 text-white rounded">
        Create Game
      </button>
      <input
        type="text"
        placeholder="Enter Game ID"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button onClick={onJoinGame} className="w-full p-2 bg-green-500 text-white rounded">
        Join Game
      </button>
      <div className="mt-4">
        <label className="mr-4">
          <input
            type="radio"
            name="mode"
            value="words"
            checked={mode === "words"}
            onChange={() => setMode("words")}
          />{" "}
          Words
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="time"
            checked={mode === "time"}
            onChange={() => setMode("time")}
          />{" "}
          Time
        </label>
      </div>
      {mode === "words" && (
        <select value={wordCount} onChange={(e) => setWordCount(parseInt(e.target.value))} className="mt-2 p-2 border border-gray-300 rounded">
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={45}>45</option>
        </select>
      )}
      {mode === "time" && (
        <select value={timeDuration} onChange={(e) => setTimeDuration(parseInt(e.target.value))} className="mt-2 p-2 border border-gray-300 rounded">
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={60}>60</option>
        </select>
      )}
    </div>
  );
}