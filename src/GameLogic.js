import { cocktailRecipes } from './CocktailData';  // <-- import the cocktail data array

export const INGREDIENTS = [
    { name: 'Firewater', type: 'Strong' },
    { name: 'Berry',     type: 'Sour' },
    { name: 'Herbal',    type: 'Bitter' },
    { name: 'Honey',     type: 'Sweet' }
];

export const TYPES = ['Sweet', 'Sour', 'Strong', 'Bitter'];

function randomItem(arr) {
    return Array.isArray(arr) && arr.length
        ? arr[Math.floor(Math.random() * arr.length)]
        : null;
}

function getRandomTypes(count) {
    return [...TYPES]
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
}

function getRandomIngredient() {
    return randomItem(INGREDIENTS);
}

// Templates to vary mission phrasing
const cocktailPhrases = [
    name => `Serve me the legendary "${name}" cocktail.`,
    name => `I'd like to taste the "${name}" today.`,
    name => `Mix the famous "${name}" for me.`
];
const flavorPhrases = [
    type => `Give me a bold ${type.toLowerCase()} taste.`,
    type => `I crave a ${type.toLowerCase()} sensation.`,
    type => `Focus on a ${type.toLowerCase()} note.`
];
const ingredientPhrases = [
    name => `Include ${name} in my drink.`,
    name => `I want a hint of ${name}.`,
    name => `Don't forget the ${name}.`
];

let lastMissionText = null;  // track last mission

// Generate a random mission, avoiding immediate repeats
export function getRandomMission() {
    let mission;
    do {
        const missionTypes = ['cocktail', 'flavor', 'ingredient'];
        const chosenType = randomItem(missionTypes);

        if (chosenType === 'cocktail') {
            const cocktail = randomItem(cocktailRecipes);
            if (cocktail) {
                const phrase = randomItem(cocktailPhrases);
                mission = {
                    missionType: 'cocktail',
                    text: phrase(cocktail.name),
                    targetCocktail: cocktail
                };
            }
        } else if (chosenType === 'flavor') {
            const flavor = getRandomTypes(1)[0];
            const phrase = randomItem(flavorPhrases);
            mission = {
                missionType: 'flavor',
                text: phrase(flavor),
                targetType: flavor
            };
        } else if (chosenType === 'ingredient') {
            const ingredient = getRandomIngredient();
            if (ingredient) {
                const phrase = randomItem(ingredientPhrases);
                mission = {
                    missionType: 'ingredient',
                    text: phrase(ingredient.name),
                    targetIngredient: ingredient
                };
            }
        }

        if (!mission) {
            // Fallback - mixed types mission
            const types = getRandomTypes(2 + Math.floor(Math.random() * (TYPES.length - 2)));
            mission = {
                missionType: 'mixedTypes',
                text: `Create a mostly ${types.map(t => t.toLowerCase()).join(' and ')} blend.`,
                targetTypes: types
            };
        }
    } while (mission.text === lastMissionText);

    lastMissionText = mission.text;
    return mission;
}

// Evaluate the drink the player made
export function evaluateDrink(mixGlass, mission) {
    if (!mission) return 0;

    switch (mission.missionType) {
        case 'cocktail': {
            const target = mission.targetCocktail;
            if (!target) return 0;
            const expected = [...target.ingredients].sort();
            const made     = mixGlass.map(i => i.name).sort();
            const match =
                expected.length === made.length &&
                expected.every((v, i) => v === made[i]);
            return match ? 30 : 0;
        }

        case 'flavor': {
            const t = mission.targetType;
            const count = mixGlass.filter(i => i.type === t).length;
            return count >= 2 ? 20 : 0;
        }

        case 'ingredient': {
            const n = mission.targetIngredient?.name;
            return mixGlass.some(i => i.name === n) ? 20 : 0;
        }

        case 'mixedTypes': {
            const expected = mission.targetTypes;
            const total    = mixGlass.length;
            if (total === 0 || !expected || !expected.length) return 0;

            const typeCount = mixGlass.reduce((acc, ing) => {
                acc[ing.type] = (acc[ing.type] || 0) + 1;
                return acc;
            }, {});

            const main = expected[0];
            if ((typeCount[main] || 0) < 2) return 0;
            return expected.length * 10;
        }

        default:
            return 0;
    }
}
