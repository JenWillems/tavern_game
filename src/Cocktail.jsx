// Cocktail.jsx
import { INGREDIENTS } from './GameLogic';

export default function Cocktail({ mixGlass, onAddIngredient, onClear, disabled }) {
    return (
        <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {INGREDIENTS.map((ing) => (
                    <button
                        key={ing.name}
                        onClick={() => onAddIngredient(ing)}
                        disabled={disabled || mixGlass.length >= 4}
                        style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#cc9900', cursor: 'pointer' }}
                    >
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

            <button onClick={onClear} disabled={mixGlass.length === 0 || disabled} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', borderRadius: '5px' }}>
                Clear
            </button>
        </>
    );
}
