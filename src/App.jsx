import { useEffect, useState } from 'react';

const INGREDIENTS = [
    { name: 'Honey', type: 'Sweet' },
    { name: 'Berry', type: 'Sour' },
    { name: 'Firewater', type: 'Strong' },
    { name: 'Herbal', type: 'Bitter' }
];

const TYPES = ['Sweet', 'Sour', 'Strong', 'Bitter'];

function getRandomMission() {
    const count = Math.floor(Math.random() * 2) + 2; // Always 2 or 3 types
    const shuffled = [...TYPES].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return {
        text: `I want a mostly ${selected.map(s => s.toLowerCase()).join(', ')} drink.`,
        targetTypes: selected
    };
}

export default function App() {
    const [mixGlass, setMixGlass] = useState([]);
    const [mission, setMission] = useState(getRandomMission());
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setInterval(() => {
                setTimeLeft((t) => t - 1);
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

    const countTypes = () => {
        return mixGlass.reduce((acc, ing) => {
            acc[ing.type] = (acc[ing.type] || 0) + 1;
            return acc;
        }, {});
    };
    const evaluateDrink = () => {
        const expected = mission.targetTypes; // e.g. ['Bitter', 'Sour']
        const total = mixGlass.length;

        if (total === 0) return 0;

        // Count each type in the mix
        const typeCount = mixGlass.reduce((acc, ing) => {
            acc[ing.type] = (acc[ing.type] || 0) + 1;
            return acc;
        }, {});

        // The "mostly" means first type must be dominant and appear at least twice
        const mainType = expected[0];
        const mainTypeCount = typeCount[mainType] || 0;

        // Check if mainType is dominant: more than any other type
        const maxCount = Math.max(...Object.values(typeCount));

        if (mainTypeCount < 2 || mainTypeCount !== maxCount) {
            return 0; // no points if main type is not dominant or less than 2
        }

        // For the other expected types, require at least 1 count
        for (let i = 1; i < expected.length; i++) {
            if ((typeCount[expected[i]] || 0) < 1) {
                return 0; // missing other required type(s)
            }
        }

        // If all conditions met, full points
        return expected.length * 10;
    };






    const handleServe = () => {
        const gainedPoints = evaluateDrink();
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

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div style={{ backgroundColor: '#111', color: 'white', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }}>
            <h1>⏳ TavernCraft: Timed Challenge</h1>
            <p style={{ fontSize: '1.2rem' }}>{mission.text}</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {INGREDIENTS.map((ing) => (
                    <button key={ing.name} onClick={() => handleAddIngredient(ing)} disabled={gameOver} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#cc9900', cursor: 'pointer' }}>
                        {ing.name}
                    </button>
                ))}
            </div>

            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                <h2>🧪 MixGlass</h2>
                <ul>
                    {mixGlass.map((ing, i) => (
                        <li key={i}>{ing.name} ({ing.type})</li>
                    ))}
                </ul>
                <p>{mixGlass.length} / 4 ingredients</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleServe} disabled={mixGlass.length === 0 || gameOver} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px' }}>
                    Serve
                </button>
                <button onClick={handleClear} disabled={mixGlass.length === 0 || gameOver} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', borderRadius: '5px' }}>
                    Clear
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                <p><strong>Score:</strong> {score} / 100</p>
                <p><strong>Time Left:</strong> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
            </div>

            {gameOver && (
                <>
                    <div style={{ marginTop: '30px', fontSize: '1.5rem', color: '#ffcc00' }}>
                        ⏱ Time's up! You scored {score} points!
                    </div>
                    <button onClick={handleRestart} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
                        🔁 Restart Game
                    </button>
                </>
            )}
        </div>
    );
}
