import { useState, useEffect, useRef } from 'react';
import './App.css';

import { getRandomMission, evaluateDrink } from './GameLogic.js';
import GameProgress from './GameProgress.jsx';
import MissionDisplay from './MissionDisplay.jsx';
import ScoreTime from './ScoreTime.jsx';
import GameOverScreen from './GameOverScreen.jsx';
import { INGREDIENTS } from './GameLogic.js';
import { cocktailRecipes } from './CocktailData.js';

export default function App() {
    const [mixGlass, setMixGlass] = useState([]);
    const [mission, setMission] = useState(getRandomMission());
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [gameOver, setGameOver] = useState(false);
    const progressRef = useRef();
    const [selectedCocktail, setSelectedCocktail] = useState(null);

    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft <= 0) {
            setGameOver(true);
        }
    }, [timeLeft, gameOver]);

    const handleAddIngredient = ing => {
        if (mixGlass.length >= 4 || gameOver) return;
        setMixGlass(g => [...g, ing]);
    };

    const handleClear = () => setMixGlass([]);

    const handleServe = () => {
        const gained = evaluateDrink(mixGlass, mission);
        alert(
            gained === 0
                ? `❌ Drink didn't meet requirements. No gold awarded.`
                : `✅ Drink served! +${gained} gold.`
        );
        setScore(s => s + gained);
        setMixGlass([]);
        setMission(getRandomMission());
        progressRef.current?.earnMoney(gained);
    };

    const handleRestart = () => {
        setScore(0);
        setTimeLeft(120);
        setGameOver(false);
        setMixGlass([]);
        setMission(getRandomMission());
    };

    const handleUseFridge = () => {
        progressRef.current?.earnMoney();
        setMixGlass([]);
        setMission(getRandomMission());
    };

    const handleUpgrade = type => {
        console.log('Upgrade purchased:', type);
    };

    // Cocktail click handler to log info and select cocktail
    const handleCocktailClick = cocktail => {
        console.log('Cocktail clicked:', cocktail);
        setSelectedCocktail(cocktail);
    };

    return (
        <div className="container">
            <h1 className="header">🍻 TavernCraft</h1>

            <div className="layout">
                {/* 1) Upgrades Column */}
                <div className="sidebar panel">
                    <GameProgress
                        ref={progressRef}
                        onUpgrade={handleUpgrade}
                        onUseFridge={handleUseFridge}
                    />
                </div>

                {/* 2) Mixing Column */}
                <div className="mix-panel panel">
                    <MissionDisplay mission={mission} />

                    {/* Ingredient buttons */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {INGREDIENTS.map(ing => (
                            <button
                                key={ing.name}
                                onClick={() => handleAddIngredient(ing)}
                                disabled={gameOver || mixGlass.length >= 4}
                                className="button button-mix"
                            >
                                {ing.name}
                            </button>
                        ))}
                    </div>

                    {/* Glass contents */}
                    <div style={{ margin: '10px 0' }}>
                        <h2>🧪 MixGlass</h2>
                        <ul className="mix-list">
                            {mixGlass.map((i, idx) => (
                                <li key={idx}>
                                    {i.name} <small>({i.type})</small>
                                </li>
                            ))}
                        </ul>
                        <p>{mixGlass.length} / 4 ingredients</p>
                    </div>

                    {/* Serve & Clear */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleServe}
                            disabled={!mixGlass.length || gameOver}
                            className="button button-green"
                        >
                            Serve
                        </button>
                        <button
                            onClick={handleClear}
                            disabled={!mixGlass.length || gameOver}
                            className="button button-red"
                        >
                            Clear
                        </button>
                    </div>

                    <ScoreTime score={score} timeLeft={timeLeft} />

                    {gameOver && <GameOverScreen score={score} onRestart={handleRestart} />}
                </div>

                {/* 3) Cocktail Book Column */}
                <div className="cocktail-book panel">
                    <h2>📖 Cocktail Book</h2>
                    {cocktailRecipes.map(c => (
                        <div
                            key={c.name}
                            className={`cocktail-item ${
                                selectedCocktail?.name === c.name ? 'selected' : ''
                            }`}
                            onClick={() => handleCocktailClick(c)}
                            style={{ cursor: 'pointer' }}
                        >
                            <strong>{c.name}</strong>
                        </div>
                    ))}

                    {selectedCocktail && (
                        <div
                            style={{
                                marginTop: '10px',
                                padding: '10px',
                                backgroundColor: '#222',
                                borderRadius: '6px',
                                color: '#eee',
                            }}
                        >
                            <h3>{selectedCocktail.name}</h3>
                            <ul>
                                {selectedCocktail.ingredients.map((ing, i) => (
                                    <li key={i}>{ing}</li>
                                ))}
                            </ul>
                            <p style={{ fontStyle: 'italic' }}>{selectedCocktail.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
