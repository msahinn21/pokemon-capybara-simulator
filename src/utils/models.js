import { v4 as uuidv4 } from 'uuid';

// Pokemon rarity types
export const RARITY_TYPES = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
};

// Pokemon evolution types
export const EVOLUTION_TYPES = {
  BASIC: 'Basic',
  STAGE1: 'Stage 1',
  STAGE2: 'Stage 2',
  MEGA: 'Mega',
};

// Event types
export const EVENT_TYPES = {
  BATTLE: 'Battle',
  TREASURE: 'Treasure',
  SHOP: 'Shop',
  RANDOM_ENCOUNTER: 'Random Encounter',
  BOSS_BATTLE: 'Boss Battle',
  TRAINER_BATTLE: 'Trainer Battle',
};

// Constants for time calculation
export const TIME_CONSTANTS = {
  SECONDS_PER_DAY: 2, // Each in-game day takes 2 seconds of real player time
};

/**
 * Creates a new Pokemon object
 */
export const createPokemon = ({
  name = 'New Pokemon',
  hp = 100,
  atk = 10,
  def = 10,
  level = 1,
  rarity = RARITY_TYPES.COMMON,
  evolutionType = EVOLUTION_TYPES.BASIC,
  evolvesFrom = null,
  evolvesTo = null,
}) => {
  const hpWeight = 0.5;
  const atkWeight = 1.0;
  const defWeight = 0.7;
  
  // Calculate total power using the formula: sqrt((hp*hpWeight) + (atk*atkWeight) + (def*defWeight) * hp)
  const totalPower = Math.sqrt((hp * hpWeight) + (atk * atkWeight) + (def * defWeight) * hp);
  
  return {
    id: uuidv4(),
    name,
    hp,
    atk,
    def,
    level,
    rarity,
    evolutionType,
    evolvesFrom,
    evolvesTo,
    totalPower: Math.round(totalPower * 100) / 100,
    hpWeight,
    atkWeight,
    defWeight,
  };
};

/**
 * Creates a new Chapter object
 */
export const createChapter = ({
  name = 'New Chapter',
  difficultyMultiplier = 1.0,
  days = 5,
  requiredPowerToComplete = 100,
}) => {
  return {
    id: uuidv4(),
    name,
    difficultyMultiplier,
    days,
    requiredPowerToComplete,
    events: [],
  };
};

/**
 * Creates a new Event object
 */
export const createEvent = ({
  name = 'New Event',
  type = EVENT_TYPES.BATTLE,
  description = '',
  rewardGold = 0,
  rewardItems = [],
  pokemonEncounter = null,
  difficultyMultiplier = 1.0,
}) => {
  return {
    id: uuidv4(),
    name,
    type,
    description,
    rewardGold: parseInt(rewardGold, 10),
    rewardItems,
    pokemonEncounter,
    difficultyMultiplier: parseFloat(difficultyMultiplier),
  };
};

/**
 * Creates a default party of Pokemon
 */
export const createDefaultParty = (availablePokemons = []) => {
  // If no pokemons available, create at least one basic one
  if (availablePokemons.length === 0) {
    return [
      createPokemon({
        name: 'Starter Pokemon',
        hp: 100,
        atk: 15,
        def: 10,
        level: 1,
      }),
    ];
  }
  
  // Otherwise, select up to 3 of the available Pokemon for the party
  return availablePokemons.slice(0, 3);
};

/**
 * Creates a new Player object
 */
export const createPlayer = (initialParty = []) => {
  return {
    gold: 100,
    party: initialParty.length > 0 ? initialParty : createDefaultParty(),
    inventory: [],
    currentChapter: 0,
    currentDay: 1,
    totalPlaytime: 0, // in seconds
    chaptersCompleted: 0,
    totalBattles: 0,
    battlesWon: 0,
    battlesLost: 0,
    pokemonCaught: 0,
    pokemonEvolved: 0,
  };
};

/**
 * Creates a new Simulation Results object
 */
export const createSimulationResults = () => {
  return {
    // Simulation time (actual time taken to run the simulation)
    totalPlaytimeSeconds: 0,
    totalPlaytimeMinutes: 0,
    totalPlaytimeHours: 0,
    totalPlaytimeDays: 0,
    
    // Real player time (estimated time a real player would spend)
    realPlayerTimeSeconds: 0,
    realPlayerTimeMinutes: 0,
    realPlayerTimeHours: 0,
    realPlayerTimeDays: 0,
    totalGameDays: 0, // Total number of in-game days played
    
    // Game progress statistics
    chaptersCompleted: 0,
    highestChapterReached: 0,
    highestDayReached: 0,
    totalPokemonCaught: 0,
    totalPokemonEvolved: 0,
    totalBattles: 0,
    battlesWon: 0,
    battlesLost: 0,
    goldEarned: 0,
    goldSpent: 0,
    itemsFound: 0,
    itemsUsed: 0,
    totalPowerProgression: [], // Array of {day, totalPower} objects to track power over time
    chapterProgression: [], // Array of {chapter, day, result} objects
    battleLog: [], // Detailed log of battles for analysis
  };
};