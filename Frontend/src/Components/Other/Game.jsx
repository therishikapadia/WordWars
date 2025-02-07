import React, { useState, useEffect } from "react";

export default function Game({ sentence, isCreator }) {
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (sentence) {
      setStartTime(Date.now());
    }
  }, [sentence]);

  const handleInput = (e) => {
    setTypedText(e.target.value);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <p className="text-xl mb-4">{sentence}</p>
      <textarea
        value={typedText}
        onChange={handleInput}
        placeholder="Start typing here..."
        className="w-full h-32 p-2 border border-gray-300 rounded"
      />
      {isCreator && (
        <button className="mt-4 p-2 bg-blue-500 text-white rounded">
          Start Game
        </button>
      )}
    </div>
  );
}