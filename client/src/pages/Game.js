import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { updateStats } from "../services/statsService";
import { saveToLeaderboard } from "./Leaderboard"; // Ensure correct path

import './Game.css';

const Wordle = () => {
    const [secretWord, setSecretWord] = useState(""); // Secret word from API
    const [attempts, setAttempts] = useState(0); // Number of attempts
    const [currentGuess, setCurrentGuess] = useState(""); // User's current guess
    const [gameBoard, setGameBoard] = useState(Array(30).fill({ letter: '', state: '' })); // Board state
    const [keyboardLayout, setKeyboardLayout] = useState([
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ]);
    const [keyStates, setKeyStates] = useState({}); // Tracks letter states
    const [message, setMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [hints, setHints] = useState(parseInt(localStorage.getItem("wordleHints")) || 0);
    const [hintUsed, setHintUsed] = useState(false);
    const [boxes, setBoxes] = useState(Array(30).fill(""));

    const navigate = useNavigate();

    // Fetch the secret word from API when the game starts
    useEffect(() => {
        fetchRandomWord();
    }, []);

    const fetchRandomWord = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/word/generate');
            const data = await response.json();
            setSecretWord(data.word.toUpperCase()); // Set secret word
        } catch (error) {
            console.error('Error fetching word:', error);
            setSecretWord("HELLO"); // Fallback word
        }
    };

    const handleKeyDown = (event) => {
        let key = event.key.toUpperCase();
        if (key.length === 1 && key >= 'A' && key <= 'Z') {
            addLetter(key);
        } else if (event.key === "Enter") {
            checkWord();
        } else if (event.key === "Backspace") {
            removeLetter();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentGuess, attempts, gameOver]);

    // Add letter to the current guess
    const addLetter = (letter) => {
        if (currentGuess.length < 5 && !gameOver) {
            setCurrentGuess(prev => prev + letter);
            setGameBoard(prev => {
                const newBoard = [...prev];
                newBoard[attempts * 5 + currentGuess.length] = { letter, state: '' };
                return newBoard;
            });
        }
    };

    // Remove last letter from the current guess
    const removeLetter = () => {
        if (currentGuess.length > 0 && !gameOver) {
            setGameBoard(prev => {
                const newBoard = [...prev];
                newBoard[attempts * 5 + currentGuess.length - 1] = { letter: '', state: '' };
                return newBoard;
            });
            setCurrentGuess(prev => prev.slice(0, -1));
        }
    };

    // Check the user's guess with the API
    const checkWord = async () => {
        if (currentGuess.length !== 5) {
            setMessage("Enter a 5-letter word!");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/word/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ guessedWord: currentGuess, correctWord: secretWord })
            });
    
            const data = await response.json();
    
            if (!data || data.error) {
                setMessage("Error checking word. Please try again.");
                return;
            }
    
            let newGameBoard = [...gameBoard];
            let newKeyStates = { ...keyStates };
    
            // Step 1: Count occurrences of each letter in secretWord
            let letterCount = {};
            for (let char of secretWord) {
                letterCount[char] = (letterCount[char] || 0) + 1;
            }
    
            // Step 2: First pass - Mark "correct" letters
            let guessStates = Array(5).fill("wrong");
            for (let i = 0; i < 5; i++) {
                if (currentGuess[i] === secretWord[i]) {
                    guessStates[i] = "correct";
                    letterCount[currentGuess[i]] -= 1;
                }
            }
    
            // Step 3: Second pass - Mark "partial" letters
            for (let i = 0; i < 5; i++) {
                if (guessStates[i] === "correct") continue;
                if (secretWord.includes(currentGuess[i]) && letterCount[currentGuess[i]] > 0) {
                    guessStates[i] = "partial";
                    letterCount[currentGuess[i]] -= 1;
                }
            }
    
            // Step 4: Update game board and keyboard states
            for (let i = 0; i < 5; i++) {
                newGameBoard[attempts * 5 + i] = { letter: currentGuess[i], state: guessStates[i] };
                newKeyStates[currentGuess[i]] = guessStates[i];
            }
    
            setGameBoard(newGameBoard);
            setKeyStates(newKeyStates);
    
            // Step 5: Handle win condition
            if (currentGuess === secretWord) {
                setGameOver(true);
                setMessage("🎉 Congratulations! You guessed the word!");

                // Update game stats in local storage
                updateStats(true);

                // **NEW: Wait 1 second to update UI before navigation**
                setTimeout(() => {
                    let finalBoard = [...newGameBoard];
                    for (let i = 0; i < 5; i++) {
                        finalBoard[attempts * 5 + i].state = "win"; // Turn all tiles blue
                    }
                    setGameBoard(finalBoard);

                    setTimeout(() => {
                        navigate("/Victory"); // Navigate after another delay
                    }, 1000);
                }, 1000);
    
                return;
            }
    
            // Step 6: Handle loss condition
            if (attempts >= 5) {
                setGameOver(true);
                setMessage(`Game Over! The word was: ${secretWord}`);
                
                // Update game stats in local storage
                updateStats(false);
                return;
            }
    
            // Step 7: Move to next attempt
            setAttempts(prev => prev + 1);
            setCurrentGuess("");
    
        } catch (error) {
            console.error("Error checking word:", error);
            setMessage("Error checking word. Please try again.");
        }
    };
    
    const useHint = () => {
        if (hints > 0 && !hintUsed) {
            const position = currentGuess.length;
            if (position < 5) {
                let updatedBoxes = [...boxes];
                let correctLetter = secretWord[position];
                updatedBoxes[attempts * 5 + position] = { letter: correctLetter, state: "hint" };
                setBoxes(updatedBoxes);
                setCurrentGuess(currentGuess + correctLetter);
                setHints(hints - 1);
                localStorage.setItem("wordleHints", hints - 1);
                setHintUsed(true);
            }
        }
    };

    // Stats update
