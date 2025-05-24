import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './App.css';

const defaultUpgrades = {
    moreIngredients: false,
    moreCocktails: false,
    higherEarnings: false,
    meadFridge: false,
};

const upgradeInfo = {
    moreIngredients: 'Unlocks 4 brand-new ingredients in your bar.',
    moreCocktails: 'Adds 6 exotic cocktail recipes to your book.',
    higherEarnings: 'Earn an extra $10 on every successful serve.',
    meadFridge: 'A mead fridge that you can use once every 2 rounds (after a serve).',
};

const upgradeCosts = {
    moreIngredients: 100,
    moreCocktails: 150,
    higherEarnings: 120,
    meadFridge: 200,
};

const GameProgress = forwardRef(({ onUpgrade, onUseFridge }, ref) => {
    const [money, setMoney] = useState(0);
    const [round, setRound] = useState(1);
    const [upgrades, setUpgrades] = useState(defaultUpgrades);
    const [meadCooldown, setMeadCooldown] = useState(0);

    useImperativeHandle(
        ref,
        () => ({
            earnMoney(base = 20) {
                const bonus = upgrades.higherEarnings ? 10 : 0;
                setMoney((m) => m + base + bonus);
                setRound((r) => r + 1);
                if (meadCooldown > 0) setMeadCooldown((c) => c - 1);
            },
        }),
        [upgrades.higherEarnings, meadCooldown]
    );

    const purchaseUpgrade = (type) => {
        if (money < upgradeCosts[type] || upgrades[type]) return;
        setMoney((m) => m - upgradeCosts[type]);
        setUpgrades((u) => {
            const updated = { ...u, [type]: true };
            // Show alerts after state updates
            setTimeout(() => {
                const unlocked = Object.entries(updated)
                    .filter(([, v]) => v)
                    .map(([k]) => k)
                    .join('\n• ');
                window.alert(`🔓 Upgrades Unlocked:\n• ${unlocked}`);
                window.alert(`ℹ️ ${upgradeInfo[type]}`);
            }, 0);
            return updated;
        });
        onUpgrade?.(type);
    };

    const handleUseMeadFridge = () => {
        if (!upgrades.meadFridge || meadCooldown > 0) return;
        setMeadCooldown(2);
        window.alert('🍯 You used the mead fridge! Free serve unlocked.');
        onUseFridge?.();
    };

    // Generate upgrade buttons dynamically to avoid repetition
    const upgradeButtons = Object.keys(defaultUpgrades).map((type) => (
        <button
            key={type}
            onClick={() => purchaseUpgrade(type)}
            disabled={upgrades[type]}
            className="button"
        >
            {type === 'moreIngredients' && `Unlock 4 Ingredients ($${upgradeCosts[type]})`}
            {type === 'moreCocktails' && `Unlock 6 Cocktails ($${upgradeCosts[type]})`}
            {type === 'higherEarnings' && `+$10 per Drink ($${upgradeCosts[type]})`}
            {type === 'meadFridge' && `Add Mead Fridge ($${upgradeCosts[type]})`}
        </button>
    ));

    return (
        <div className="panel sidebar">
            <h2>Progress</h2>
            <p>💰 Money: ${money}</p>
            <p>🔁 Round: {round}</p>

            {upgrades.meadFridge && (
                <p>
                    🍯 Mead Fridge:{' '}
                    {meadCooldown > 0 ? `Cooldown (${meadCooldown} rounds left)` : 'Ready!'}
                </p>
            )}

            {upgrades.meadFridge && meadCooldown === 0 && (
                <button onClick={handleUseMeadFridge} className="button button-yellow">
                    Use Mead Fridge
                </button>
            )}

            <h3>Upgrades:</h3>
            {upgradeButtons.reduce((acc, btn, idx) => (idx > 0 ? [...acc, <br key={idx} />, btn] : [btn]), [])}
        </div>
    );
});

export default GameProgress;
