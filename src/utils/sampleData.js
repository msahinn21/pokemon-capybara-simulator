import { createPokemon, createChapter, createEvent, EVENT_TYPES, RARITY_TYPES, EVOLUTION_TYPES } from './models';
import { v4 as uuidv4 } from 'uuid';

// Create sample Pokemon data
export const getSamplePokemons = () => {
  // Basic Evolution Chain: Bulbasaur -> Ivysaur -> Venusaur
  const bulbasaur = createPokemon({
    name: 'Bulbasaur',
    hp: 100,
    atk: 15,
    def: 15,
    level: 1,
    rarity: RARITY_TYPES.COMMON,
    evolutionType: EVOLUTION_TYPES.BASIC,
    evolvesFrom: null,
    evolvesTo: 'Ivysaur'
  });
  
  const ivysaur = createPokemon({
    name: 'Ivysaur',
    hp: 160,
    atk: 24,
    def: 24,
    level: 16,
    rarity: RARITY_TYPES.UNCOMMON,
    evolutionType: EVOLUTION_TYPES.STAGE1,
    evolvesFrom: 'Bulbasaur',
    evolvesTo: 'Venusaur'
  });
  
  const venusaur = createPokemon({
    name: 'Venusaur',
    hp: 230,
    atk: 38,
    def: 38,
    level: 32,
    rarity: RARITY_TYPES.RARE,
    evolutionType: EVOLUTION_TYPES.STAGE2,
    evolvesFrom: 'Ivysaur',
    evolvesTo: null
  });
  
  // Basic Evolution Chain: Charmander -> Charmeleon -> Charizard
  const charmander = createPokemon({
    name: 'Charmander',
    hp: 90,
    atk: 18,
    def: 12,
    level: 1,
    rarity: RARITY_TYPES.COMMON,
    evolutionType: EVOLUTION_TYPES.BASIC,
    evolvesFrom: null,
    evolvesTo: 'Charmeleon'
  });
  
  const charmeleon = createPokemon({
    name: 'Charmeleon',
    hp: 150,
    atk: 28,
    def: 20,
    level: 16,
    rarity: RARITY_TYPES.UNCOMMON,
    evolutionType: EVOLUTION_TYPES.STAGE1,
    evolvesFrom: 'Charmander',
    evolvesTo: 'Charizard'
  });
  
  const charizard = createPokemon({
    name: 'Charizard',
    hp: 220,
    atk: 44,
    def: 34,
    level: 36,
    rarity: RARITY_TYPES.RARE,
    evolutionType: EVOLUTION_TYPES.STAGE2,
    evolvesFrom: 'Charmeleon',
    evolvesTo: null
  });
  
  // Basic Evolution Chain: Squirtle -> Wartortle -> Blastoise
  const squirtle = createPokemon({
    name: 'Squirtle',
    hp: 110,
    atk: 14,
    def: 20,
    level: 1,
    rarity: RARITY_TYPES.COMMON,
    evolutionType: EVOLUTION_TYPES.BASIC,
    evolvesFrom: null,
    evolvesTo: 'Wartortle'
  });
  
  const wartortle = createPokemon({
    name: 'Wartortle',
    hp: 170,
    atk: 22,
    def: 32,
    level: 16,
    rarity: RARITY_TYPES.UNCOMMON,
    evolutionType: EVOLUTION_TYPES.STAGE1,
    evolvesFrom: 'Squirtle',
    evolvesTo: 'Blastoise'
  });
  
  const blastoise = createPokemon({
    name: 'Blastoise',
    hp: 240,
    atk: 34,
    def: 48,
    level: 36,
    rarity: RARITY_TYPES.RARE,
    evolutionType: EVOLUTION_TYPES.STAGE2,
    evolvesFrom: 'Wartortle',
    evolvesTo: null
  });
  
  // Some other Pokemon
  const pikachu = createPokemon({
    name: 'Pikachu',
    hp: 85,
    atk: 20,
    def: 10,
    level: 5,
    rarity: RARITY_TYPES.UNCOMMON,
    evolutionType: EVOLUTION_TYPES.BASIC,
    evolvesFrom: null,
    evolvesTo: 'Raichu'
  });
  
  const raichu = createPokemon({
    name: 'Raichu',
    hp: 160,
    atk: 40,
    def: 25,
    level: 20,
    rarity: RARITY_TYPES.RARE,
    evolutionType: EVOLUTION_TYPES.STAGE1,
    evolvesFrom: 'Pikachu',
    evolvesTo: null
  });
  
  return [
    bulbasaur,
    ivysaur,
    venusaur,
    charmander,
    charmeleon,
    charizard,
    squirtle,
    wartortle,
    blastoise,
    pikachu,
    raichu
  ];
};

