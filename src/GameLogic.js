import { cocktailRecipes } from './CocktailData';

export const INGREDIENTS = [
    { name: 'Firewater', type: 'Strong' },
    { name: 'Berry', type: 'Sour' },
    { name: 'Herbal', type: 'Bitter' },
    { name: 'Honey', type: 'Sweet' }
];

export const GARNISHES = [
    { name: 'Mint Leaf', type: 'Bitter' },
    { name: 'Lemon Twist', type: 'Sour' },
    { name: 'Sugar Rim', type: 'Sweet' },
    { name: 'Chili Flake', type: 'Strong' }
];

export const TYPES = ['Sweet', 'Sour', 'Strong', 'Bitter'];

const randomItem = arr =>
    Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;

const getRandomTypes = count =>
    TYPES
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

const getRandomIngredient = () => randomItem(INGREDIENTS);

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

let lastMissionText = null;

export function getRandomMission() {
    const missionTypes = ['cocktail', 'flavor', 'ingredient'];
    let mission;

    do {
        const chosenType = randomItem(missionTypes);

        if (chosenType === 'cocktail') {
            const cocktail = randomItem(cocktailRecipes);
            if (cocktail) {
                const phrase = randomItem(cocktailPhrases);
                const tags = (cocktail.tags || cocktail.types || []).map(t => t.toLowerCase());
                mission = {
                    missionType: 'cocktail',
                    text: phrase(cocktail.name),
                    targetCocktail: cocktail,
                    tags: ['cocktail', ...tags]
                };
            }
        } else if (chosenType === 'flavor') {
            const flavor = getRandomTypes(1)[0];
            mission = {
                missionType: 'flavor',
                text: randomItem(flavorPhrases)(flavor),
                targetType: flavor,
                tags: ['flavor', flavor.toLowerCase()]
            };
        } else if (chosenType === 'ingredient') {
            const ingredient = getRandomIngredient();
            if (ingredient) {
                mission = {
                    missionType: 'ingredient',
                    text: randomItem(ingredientPhrases)(ingredient.name),
                    targetIngredient: ingredient,
                    tags: ['ingredient', ingredient.type.toLowerCase()]
                };
            }
        }

        if (!mission) {
            const types = getRandomTypes(2 + Math.floor(Math.random() * (TYPES.length - 2)));
            mission = {
                missionType: 'mixedTypes',
                text: `Create a mostly ${types.map(t => t.toLowerCase()).join(' and ')} blend.`,
                targetTypes: types,
                tags: ['mixedTypes', ...types.map(t => t.toLowerCase())]
            };
        }
    } while (mission.text === lastMissionText);

    lastMissionText = mission.text;
    return mission;
}

export function evaluateDrink(mixGlass, mission) {
    if (!mission) return 0;

    switch (mission.missionType) {
        case 'cocktail': {
            const target = mission.targetCocktail;
            if (!target) return 0;
            const expected = [...target.ingredients].sort();
            const made = mixGlass.map(i => i.name).sort();
            return expected.length === made.length && expected.every((v, i) => v === made[i]) ? 30 : 0;
        }

        case 'flavor': {
            const count = mixGlass.reduce((acc, i) => acc + (i.type === mission.targetType ? 1 : 0), 0);
            return count >= 2 ? 20 : 0;
        }

        case 'ingredient': {
            return mixGlass.some(i => i.name === mission.targetIngredient?.name) ? 20 : 0;
        }

        case 'mixedTypes': {
            const { targetTypes: expected } = mission;
            if (!expected?.length || mixGlass.length === 0) return 0;

            const typeCount = mixGlass.reduce((acc, ing) => {
                acc[ing.type] = (acc[ing.type] || 0) + 1;
                return acc;
            }, {});

            return (typeCount[expected[0]] || 0) >= 2 ? expected.length * 10 : 0;
        }

        default:
            return 0;
    }
}

export function filterMissionsByTag(missions, tag) {
    if (!tag) return missions;
    const lowerTag = tag.toLowerCase();
    return missions.filter(mission =>
        mission.tags?.some(t => t.toLowerCase() === lowerTag)
    );
}
