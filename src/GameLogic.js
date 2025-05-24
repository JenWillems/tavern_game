// GameLogic.js
import { cocktailRecipes } from './CocktailData';

export const INGREDIENTS = [
    { name: 'Firewater', type: 'Strong' },
    { name: 'Berry',     type: 'Sour'   },
    { name: 'Herbal',    type: 'Bitter' },
    { name: 'Honey',     type: 'Sweet'  },
];

export const TYPES = ['Sweet','Sour','Strong','Bitter'];

const rand = arr => arr[Math.floor(Math.random() * arr.length)];


/**
 * Evaluates a drink against a mission and returns a score
 * @param {Array} mixGlass - array of ingredient objects used in the drink
 * @param {Object} mission - the mission to evaluate against
 * @returns {number} score
 */
export function evaluateDrink(mixGlass, mission) {
    if (!mission) return 0;
    switch (mission.missionType) {
        case 'cocktail': {
            const ingNames = mixGlass.map(i => i.name).sort();
            const target  = [...mission.targetCocktail.ingredients].sort();
            return ingNames.length === target.length && target.every((v,i)=>v===ingNames[i]) ? 30 : 0;
        }
        case 'flavor': {
            const cnt = mixGlass.filter(i => i.type === mission.targetType).length;
            return cnt >= 2 ? 20 : 0;
        }
        case 'ingredient':
            return mixGlass.some(i => i.name === mission.targetIngredient.name) ? 20 : 0;
        case 'mixedTypes': {
            const need = mission.targetTypes[0];
            const cnt  = mixGlass.filter(i => i.type === need).length;
            return cnt >= 2 ? mission.targetTypes.length * 10 : 0;
        }
        default: return 0;
    }
}

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
    name => `Mix the famous "${name}" for me.`,
];
const flavorPhrases = [
    type => `Give me a bold ${type.toLowerCase()} taste.`,
    type => `I crave a ${type.toLowerCase()} sensation.`,
    type => `Focus on a ${type.toLowerCase()} note.`,
];
const ingredientPhrases = [
    name => `Include ${name} in my drink.`,
    name => `I want a hint of ${name}.`,
    name => `Don't forget the ${name}.`,
];

let lastMissionText = null;

/**
 * Generates a random mission with unique text from the last one
 * @returns {Object} mission object
 */
export function getRandomMission() {
    const missionTypes = ['cocktail', 'flavor', 'ingredient'];
    let mission = null;

    do {
        const chosenType = randomItem(missionTypes);

        if (chosenType === 'cocktail') {
            const cocktail = randomItem(cocktailRecipes);
            if (!cocktail) continue;
            const phrase = randomItem(cocktailPhrases);
            const tags = [...(cocktail.tags || cocktail.types || [])].map(t => t.toLowerCase());
            mission = {
                missionType: 'cocktail',
                text: phrase(cocktail.name),
                targetCocktail: cocktail,
                tags: ['cocktail', ...tags],
            };
        } else if (chosenType === 'flavor') {
            const [flavor] = getRandomTypes(1);
            mission = {
                missionType: 'flavor',
                text: randomItem(flavorPhrases)(flavor),
                targetType: flavor,
                tags: ['flavor', flavor.toLowerCase()],
            };
        } else if (chosenType === 'ingredient') {
            const ingredient = getRandomIngredient();
            if (!ingredient) continue;
            mission = {
                missionType: 'ingredient',
                text: randomItem(ingredientPhrases)(ingredient.name),
                targetIngredient: ingredient,
                tags: ['ingredient', ingredient.type.toLowerCase()],
            };
        }

        if (!mission) {
            // fallback: mixedTypes mission
            const typeCount = 2 + Math.floor(Math.random() * (TYPES.length - 2));
            const types = getRandomTypes(typeCount);
            mission = {
                missionType: 'mixedTypes',
                text: `Create a mostly ${types.map(t => t.toLowerCase()).join(' and ')} blend.`,
                targetTypes: types,
                tags: ['mixedTypes', ...types.map(t => t.toLowerCase())],
            };
        }
    } while (mission.text === lastMissionText);

    lastMissionText = mission.text;
    return mission;
}

/**
 * Filters missions by a tag (case insensitive)
 * @param {Array} missions - array of mission objects
 * @param {string} tag - tag to filter by
 * @returns {Array} filtered missions
 */
export function filterMissionsByTag(missions, tag) {
    if (!tag) return missions;
    const lowerTag = tag.toLowerCase();
    return missions.filter(
        mission => mission.tags?.some(t => t.toLowerCase() === lowerTag)
    );
}

/**
 * Returns score and financial data for a drink and mission
 * @param {Array} mixGlass - array of ingredient objects
 * @param {Object} mission - mission object
 * @returns {Object} score and financial breakdown
 */
// GameLogic.js
// … your other imports and exports remain unchanged …

/**
 * Returns score and financial data based on how many drinks were served.
 * @param {number} drinksServed – number of successful serves this day
 */
export function getScoreData(drinksServed = 0) {
    const basePrice = 20;             // $20 per drink
    const moneyEarned = drinksServed * basePrice;
    const boozeCost   = 20 + Math.floor(Math.random() * 81); // you can keep these random
    const rentCost    = 500;
    const foodCost    = 70;
    const totalCost   = rentCost + boozeCost + foodCost;
    return {
        moneyEarned,
        boozeCost,
        rentCost,
        foodCost,
        totalCost,
        net: moneyEarned - totalCost,
    };
}
