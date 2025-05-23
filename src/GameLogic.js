// GameLogic.js
export const INGREDIENTS = [
    { name: 'Honey', type: 'Sweet' },
    { name: 'Berry', type: 'Sour' },
    { name: 'Firewater', type: 'Strong' },
    { name: 'Herbal', type: 'Bitter' }
];

export const TYPES = ['Sweet', 'Sour', 'Strong', 'Bitter'];

export function getRandomMission() {
    const count = Math.floor(Math.random() * 2) + 2; // 2 or 3 types
    const shuffled = [...TYPES].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return {
        text: `I want a mostly ${selected.map(s => s.toLowerCase()).join(', ')} drink.`,
        targetTypes: selected
    };
}

export function evaluateDrink(mixGlass, mission) {
    if (!mission) return 0;
    const expected = mission.targetTypes;
    const total = mixGlass.length;

    if (total === 0) return 0;

    // Count each type in the mix
    const typeCount = mixGlass.reduce((acc, ing) => {
        acc[ing.type] = (acc[ing.type] || 0) + 1;
        return acc;
    }, {});

    const mainType = expected[0];
    const mainTypeCount = typeCount[mainType] || 0;
    const maxCount = Math.max(...Object.values(typeCount));

    if (mainTypeCount < 2 || mainTypeCount !== maxCount) return 0;

    for (let i = 1; i < expected.length; i++) {
        if ((typeCount[expected[i]] || 0) < 1) return 0;
    }

    return expected.length * 10;
}
