import React, { useState, useEffect } from "react";
import "./DailyPuzzle.css";

const WordleGame = () => {
    const secretWord = "HELLO";
    const [attempts, setAttempts] = useState(0);
    const [currentGuess, setCurrentGuess] = useState("");
    const [gameBoard, setGameBoard] = useState(Array(30).fill({ letter: '', state: '' }));
    const [keyStates, setKeyStates] = useState({});
    const [gameOver, setGameOver] = useState(false);
    const [hints, setHints] = useState(parseInt(localStorage.getItem("wordleHints")) || 0);
    const [hintUsed, setHintUsed] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!canPlayToday()) disableGame();
    }, []);

    const canPlayToday = () => {
        const lastPlayed = localStorage.getItem("lastPlayedDate");
        const today = new Date().toDateString();
        return !lastPlayed || lastPlayed !== today;
    };

    const disableGame = () => {
        setGameOver(true);
    };

    const addLetter = (letter) => {
        if (currentGuess.length < 5 && !gameOver) {
            setCurrentGuess((prev) => prev + letter);
            setGameBoard((prev) => {
                const newBoard = [...prev];
                newBoard[attempts * 5 + currentGuess.length] = { letter, state: "" };
                return newBoard;
            });
        }
    };

    const removeLetter = () => {
        if (!gameOver && currentGuess.length > 0) {
            setCurrentGuess((prev) => prev.slice(0, -1));
            setGameBoard((prev) => {
                const newBoard = [...prev];
                newBoard[attempts * 5 + currentGuess.length - 1] = { letter: "", state: "" };
                return newBoard;
            });
        }
    };

    const checkWord = () => {
        if (currentGuess.length !== 5) {
            alert("Enter a 5-letter word!");
            return;
        }

        let newBoard = [...gameBoard];
        let newKeyStates = { ...keyStates };

        let letterCount = {};
        for (let char of secretWord) {
            letterCount[char] = (letterCount[char] || 0) + 1;
        }

        let guessStates = Array(5).fill("wrong");
        for (let i = 0; i < 5; i++) {
            if (currentGuess[i] === secretWord[i]) {
                guessStates[i] = "correct";
                letterCount[currentGuess[i]] -= 1;
            }
        }

        for (let i = 0; i < 5; i++) {
            if (guessStates[i] === "correct") continue;
            if (secretWord.includes(currentGuess[i]) && letterCount[currentGuess[i]] > 0) {
                guessStates[i] = "partial";
                letterCount[currentGuess[i]] -= 1;
            }
        }

        for (let i = 0; i < 5; i++) {
            newBoard[attempts * 5 + i] = { letter: currentGuess[i], state: guessStates[i] };
            newKeyStates[currentGuess[i]] = guessStates[i];
        }

        setGameBoard(newBoard);
        setKeyStates(newKeyStates);

        if (currentGuess === secretWord) {
            alert("🎉 You Win!");
            localStorage.setItem("lastPlayedDate", new Date().toDateString());
            setGameOver(true);
        } else if (attempts >= 5) {
            alert(`Game Over! The word was: ${secretWord}`);
            localStorage.setItem("lastPlayedDate", new Date().toDateString());
            setGameOver(true);
        } else {
            setAttempts((prev) => prev + 1);
            setCurrentGuess("");
            setHintUsed(false);
        }
    };

    const handleKeyDown = (event) => {
        if (gameOver) return;
        const key = event.key.toUpperCase();
        if (key.length === 1 && key >= "A" && key <= "Z") {
            addLetter(key);
        } else if (event.key === "Enter") {
            checkWord();
        } else if (event.key === "Backspace") {
            removeLetter();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentGuess, gameOver]);

    const useHint = () => {
        if (hints > 0 && !hintUsed && currentGuess.length < 5) {
            const position = currentGuess.length;
            const correctLetter = secretWord[position];
            let newBoard = [...gameBoard];
            newBoard[attempts * 5 + position] = { letter: correctLetter, state: "hint" };
            setGameBoard(newBoard);
            setCurrentGuess((prev) => prev + correctLetter);
            setHints((prev) => {
                localStorage.setItem("wordleHints", prev - 1);
                return prev - 1;
            });
            setHintUsed(true);
        }
    };

    return (
        <div className="wordle-container">
            <button onClick={() => (window.location.href = "/home")} className="back-btn">Home</button>
            <h1 className="game-over letter">DAILY PUZZLE WORDLE</h1>
            <p>{message}</p>
            <div id="game-board">
                {gameBoard.map((item, i) => (
                    <div key={i} className={`box ${item.state}`}>{item.letter}</div>
                ))}
            </div>
            <div id="keyboard" className="keyboard">
                {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, rowIndex) => (
                    <div key={rowIndex} className="keyboard-row">
                        {[...row].map((letter) => (
                            <div
                                key={letter}
                                className={`key ${keyStates[letter] || ""}`}
                                onClick={() => addLetter(letter)}
                            >
                                {letter}
                            </div>
                        ))}
                    </div>
                ))}
                <div className="keyboard-row">
                    <div className="key wide" onClick={checkWord}>Enter</div>
                    <div className="key wide" onClick={removeLetter}>⌫</div>
                </div>
            </div>
            <div className="hint-section">
                <button
                    id="hintButton"
                    className="hint-button"
                    disabled={hints === 0 || hintUsed}
                    onClick={useHint}
                >
                    🎯 Hint (<span>{hints}</span>)
                </button>
            </div>
        </div>
    );
};

export default WordleGame;