const updateStats = (won) => {
    const stats = JSON.parse(localStorage.getItem("wordleStats")) || {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        bestStreak: 0,
        winRate: 0,
    };

    stats.gamesPlayed += 1;
    if (won) {
        stats.gamesWon += 1;
        stats.currentStreak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
    } else {
        stats.currentStreak = 0;
    }

    stats.winRate = Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
    localStorage.setItem("wordleStats", JSON.stringify(stats));

    // **NEW: Save to leaderboard**
    const playerName = localStorage.getItem("username");
    saveToLeaderboard(playerName, stats.gamesWon, stats.currentStreak);
};


    return (
        <div className="wordle-container">
            <div className="doodle doodle1">🎯</div>
            <div className="doodle doodle2">🎲</div>
            <div className="doodle doodle3">🎮</div>
            <div className="doodle doodle4">🔠</div>

            <h1 className="game-over letter">WORDLE</h1>
            <p>{message}</p>
            <div id="game-board" className="game-board">
                {gameBoard.map((item, index) => (
                    <div key={index} className={`box ${item.state}`}>{item.letter}</div>
                ))}
            </div>
            <div id="keyboard" className="keyboard">
                {keyboardLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="keyboard-row">
                        {row.map((key) => (
                            <div
                                key={key}
                                className={`key ${key === 'Enter' || key === '⌫' ? 'wide' : ''} ${keyStates[key] || ''}`}
                                onClick={() => {
                                    if (key === 'Enter') {
                                        checkWord();
                                    } else if (key === '⌫') {
                                        removeLetter();
                                    } else {
                                        addLetter(key);
                                    }
                                }}
                            >
                                {key}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="hint-section">
                <button
                    id="hintButton"
                    className="hint-button"
                    onClick={useHint}
                    disabled={hints === 0 || hintUsed}
                >
                    🎯 Hint (<span>{hints}</span>)
                </button>
            </div>
        </div>
    );
};

export default Wordle;
