// Cocktail.jsx
import { useState } from 'react';
import { INGREDIENTS } from './GameLogic';
import { cocktailRecipes } from './CocktailData';  // <-- new import

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
                                padding: '10px',
                                borderRadius: '5px',
                                backgroundColor: '#cc9900',
                                color: 'black',
                                cursor: 'pointer',
                                minWidth: '80px'
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
                            <li key={i}>{ing.name} ({ing.type})</li>
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
                        borderRadius: '5px'
                    }}
                >
                    Clear
                </button>
            </div>

            {/* Cocktail Book */}
            <div style={{
                borderLeft: '2px solid #444',
                paddingLeft: '20px',
                maxWidth: '300px',
                height: '400px',
                overflowY: 'scroll'
            }}>
                <h2 style={{ color: '#ffcc00' }}>📖 Cocktail Book</h2>
                {cocktailRecipes.map((cocktail) => (
                    <div
                        key={cocktail.name}
                        style={{
                            cursor: 'pointer',
                            marginBottom: '10px',
                            padding: '5px',
                            backgroundColor: selectedCocktail?.name === cocktail.name ? '#222' : 'transparent'
                        }}
                        onClick={() => setSelectedCocktail(cocktail)}
                    >
                        <strong style={{ color: '#fff' }}>{cocktail.name}</strong>
                    </div>
                ))}

                {/* Selected Cocktail Info */}
                {selectedCocktail && (
                    <div style={{ marginTop: '20px', borderTop: '1px solid #666', paddingTop: '10px' }}>
                        <h3 style={{ color: '#ffcc00' }}>{selectedCocktail.name}</h3>
                        <ul>
                            {selectedCocktail.ingredients.map((ing, i) => (
                                <li key={i} style={{ color: '#ccc' }}>{ing}</li>
                            ))}
                        </ul>
                        <p style={{ color: '#aaa', fontStyle: 'italic' }}>{selectedCocktail.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
