import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './App.css';

const defaultUpgrades = {
    moreIngredients: false,
    moreCocktails:   false,
    higherEarnings:  false,
    meadFridge:      false,
};

const upgradeInfo = {
    moreIngredients: 'Unlocks 4 brand-new ingredients in your bar.',
    moreCocktails:   'Adds 6 exotic cocktail recipes to your book.',
    higherEarnings:  'Earn an extra $10 on every successful serve.',
    meadFridge:      'A mead fridge that you can use once every 2 rounds (after a serve).',
};

const GameProgress = forwardRef(({ onUpgrade, onUseFridge }, ref) => {
    const [money, setMoney]           = useState(0);
    const [round, setRound]           = useState(1);
    const [upgrades, setUpgrades]     = useState(defaultUpgrades);
    const [meadCooldown, setMeadCooldown] = useState(0);

    useImperativeHandle(ref, () => ({
        earnMoney(base = 20) {
            const bonus = upgrades.higherEarnings ? 10 : 0;
            setMoney(m => m + base + bonus);
            setRound(r => r + 1);
            if (meadCooldown > 0) {
                setMeadCooldown(c => c - 1);
            }
        }
    }), [upgrades, meadCooldown]);

    const purchaseUpgrade = (type, cost) => {
        if (money < cost || upgrades[type]) return;
        setMoney(m => m - cost);
        setUpgrades(u => ({ ...u, [type]: true }));
        onUpgrade?.(type);

        const unlocked = Object.entries({ ...upgrades, [type]: true })
            .filter(([,v]) => v)
            .map(([k]) => k)
            .join('\n• ');
        window.alert(`🔓 Upgrades Unlocked:\n• ${unlocked}`);
        window.alert(`ℹ️ ${upgradeInfo[type]}`);
    };

    const handleUseMeadFridge = () => {
        if (!upgrades.meadFridge || meadCooldown > 0) return;
        setMeadCooldown(2);
        window.alert('🍯 You used the mead fridge! Free serve unlocked.');
        onUseFridge?.();
    };

    return (
        <div className="panel sidebar">
            <h2>Progress</h2>
            <p>💰 Money: ${money}</p>
            <p>🔁 Round: {round}</p>

            {upgrades.meadFridge && (
                <p>🍯 Mead Fridge: {meadCooldown > 0 ? `Cooldown (${meadCooldown} rounds left)` : 'Ready!'}</p>
            )}

            {upgrades.meadFridge && meadCooldown === 0 && (
                <button
                    onClick={handleUseMeadFridge}
                    className="button button-yellow"
                >
                    Use Mead Fridge
                </button>
            )}

            <h3>Upgrades:</h3>
            <button
                onClick={() => purchaseUpgrade('moreIngredients', 100)}
                disabled={upgrades.moreIngredients}
                className="button"
            >
                Unlock 4 Ingredients ($100)
            </button><br/>

            <button
                onClick={() => purchaseUpgrade('moreCocktails', 150)}
                disabled={upgrades.moreCocktails}
                className="button"
            >
                Unlock 6 Cocktails ($150)
            </button><br/>

            <button
                onClick={() => purchaseUpgrade('higherEarnings', 120)}
                disabled={upgrades.higherEarnings}
                className="button"
            >
                +$10 per Drink ($120)
            </button><br/>

            <button
                onClick={() => purchaseUpgrade('meadFridge', 200)}
                disabled={upgrades.meadFridge}
                className="button"
            >
                Add Mead Fridge ($200)
            </button>
        </div>
    );
});

export default GameProgress;
