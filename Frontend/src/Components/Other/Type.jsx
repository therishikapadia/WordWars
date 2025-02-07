import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import "../../Font.css";
import axios from "axios";


const Type = ({ isAuthenticated, apiUrl }) => {
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100); // Start accuracy at 100%
    const [wpmPerMinute, setWpmPerMinute] = useState([]); // Track WPM per minute
    const [isFinished, setIsFinished] = useState(false);

    const yourToken = localStorage.getItem('token');


    const inputRef = useRef(null);
    const [targetText, setTargetText] = useState("");
    const [gameId, setGameId] = useState(null);
    const [wordCount, setWordCount] = useState(15);
    const [mode, setMode] = useState("words");
    const [timeDuration, setTimeDuration] = useState(15);
    const [isLoading, setIsLoading] = useState(true);


    const [shouldFocus, setShouldFocus] = useState(false); // New state for controlling focus

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        if (!startTime) {
            setStartTime(Date.now());
        }
        setUserInput(event.target.value);
    };

    const handleKeyDown = (event) => {
        // Prevent default behavior for left and right arrow keys
        if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
        }
    };

    const calculateStats = () => {
        const totalTimeInMinutes = timeElapsed / 60; // Time in minutes

        // Calculate correct characters
        const correctChars = userInput
            .split("")
            .filter((char, index) => char === targetText[index]).length;

        // Calculate WPM: (correct characters / 5) / time in minutes
        const calculatedWPM = Math.round((correctChars / 5) / totalTimeInMinutes);
        setWpm(calculatedWPM);

        // Calculate accuracy
        let calculatedAccuracy = 100; // Start at 100%
        if (userInput.length > 0) {
            const mistakes = userInput
                .split("")
                .filter((char, index) => char !== targetText[index]).length;
            calculatedAccuracy = Math.max(0, 100 - (mistakes / targetText.length) * 100).toFixed(2);
        }
        setAccuracy(calculatedAccuracy);

        // Store WPM per minute
        setWpmPerMinute((prev) => [...prev, { time: timeElapsed, wpm: calculatedWPM }]);
    };

    useEffect(() => {
        if (!startTime) return;

        const intervalId = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - startTime) / 1000)); // Time in seconds
        }, 1000);

        return () => clearInterval(intervalId);
    }, [startTime]);

    useEffect(() => {
        // Check if the user has completed the text
        if (userInput.length === targetText.length && targetText.length > 0) {
            // Set the game as finished
            setIsFinished(true);

            const submitResults = async () => {
                try {

                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${yourToken}` // Example for token-based auth
                    };

                    // Only call the /end API if the game is finished
                    if (isFinished && isAuthenticated && gameId) {
                        await axios.post(`${apiUrl}/game/end`, {
                            game_id: gameId,
                            wpm: wpm,
                            accuracy: parseFloat(accuracy),
                            time_taken: timeElapsed
                        }, {
                            headers,
                            withCredentials: true,
                        });
                    }
                    // Navigate to the result page
                    navigate("/result", { state: { timeElapsed, wpm, accuracy, wpmPerMinute } });
                } catch (error) {
                    console.error("Error submitting results:", error);
                }
            };

            submitResults();
        }
    }, [userInput, targetText, isFinished, navigate, timeElapsed, wpm, accuracy, wpmPerMinute]);

    useEffect(() => {
        if (userInput) {
            calculateStats();
        }
    }, [userInput, timeElapsed]);

    const renderText = () => {
        return targetText.split("").map((char, index) => {
            const inputChar = userInput[index];
            let className = "text-neutral-400";

            if (inputChar === char) {
                className = "text-white";
            } else if (inputChar !== undefined) {
                className = "text-red-500";
            }

            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    };

    useEffect(() => {
        if (!isLoading && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLoading]);

    useEffect(() => {
        const fetchText = async () => {
            // Reset game state
            setUserInput("");
            setStartTime(null);
            setTimeElapsed(0);
            setWpm(0);
            setAccuracy(100);
            setIsFinished(false);

            // Rest of fetch logic
        };
        fetchText();
    }, [mode, wordCount, timeDuration, isAuthenticated]);

    useEffect(() => {
        const fetchText = async () => {
            setIsLoading(true);
            try {
                const endpoint = isAuthenticated ? `${apiUrl}/game/start` : `${apiUrl}/game/startWithoutLogin`;
                const payload = {
                    mode: mode,
                    word_count: mode === "words" ? wordCount : undefined,
                    time_duration: mode === "time" ? timeDuration : undefined,
                };

                // Log the payload to check its structure
                console.log("Payload being sent:", payload);

                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${yourToken}` // Example for token-based auth
                };

                const response = await axios.post(endpoint, payload, {
                    headers,
                    withCredentials: true,
                });

                setTargetText(response.data.text);
                if (isAuthenticated) setGameId(response.data.game_id);

                // Set shouldFocus to true after text loads
                setShouldFocus(true);
            } catch (error) {
                console.error("Error fetching text:", error);
                setTargetText("Error loading text. Please refresh.");
            }
            setIsLoading(false);
        };

        fetchText();
    }, [mode, wordCount, timeDuration, isAuthenticated]);


    useEffect(() => {
        if (shouldFocus && inputRef.current) {
            inputRef.current.focus();
            setShouldFocus(false);
        }
    }, [shouldFocus]);


    return (
        <div className="antialiased min-h-screen bg-gradient-to-b from-neutral-900 to-black text-neutral-400">
            <Navbar isAuthenticated={isAuthenticated} />
            {isLoading ? (
                <div className="text-center text-neutral-500">Loading text...</div>
            ) : (
                // <div className="whitespace-pre-wrap">{renderText()}</div>
                <></>
            )}
            <main className="grid place-content-center mt-20">
                <div className="w-full max-w-4xl">
                    <div className="mb-8">
                        <div className="mx-auto geist-mono-latin-400 w-fit flex items-center justify-center space-x-3 bg-neutral-900/50 p-2 rounded-full shadow-lg">
                            <button
                                className={`rounded-full px-4 py-2 flex items-center transition-colors duration-200 ${mode === 'time' ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300'
                                    }`}
                                onClick={() => setMode('time')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-hourglass mr-2"
                                >
                                    <path d="M5 22h14" />
                                    <path d="M5 2h14" />
                                    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                                    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
                                </svg>
                                time
                            </button>
                            <button
                                className={`rounded-full px-4 py-2 flex items-center transition-colors duration-200 ${mode === 'words' ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300'
                                    }`}
                                onClick={() => setMode('words')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-type mr-2"
                                >
                                    <polyline points="4 7 4 4 20 4 20 7" />
                                    <line x1={9} x2={15} y1={20} y2={20} />
                                    <line x1={12} x2={12} y1={4} y2={20} />
                                </svg>
                                words
                            </button>
                            <div className="h-7 w-px bg-neutral-700" />
                            {mode === 'words' ? (
                                <>
                                    <button
                                        className={`rounded-full px-3 py-1 min-w-[2rem] ${wordCount === 15 ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-400 hover:bg-neutral-800/50'
                                            }`}
                                        onClick={() => setWordCount(15)}
                                    >
                                        15
                                    </button>
                                    <button
                                        className={`rounded-full px-3 py-1 min-w-[2rem] ${wordCount === 10 ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-400 hover:bg-neutral-800/50'
                                            }`}
                                        onClick={() => setWordCount(30)}
                                    >
                                        30
                                    </button>
                                    <button
                                        className={`rounded-full px-3 py-1 min-w-[2rem] ${wordCount === 10 ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-400 hover:bg-neutral-800/50'
                                            }`}
                                        onClick={() => setWordCount(45)}
                                    >
                                        45
                                    </button>
                                    {/* Add similar buttons for 25 and 50 */}
                                </>
                            ) : (
                                <>
                                    <button
                                        className={`rounded-full px-3 py-1 min-w-[2rem] ${timeDuration === 15 ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-400 hover:bg-neutral-800/50'
                                            }`}
                                        onClick={() => setTimeDuration(15)}
                                    >
                                        15
                                    </button>
                                    <button
                                        className={`rounded-full px-3 py-1 min-w-[2rem] ${timeDuration === 15 ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-400 hover:bg-neutral-800/50'
                                            }`}
                                        onClick={() => setTimeDuration(30)}
                                    >
                                        30
                                    </button>
                                    <button
                                        className={`rounded-full px-3 py-1 min-w-[2rem] ${timeDuration === 15 ? 'bg-neutral-800 text-neutral-200' : 'text-neutral-400 hover:bg-neutral-800/50'
                                            }`}
                                        onClick={() => setTimeDuration(60)}
                                    >
                                        60
                                    </button>
                                    {/* Add similar buttons for 30 and 60 */}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="relative text-white geist-mono-latin-400 text-2xl leading-relaxed tracking-wide mt-8">
                        <div className="whitespace-pre-wrap">{renderText()}</div>
                        <input
                            ref={inputRef}
                            type="text"
                            spellCheck="false"
                            className="absolute top-0 pb-10 inset-0 bg-transparent outline-none text-transparent caret-transparent"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mt-8 text-center geist-mono-latin-400 text-xl">
                        Time: {timeElapsed}s | WPM: {wpm} | Accuracy: {accuracy}%
                    </div>
                    {isFinished && (
                        <div className="mt-8 text-center text-green-500 text-xl">
                            Congratulations! You completed the typing task.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Type;