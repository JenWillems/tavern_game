import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

import { getRandomMission, evaluateDrink, INGREDIENTS } from './GameLogic.js';
import { cocktailRecipes } from './CocktailData.js';

import GameProgress from './GameProgress.jsx';
import MissionDisplay from './MissionDisplay.jsx';
import ScoreTime from './ScoreTime.jsx';
import GameOverScreen from './GameOverScreen.jsx';

const GARNISHES = [
    { name: 'Mint Leaf', type: 'Bitter' },
    { name: 'Lemon Twist', type: 'Sour' },
    { name: 'Sugar Rim', type: 'Sweet' },
    { name: 'Chili Flake', type: 'Strong' }
];

const TASTE_FILTERS = ['Strong', 'Sweet', 'Sour', 'Bitter'];

export default function App() {
    const [mixGlass, setMixGlass] = useState([]);
    const [garnish, setGarnish] = useState(null);
    const [prepMethod, setPrepMethod] = useState(null);
    const [mission, setMission] = useState(getRandomMission());
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [gameOver, setGameOver] = useState(false);
    const progressRef = useRef();
    const [selectedCocktail, setSelectedCocktail] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);

    // Timer effect
    useEffect(() => {
        if (gameOver || timeLeft <= 0) {
            if (timeLeft <= 0) setGameOver(true);
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, gameOver]);

    // Handlers wrapped with useCallback to prevent unnecessary re-renders
    const handleAddIngredient = useCallback(ing => {
        if (gameOver || mixGlass.length >= 4) return;
        setMixGlass(g => [...g, ing]);
    }, [gameOver, mixGlass.length]);

    const handleSelectGarnish = useCallback(name => {
        if (gameOver) return;
        setGarnish(prev => (prev === name ? null : name));
    }, [gameOver]);

    const resetMix = useCallback(() => {
        setMixGlass([]);
        setGarnish(null);
        setPrepMethod(null);
    }, []);

    const handleClear = useCallback(() => {
        resetMix();
    }, [resetMix]);

    const handleServe = useCallback(() => {
        const garnishType = GARNISHES.find(g => g.name === garnish)?.type || null;
        const gained = evaluateDrink(mixGlass, mission, garnishType, prepMethod);

        alert(
            gained === 0
                ? `❌ Drink didn't meet requirements. No gold awarded.`
                : `✅ Drink served! +${gained} gold.`
        );

        setScore(s => s + gained);
        resetMix();
        setMission(getRandomMission());
        progressRef.current?.earnMoney(gained);
    }, [mixGlass, mission, garnish, prepMethod, resetMix]);

    const handleRestart = useCallback(() => {
        setScore(0);
        setTimeLeft(120);
        setGameOver(false);
        resetMix();
        setMission(getRandomMission());
    }, [resetMix]);

    const handleUseFridge = useCallback(() => {
        progressRef.current?.earnMoney();
        resetMix();
        setMission(getRandomMission());
    }, [resetMix]);

    const handleUpgrade = useCallback(type => {
        console.log('Upgrade purchased:', type);
    }, []);

    const handleCocktailClick = useCallback(cocktail => {
        setSelectedCocktail(cocktail);
    }, []);

    const toggleFilter = useCallback(filter => {
        setSelectedFilters(filters =>
            filters.includes(filter)
                ? filters.filter(f => f !== filter)
                : [...filters, filter]
        );
    }, []);

    // Memoized filtered cocktails
    const filteredCocktails = selectedFilters.length === 0
        ? cocktailRecipes
        : cocktailRecipes.filter(cocktail =>
            cocktail.tags?.some(tag => selectedFilters.includes(tag))
        );

    return (
        <div className="container">
            <h1 className="header">🍻 TavernCraft</h1>

            <div className="layout">
                <aside className="sidebar panel">
                    <GameProgress
                        ref={progressRef}
                        onUpgrade={handleUpgrade}
                        onUseFridge={handleUseFridge}
                    />
                </aside>

                <main className="mix-panel panel">
                    <MissionDisplay mission={mission} />

                    <div className="button-group" style={{ marginBottom: 10 }}>
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

                    <div className="button-group" style={{ marginBottom: 10 }}>
                        {GARNISHES.map(g => (
                            <button
                                key={g.name}
                                onClick={() => handleSelectGarnish(g.name)}
                                disabled={gameOver}
                                className={`button button-garnish ${garnish === g.name ? 'selected' : ''}`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>

                    <div className="button-group" style={{ marginBottom: 15 }}>
                        {['Shaken', 'Stirred', 'Poured'].map(method => (
                            <button
                                key={method}
                                onClick={() => setPrepMethod(method)}
                                disabled={gameOver}
                                className={`button button-method ${prepMethod === method ? 'selected' : ''}`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>

                    <section style={{ margin: '10px 0' }}>
                        <h2>🧪 MixGlass</h2>
                        <ul className="mix-list">
                            {mixGlass.map((i, idx) => (
                                <li key={idx}>
                                    {i.name} <small>({i.type})</small>
                                </li>
                            ))}
                            {garnish && <li><em>Garnish:</em> {garnish}</li>}
                            {prepMethod && <li><em>Method:</em> {prepMethod}</li>}
                        </ul>
                        <p>
                            {mixGlass.length} / 4 ingredients
                            {garnish ? ' | 1 garnish selected' : ''}
                            {prepMethod ? ' | method selected' : ''}
                        </p>
                    </section>

                    <div className="button-group">
                        <button
                            onClick={handleServe}
                            disabled={!mixGlass.length || gameOver}
                            className="button button-green"
                        >
                            Serve
                        </button>
                        <button
                            onClick={handleClear}
                            disabled={(!mixGlass.length && !garnish && !prepMethod) || gameOver}
                            className="button button-red"
                        >
                            Clear
                        </button>
                    </div>

                    <ScoreTime score={score} timeLeft={timeLeft} />

                    {gameOver && <GameOverScreen score={score} onRestart={handleRestart} />}
                </main>

                <aside className="cocktail-book panel">
                    <h2>📖 Cocktail Book</h2>

                    <div className="button-group" style={{ marginBottom: 10 }}>
                        {TASTE_FILTERS.map(filter => {
                            const isSelected = selectedFilters.includes(filter);
                            return (
                                <button
                                    key={filter}
                                    onClick={() => toggleFilter(filter)}
                                    className={`button button-filter ${isSelected ? 'selected' : ''}`}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '5px 10px',
                                        borderRadius: 5,
                                        border: isSelected ? '2px solid #ffcc00' : '1px solid #666',
                                        backgroundColor: isSelected ? '#333' : '#222',
                                        color: isSelected ? '#ffcc00' : '#ccc',
                                    }}
                                >
                                    {filter}
                                </button>
                            );
                        })}
                    </div>

                    {filteredCocktails.length === 0 ? (
                        <p style={{ color: '#999', fontStyle: 'italic' }}>
                            No cocktails found for selected filter(s).
                        </p>
                    ) : (
                        filteredCocktails.map(c => (
                            <div
                                key={c.name}
                                className={`cocktail-item ${selectedCocktail?.name === c.name ? 'selected' : ''}`}
                                onClick={() => handleCocktailClick(c)}
                                style={{ cursor: 'pointer' }}
                            >
                                <strong>{c.name}</strong>
                            </div>
                        ))
                    )}

                    {selectedCocktail && (
                        <div className="cocktail-details">
                            <h3>{selectedCocktail.name}</h3>
                            <p><em>{selectedCocktail.description}</em></p>
                            <p>Ingredients: {selectedCocktail.ingredients.join(', ')}</p>
                            <p>Taste tags: {selectedCocktail.tags?.join(', ') || 'None'}</p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
