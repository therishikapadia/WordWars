import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Common/Navbar";
import "../../Font.css";

const Type = () => {
    const targetText = "find audience colony chose fellow minerals beginning respect cookies business";
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [wpmPerMinute, setWpmPerMinute] = useState([]); // Track WPM per minute
    const [isFinished, setIsFinished] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        if (!startTime) {
            setStartTime(Date.now());
        }
        setUserInput(event.target.value);
    };

    const calculateStats = () => {
        const totalTimeInMinutes = timeElapsed / 60;  // Time in minutes
        const totalWordsTyped = userInput.trim().split(/\s+/).length;
        const calculatedWPM = Math.round(totalWordsTyped / (timeElapsed / 60)); // WPM per minute
        setWpm(calculatedWPM);

        const correctChars = userInput
            .split("")
            .filter((char, index) => char === targetText[index]).length;
        const calculatedAccuracy = ((correctChars / targetText.length) * 100).toFixed(2);
        setAccuracy(calculatedAccuracy);

        // Store WPM per minute
        setWpmPerMinute((prev) => [...prev, { time: timeElapsed, wpm: calculatedWPM }]);
    };

    useEffect(() => {
        if (!startTime) return;

        const intervalId = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));  // Time in seconds
        }, 1000);

        return () => clearInterval(intervalId);
    }, [startTime]);

    useEffect(() => {
        if (userInput === targetText && !isFinished) {
            setIsFinished(true);
            navigate("/result", { state: { timeElapsed, wpm, accuracy, wpmPerMinute } });
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



    return (
        <div className="antialiased min-h-screen bg-gradient-to-b from-neutral-900 to-black text-neutral-400">
            <Navbar />
            <main className="grid place-content-center mt-20">
                <div className="w-full max-w-4xl">
                    <div className="mb-8">
                        <div className="mx-auto geist-mono-latin-400 w-fit flex items-center justify-center space-x-3 bg-neutral-900/50 p-2 rounded-full shadow-lg">
                            <button
                                className="rounded-full px-4 py-2 flex items-center transition-colors duration-200 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300"
                                tabIndex={0}
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
                                className="rounded-full px-4 py-2 flex items-center transition-colors duration-200 bg-neutral-800 text-neutral-200"
                                tabIndex={0}
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
                            <button
                                className="rounded-full px-3 py-1 min-w-[2rem] transition-colors duration-200 bg-neutral-800 text-neutral-200"
                                tabIndex={0}
                            >
                                10
                            </button>
                            <button
                                className="rounded-full px-3 py-1 min-w-[2rem] transition-colors duration-200 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300"
                                tabIndex={0}
                            >
                                25
                            </button>
                            <button
                                className="rounded-full px-3 py-1 min-w-[2rem] transition-colors duration-200 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300"
                                tabIndex={0}
                            >
                                50
                            </button>
                        </div>
                    </div>
                    <div className="relative text-white geist-mono-latin-400 text-2xl leading-relaxed tracking-wide mt-8">
                        <div className="whitespace-pre-wrap">{renderText()}</div>
                        <input
                            type="text"
                            spellCheck="false"
                            className="absolute top-0 pb-10 inset-0 bg-transparent outline-none text-transparent caret-transparent"
                            value={userInput}
                            onChange={handleInputChange}
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
