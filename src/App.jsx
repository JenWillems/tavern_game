// App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

import { getRandomMission, evaluateDrink, INGREDIENTS } from './GameLogic.js';
import { cocktailRecipes } from './CocktailData.js';

import GameProgress   from './GameProgress.jsx';
import MissionDisplay from './MissionDisplay.jsx';
import ScoreTime      from './ScoreTime.jsx';
import FinanceReport  from './FinanceReport.jsx';

const GARNISHES = [
    { name: 'Mint Leaf', type: 'Bitter' },
    { name: 'Lemon Twist', type: 'Sour'   },
    { name: 'Sugar Rim',   type: 'Sweet'  },
    { name: 'Chili Flake', type: 'Strong' },
];

const TASTE_FILTERS = ['Strong','Sweet','Sour','Bitter'];

export default function App() {
    // Bar-game state
    const [mixGlass, setMixGlass]         = useState([]);
    const [garnish, setGarnish]           = useState(null);
    const [prepMethod, setPrepMethod]     = useState(null);
    const [mission, setMission]           = useState(() => getRandomMission());
    const [score, setScore]               = useState(0);
    const [timeLeft, setTimeLeft]         = useState(20);
    const [drinksServed, setDrinksServed] = useState(0);

    // Cocktail-book
    const [selectedFilters, setSelectedFilters]     = useState([]);
    const [selectedCocktail, setSelectedCocktail]   = useState(null);

    // Day/report state
    const [day, setDay]               = useState(1);
    const [showReport, setShowReport] = useState(false);

    const progressRef = useRef();

    // Timer effect: countdown unless report is showing
    useEffect(() => {
        if (showReport) return;
        if (timeLeft <= 0) {
            setShowReport(true);
            return;
        }
        const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timeLeft, showReport]);

    // Reset the mixing state
    const resetMix = useCallback(() => {
        setMixGlass([]);
        setGarnish(null);
        setPrepMethod(null);
    }, []);

    // Ingredient handlers
    const handleAddIngredient = useCallback(ing => {
        if (showReport || mixGlass.length >= 4) return;
        setMixGlass(g => [...g, ing]);
    }, [mixGlass, showReport]);

    const handleSelectGarnish = useCallback(name => {
        if (showReport) return;
        setGarnish(g => (g === name ? null : name));
    }, [showReport]);

    const handleSelectPrep = useCallback(method => {
        if (showReport) return;
        setPrepMethod(m => (m === method ? null : method));
    }, [showReport]);

    // Serve the drink
    const handleServe = useCallback(() => {
        const pts = evaluateDrink(mixGlass, mission);
        if (pts > 0) {
            alert(`✅ Served! +${pts} gold.`);
            setScore(s => s + pts);
            setDrinksServed(n => n + 1);
            progressRef.current?.earnMoney(pts);
        } else {
            alert(`❌ Drink didn't meet requirements. No gold awarded.`);
        }
        resetMix();
        setMission(getRandomMission());
    }, [mixGlass, mission, resetMix]);

    // Finish Day early
    const handleFinishDay = useCallback(() => {
        setShowReport(true);
    }, []);

    // Next Day: hide report, reset bar, increment day
    const handleNextDay = useCallback(() => {
        setShowReport(false);
        setDay(d => d + 1);
        setTimeLeft(20);
        resetMix();
        setMission(getRandomMission());
        setDrinksServed(0);
    }, [resetMix]);

    // Upgrades & fridge from sidebar
    const handleUpgrade   = useCallback(type => console.log('Upgrade:', type), []);
    const handleUseFridge = useCallback(() => {
        progressRef.current?.earnMoney();
        resetMix();
        setMission(getRandomMission());
    }, [resetMix]);

    // Cocktail book filtering
    const toggleFilter = useCallback(filter => {
        setSelectedFilters(fs =>
            fs.includes(filter) ? fs.filter(f => f !== filter) : [...fs, filter]
        );
    }, []);

    const filteredCocktails = selectedFilters.length === 0
        ? cocktailRecipes
        : cocktailRecipes.filter(c =>
            c.tags?.some(tag => selectedFilters.includes(tag))
        );

    const clearFilters = useCallback(() => {
        setSelectedFilters([]);
        setSelectedCocktail(null);
    }, []);

    // Render
    return (
        <div className="container">
            <h1 className="header">🍻 TavernCraft — Day {day}</h1>

            <div className="layout">
                {/* Sidebar: progress and upgrades */}
                <aside className="sidebar panel">
                    <GameProgress
                        ref={progressRef}
                        onUpgrade={handleUpgrade}
                        onUseFridge={handleUseFridge}
                    />
                </aside>

                {/* Main mixing area */}
                <main className="mix-panel panel">
                    <MissionDisplay mission={mission} />

                    {/* Ingredient buttons */}
                    <div className="button-group">
                        {INGREDIENTS.map(ing => (
                            <button
                                key={ing.name}
                                onClick={() => handleAddIngredient(ing)}
                                disabled={showReport || mixGlass.length >= 4}
                                className="button button-mix"
                            >
                                {ing.name}
                            </button>
                        ))}
                    </div>

                    {/* Garnish buttons */}
                    <div className="button-group">
                        {GARNISHES.map(g => (
                            <button
                                key={g.name}
                                onClick={() => handleSelectGarnish(g.name)}
                                disabled={showReport}
                                className={`button button-garnish${garnish===g.name?' selected':''}`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>

                    {/* Prep method buttons */}
                    <div className="button-group">
                        {['Shaken','Stirred','Poured'].map(m => (
                            <button
                                key={m}
                                onClick={() => handleSelectPrep(m)}
                                disabled={showReport}
                                className={`button button-method${prepMethod===m?' selected':''}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* Current mix */}
                    <section className="mix-list">
                        <h2>🧪 MixGlass</h2>
                        <ul>
                            {mixGlass.map((i, idx) => (
                                <li key={idx}>
                                    {i.name} <small>({i.type})</small>
                                </li>
                            ))}
                            {garnish && <li><em>Garnish:</em> {garnish}</li>}
                            {prepMethod && <li><em>Method:</em> {prepMethod}</li>}
                        </ul>
                        <p>
                            {mixGlass.length}/4 ingredients
                            {garnish ? ' | garnish' : ''}
                            {prepMethod ? ' | method' : ''}
                        </p>
                    </section>

                    {/* Serve & clear */}
                    <div className="button-group">
                        <button
                            onClick={handleServe}
                            disabled={!mixGlass.length || showReport}
                            className="button button-green"
                        >
                            Serve
                        </button>
                        <button
                            onClick={resetMix}
                            disabled={(mixGlass.length===0 && !garnish && !prepMethod) || showReport}
                            className="button button-red"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Score & timer */}
                    <ScoreTime score={score} timeLeft={timeLeft} />

                    {/* Finish day */}
                    <button
                        onClick={handleFinishDay}
                        disabled={showReport}
                        className="button button-blue"
                        style={{ marginTop: 10 }}
                    >
                        Finish Day
                    </button>
                </main>

                {/* Cocktail book */}
                <aside className="cocktail-book panel">
                    <h2>📖 Cocktail Book</h2>
                    <div className="button-group">
                        {TASTE_FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => toggleFilter(f)}
                                className={`button button-filter${selectedFilters.includes(f)?' selected':''}`}
                            >
                                {f}
                            </button>
                        ))}
                        <button onClick={clearFilters} className="button button-small">
                            Clear Filters
                        </button>
                    </div>
                    {filteredCocktails.length === 0 ? (
                        <p className="empty">No cocktails match.</p>
                    ) : (
                        filteredCocktails.map(c => (
                            <div
                                key={c.name}
                                onClick={() => setSelectedCocktail(c)}
                                className={`cocktail-item${selectedCocktail?.name===c.name?' selected':''}`}
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
                            <p>Tags: {selectedCocktail.tags?.join(', ')||'None'}</p>
                        </div>
                    )}
                </aside>
            </div>

            {/* End-of-day report modal */}
            {showReport && (
                <FinanceReport
                    day={day}
                    drinksServed={drinksServed}
                    onNextDay={handleNextDay}
                />
            )}
        </div>
    );
}
