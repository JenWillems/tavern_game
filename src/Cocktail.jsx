import { useState } from 'react';
import { INGREDIENTS } from './GameLogic';
import { cocktailRecipes } from './CocktailData';

export default function Cocktail({ mixGlass, onAddIngredient, onClear, disabled }) {
    const [selectedCocktail, setSelectedCocktail] = useState(null);

    return (
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'flex-start' }}>
            {/* Mixing Area */}
            <div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    {INGREDIENTS.map((ing) => (
                        <button
                            key={ing.name}
                            onClick={() => onAddIngredient(ing)}
                            disabled={disabled || mixGlass.length >= 4}
                            style={{
                                borderRadius: '5px',
                                backgroundColor: '#cc9900',
                                color: 'black',
                                cursor: 'pointer',
                            }}
                        >
                            {ing.name}
                        </button>
                    ))}
                </div>

                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                    <h2>🧪 MixGlass</h2>
                    <ul>
                        {mixGlass.map((ing, i) => (
                            <li key={i}>
                                {ing.name} ({ing.type})
                            </li>
                        ))}
                    </ul>
                    <p>{mixGlass.length} / 4 ingredients</p>
                </div>

                <button
                    onClick={onClear}
                    disabled={mixGlass.length === 0 || disabled}
                    style={{
                        padding: '10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        borderRadius: '5px',
                    }}
                >
                    Clear
                </button>
            </div>

            {/* Cocktail Book */}
            <div
                style={{
                    borderLeft: '2px solid #444',
                    paddingLeft: '20px',
                    maxWidth: '300px',
                    height: '400px',
                    overflowY: 'scroll',
                }}
            >
                <h2 style={{ color: '#ffcc00' }}>📖 Cocktail Book</h2>

                {cocktailRecipes.map((cocktail) => (
                    <div key={cocktail.name}>
                        <div
                            className={`cocktail-item ${selectedCocktail?.name === cocktail.name ? 'selected' : ''}`}
                            onClick={() => {
                                setSelectedCocktail(cocktail);
                                console.log(cocktail); // Log cocktail info on click
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <strong>{cocktail.name}</strong>
                        </div>

                        {/* Show recipe details only if this cocktail is selected */}
                        {selectedCocktail?.name === cocktail.name && (
                            <div
                                style={{
                                    marginTop: '5px',
                                    marginBottom: '15px',
                                    padding: '10px 15px',
                                    backgroundColor: '#111',
                                    borderRadius: '6px',
                                    color: '#ccc',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.3',
                                }}
                            >
                                <ul style={{ margin: '5px 0' }}>
                                    {cocktail.ingredients.map((ing, i) => (
                                        <li key={i}>{ing}</li>
                                    ))}
                                </ul>
                                <p style={{ fontStyle: 'italic', color: '#aaa' }}>{cocktail.notes}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
