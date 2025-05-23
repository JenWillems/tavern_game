import { useState, useEffect } from 'react';

import { getRandomMission, evaluateDrink } from './GameLogic.js';
import MissionDisplay from './MissionDisplay.jsx';
import Cocktail from './Cocktail.jsx';
import ScoreTime from './ScoreTime.jsx';
import GameOverScreen from './GameOverScreen.jsx';

export default function App() {
    const [mixGlass, setMixGlass] = useState([]);
    const [mission, setMission] = useState(getRandomMission());
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft <= 0) {
            setGameOver(true);
        }
    }, [timeLeft, gameOver]);

    const handleAddIngredient = (ingredient) => {
        if (mixGlass.length >= 4 || gameOver) return;
        setMixGlass([...mixGlass, ingredient]);
    };

    const handleClear = () => {
        setMixGlass([]);
    };

    const handleServe = () => {
        const gainedPoints = evaluateDrink(mixGlass, mission);
        if (gainedPoints === 0) {
            alert(`❌ Drink didn't meet all type requirements. No points awarded.`);
        } else {
            alert(`✅ Drink served! +${gainedPoints} points.`);
        }
        setScore(prev => Math.min(100, prev + gainedPoints));
        setMixGlass([]);
        setMission(getRandomMission());
    };

    const handleRestart = () => {
        setScore(0);
        setTimeLeft(120);
        setGameOver(false);
        setMixGlass([]);
        setMission(getRandomMission());
    };

    return (
        <div style={{ backgroundColor: '#111', color: 'white', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }}>
            <h1>⏳ TavernCraft: Timed Challenge</h1>

            <MissionDisplay mission={mission} />

            <Cocktail mixGlass={mixGlass} onAddIngredient={handleAddIngredient} onClear={handleClear} disabled={gameOver} />

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button onClick={handleServe} disabled={mixGlass.length === 0 || gameOver} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px' }}>
                    Serve
                </button>
            </div>

            <ScoreTime score={score} timeLeft={timeLeft} />

            {gameOver && <GameOverScreen score={score} onRestart={handleRestart} />}
        </div>
    );
}
