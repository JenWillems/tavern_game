import { useState, useMemo, useCallback } from 'react';
import { INGREDIENTS } from './GameLogic';
import { cocktailRecipes } from './CocktailData';

const FLAVOR_TYPES = ['Strong', 'Sweet', 'Sour', 'Bitter'];

const styles = {
    container: {
        display: 'flex',
        gap: 30,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    ingredientBtn: {
        borderRadius: 5,
        backgroundColor: '#cc9900',
        color: 'black',
        cursor: 'pointer',
        padding: '5px 10px',
        border: 'none',
        fontWeight: 'bold',
    },
    mixGlassList: {
        marginBottom: 10,
        textAlign: 'center',
    },
    clearBtn: {
        padding: 10,
        backgroundColor: '#dc3545',
        color: 'white',
        borderRadius: 5,
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    cocktailBook: {
        borderLeft: '2px solid #444',
        paddingLeft: 20,
        maxWidth: 300,
        height: 400,
        overflowY: 'auto',
    },
    filterContainer: {
        marginBottom: 15,
    },
    filterLabels: {
        display: 'flex',
        gap: 10,
        marginTop: 5,
        flexWrap: 'wrap',
    },
    cocktailItem: (selected) => ({
        cursor: 'pointer',
        fontWeight: 'bold',
        padding: 5,
        marginBottom: 5,
        backgroundColor: selected ? '#333' : 'transparent',
        color: selected ? '#ffcc00' : '#fff',
        borderRadius: 4,
    }),
    recipeDetails: {
        marginTop: 5,
        marginBottom: 15,
        padding: '10px 15px',
        backgroundColor: '#111',
        borderRadius: 6,
        color: '#ccc',
        fontSize: '0.9rem',
        lineHeight: 1.3,
    },
    notes: {
        fontStyle: 'italic',
        color: '#aaa',
    },
};

export default function Cocktail({ mixGlass, onAddIngredient, onClear, disabled }) {
    const [selectedCocktail, setSelectedCocktail] = useState(null);
    const [filters, setFilters] = useState({
        Strong: false,
        Sweet: false,
        Sour: false,
        Bitter: false,
    });

    const toggleFilter = useCallback((type) => {
        setFilters((prev) => {
            const newFilters = { ...prev, [type]: !prev[type] };
            return newFilters;
        });
        setSelectedCocktail(null);
    }, []);

    const activeFilters = useMemo(
        () => Object.entries(filters).filter(([_, checked]) => checked).map(([type]) => type),
        [filters]
    );

    const filteredCocktails = useMemo(() => {
        if (activeFilters.length === 0) return cocktailRecipes;

        return cocktailRecipes.filter(
            (cocktail) => cocktail.tags?.some((tag) => activeFilters.includes(tag)) ?? false
        );
    }, [activeFilters]);

    return (
        <div style={styles.container}>
            {/* Mixing Area */}
            <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                    {INGREDIENTS.map((ing) => (
                        <button
                            key={ing.name}
                            onClick={() => onAddIngredient(ing)}
                            disabled={disabled || mixGlass.length >= 4}
                            style={styles.ingredientBtn}
                        >
                            {ing.name}
                        </button>
                    ))}
                </div>

                <div style={styles.mixGlassList}>
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
                    style={styles.clearBtn}
                >
                    Clear
                </button>
            </div>

            {/* Cocktail Book */}
            <div style={styles.cocktailBook}>
                <h2 style={{ color: '#ffcc00' }}>📖 Cocktail Book</h2>

                {/* Filter checkboxes */}
                <div style={styles.filterContainer}>
                    <strong>Filter by Flavor:</strong>
                    <div style={styles.filterLabels}>
                        {FLAVOR_TYPES.map((type) => (
                            <label key={type} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                    type="checkbox"
                                    checked={filters[type]}
                                    onChange={() => toggleFilter(type)}
                                    style={{ marginRight: 5 }}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                {filteredCocktails.map((cocktail) => {
                    const isSelected = selectedCocktail?.name === cocktail.name;
                    return (
                        <div key={cocktail.name}>
                            <div
                                className={`cocktail-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedCocktail(cocktail);
                                    console.log(cocktail);
                                }}
                                style={styles.cocktailItem(isSelected)}
                            >
                                {cocktail.name}
                            </div>

                            {isSelected && (
                                <div style={styles.recipeDetails}>
                                    <ul style={{ margin: '5px 0' }}>
                                        {cocktail.ingredients.map((ing, i) => (
                                            <li key={i}>{ing}</li>
                                        ))}
                                    </ul>
                                    {cocktail.serving && (
                                        <p style={styles.notes}>
                                            <strong>Serving:</strong> {cocktail.serving}
                                        </p>
                                    )}
                                    {cocktail.notes && (
                                        <p style={styles.notes}>
                                            <strong>Notes:</strong> {cocktail.notes}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