// Create sample events
export const getSampleEvents = () => {
  return [
    createEvent({
      name: 'Wild Pokemon Battle',
      type: EVENT_TYPES.BATTLE,
      description: 'A wild Pokemon appears!',
      rewardGold: 25,
      difficultyMultiplier: 1.0
    }),
    
    createEvent({
      name: 'Trainer Battle',
      type: EVENT_TYPES.TRAINER_BATTLE,
      description: 'A Pokemon trainer challenges you!',
      rewardGold: 50,
      difficultyMultiplier: 1.2
    }),
    
    createEvent({
      name: 'Gym Leader Battle',
      type: EVENT_TYPES.BOSS_BATTLE,
      description: 'A gym leader wants to test your skills!',
      rewardGold: 100,
      difficultyMultiplier: 1.5
    }),
    
    createEvent({
      name: 'Pokemon Center',
      type: EVENT_TYPES.SHOP,
      description: 'Visit the Pokemon Center to heal your Pokemon and buy items',
      rewardGold: 0,
      difficultyMultiplier: 0
    }),
    
    createEvent({
      name: 'Hidden Treasure',
      type: EVENT_TYPES.TREASURE,
      description: 'You found a hidden treasure chest!',
      rewardGold: 75,
      difficultyMultiplier: 0
    }),
    
    createEvent({
      name: 'Random Encounter',
      type: EVENT_TYPES.RANDOM_ENCOUNTER,
      description: 'Something unusual happens...',
      rewardGold: 15,
      difficultyMultiplier: 0.8
    })
  ];
};

// Create sample chapters
export const getSampleChapters = () => {
  const sampleEvents = getSampleEvents();
  
  // Chapter 1: Pallet Town
  const chapter1 = createChapter({
    name: 'Pallet Town',
    difficultyMultiplier: 1.0,
    days: 5,
    requiredPowerToComplete: 50
  });
  
  chapter1.events = [
    sampleEvents[0], // Wild Pokemon Battle
    sampleEvents[4], // Hidden Treasure
    sampleEvents[5]  // Random Encounter
  ];
  
  // Chapter 2: Viridian City
  const chapter2 = createChapter({
    name: 'Viridian City',
    difficultyMultiplier: 1.2,
    days: 7,
    requiredPowerToComplete: 100
  });
  
  chapter2.events = [
    sampleEvents[0], // Wild Pokemon Battle
    sampleEvents[1], // Trainer Battle
    sampleEvents[3], // Pokemon Center
    sampleEvents[5]  // Random Encounter
  ];
  
  // Chapter 3: Pewter City
  const chapter3 = createChapter({
    name: 'Pewter City',
    difficultyMultiplier: 1.4,
    days: 10,
    requiredPowerToComplete: 200
  });
  
  chapter3.events = [
    sampleEvents[0], // Wild Pokemon Battle
    sampleEvents[1], // Trainer Battle
    sampleEvents[2], // Gym Leader Battle
    sampleEvents[3], // Pokemon Center
    sampleEvents[4], // Hidden Treasure
    sampleEvents[5]  // Random Encounter
  ];
  
  return [chapter1, chapter2, chapter3];
};

// Create complete sample game config
export const getSampleGameConfig = () => {
  return {
    chapters: getSampleChapters(),
    pokemons: getSamplePokemons(),
    simulationConfig: {
      autoRun: true,
      speed: 2
    }
  };
};