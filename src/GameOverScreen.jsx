// GameOverScreen.jsx
export default function GameOverScreen({ score, onRestart }) {
    return (
        <>
            <div style={{ marginTop: '30px', fontSize: '1.5rem', color: '#ffcc00' }}>
                ⏱ Time's up! You scored {score} points!
            </div>
            <button onClick={onRestart} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
                🔁 Restart Game
            </button>
        </>
    );
}
