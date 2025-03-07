import { createSimulationResults, TIME_CONSTANTS } from './models';

/**
 * Runs a complete game simulation based on the provided configuration
 * 
 * @param {Object} gameConfig - The complete game configuration
 * @param {Function} updateProgress - Callback to update simulation progress
 * @param {Function} updateLog - Callback to update simulation log
 * @returns {Promise<Object>} Simulation results
 */
export const runSimulation = async (gameConfig, updateProgress = () => {}, updateLog = () => {}) => {
  const { chapters, pokemons, simulationConfig } = gameConfig;
  
  if (!chapters || chapters.length === 0) {
    throw new Error('No chapters configured for simulation');
  }
  
  if (!pokemons || pokemons.length === 0) {
    throw new Error('No pokemons configured for simulation');
  }
  
  const results = createSimulationResults();
  const startTime = Date.now();
  const player = {
    gold: 100,
    party: [pokemons[0]], // Start with first pokemon
    inventory: [],
    currentChapter: 0,
    currentDay: 1,
    pokemonCaught: 0,
    pokemonEvolved: 0,
    totalGameDays: 0, // Track total days played for real player time calculation
  };
  
  updateLog('Simulation started');
  updateLog(`Starting with Pokemon: ${player.party[0].name}`);
  
  let isGameOver = false;
  
  // Loop through chapters
  while (!isGameOver && player.currentChapter < chapters.length) {
    const chapter = chapters[player.currentChapter];
    updateLog(`Starting Chapter ${player.currentChapter + 1}: ${chapter.name}`);
    
    // Reset day counter for new chapter
    player.currentDay = 1;
    
    // Loop through days in the chapter
    while (player.currentDay <= chapter.days && !isGameOver) {
      updateLog(`Day ${player.currentDay} of Chapter ${player.currentChapter + 1}`);
      
      // Increment total game days - Each day is TIME_CONSTANTS.SECONDS_PER_DAY seconds of real player time
      player.totalGameDays++;
      
      // Process events for the day
      processEvents(player, chapter, results, updateLog);
      
      // Update progression tracking
      results.totalPowerProgression.push({
        chapter: player.currentChapter + 1,
        day: player.currentDay,
        totalPower: calculatePartyPower(player.party)
      });
      
      // Check if player can advance
      if (player.currentDay >= chapter.days) {
        // Check if player has enough power to complete chapter
        const partyPower = calculatePartyPower(player.party);
        
        if (partyPower >= chapter.requiredPowerToComplete) {
          // Complete chapter
          results.chaptersCompleted++;
          results.chapterProgression.push({
            chapter: player.currentChapter + 1,
            day: player.currentDay,
            result: 'completed'
          });
          
          updateLog(`Chapter ${player.currentChapter + 1} completed! Party power: ${partyPower}`);
          
          // Move to next chapter
          player.currentChapter++;
          
          // If completed all chapters, end game
          if (player.currentChapter >= chapters.length) {
            isGameOver = true;
            updateLog('All chapters completed! Game finished.');
          }
        } else {
          // Failed to complete chapter
          results.chapterProgression.push({
            chapter: player.currentChapter + 1,
            day: player.currentDay,
            result: 'failed'
          });
          
          updateLog(`Failed to complete Chapter ${player.currentChapter + 1}. Required power: ${chapter.requiredPowerToComplete}, Current power: ${partyPower}`);
          
          // Try to upgrade party
          upgradeParty(player, pokemons, updateLog);
          
          // Reset day counter to try again
          player.currentDay = 1;
        }
      } else {
        // Move to next day
        player.currentDay++;
      }
      
      // Update progress
      const progress = {
        chapter: player.currentChapter + 1,
        totalChapters: chapters.length,
        day: player.currentDay,
        currentPower: calculatePartyPower(player.party),
        requiredPower: chapter.requiredPowerToComplete,
        totalGameDays: player.totalGameDays
      };
      
      updateProgress(progress);
      
      // Add some delay if configured (for visualization)
      if (simulationConfig?.speed) {
        const delay = Math.floor(1000 / simulationConfig.speed);
        await sleep(delay);
      }
    }
  }
  
  // Calculate final results for simulation time
  const endTime = Date.now();
  const totalPlaytimeSeconds = Math.floor((endTime - startTime) / 1000);
  
  results.totalPlaytimeSeconds = totalPlaytimeSeconds;
  results.totalPlaytimeMinutes = Math.floor(totalPlaytimeSeconds / 60);
  results.totalPlaytimeHours = Math.floor(totalPlaytimeSeconds / 3600);
  results.totalPlaytimeDays = Math.floor(totalPlaytimeSeconds / 86400);
  
  // Calculate real player time (based on 2 seconds per in-game day)
  results.totalGameDays = player.totalGameDays;
  const realPlayerTimeSeconds = player.totalGameDays * TIME_CONSTANTS.SECONDS_PER_DAY;
  
  results.realPlayerTimeSeconds = realPlayerTimeSeconds;
  results.realPlayerTimeMinutes = Math.floor(realPlayerTimeSeconds / 60);
  results.realPlayerTimeHours = Math.floor(realPlayerTimeSeconds / 3600);
  results.realPlayerTimeDays = Math.floor(realPlayerTimeSeconds / 86400);
  
  // Add other statistics
  results.highestChapterReached = player.currentChapter;
  results.highestDayReached = player.currentDay;
  results.totalPokemonCaught = player.pokemonCaught;
  results.totalPokemonEvolved = player.pokemonEvolved;
  
  updateLog('Simulation completed');
  updateLog(`Total in-game days: ${player.totalGameDays}`);
  updateLog(`Estimated real player time: ${formatTime(realPlayerTimeSeconds)}`);
  
  return results;
};

// Helper function to format time nicely
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  let result = '';
  if (hours > 0) result += `${hours} hour${hours !== 1 ? 's' : ''} `;
  if (minutes > 0) result += `${minutes} minute${minutes !== 1 ? 's' : ''} `;
  if (seconds > 0 || (hours === 0 && minutes === 0)) result += `${seconds} second${seconds !== 1 ? 's' : ''}`;
  
  return result.trim();
};

// Helper function for sleep
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Process events for the current day in the chapter
 */
function processEvents(player, chapter, results, updateLog) {
  // Randomly select events from the chapter
  const numEvents = Math.floor(Math.random() * 3) + 1; // 1-3 events per day
  
  for (let i = 0; i < numEvents; i++) {
    if (chapter.events && chapter.events.length > 0) {
      // Randomly select an event
      const eventIndex = Math.floor(Math.random() * chapter.events.length);
      const event = chapter.events[eventIndex];
      
      updateLog(`Event: ${event.name} (${event.type})`);
      
      // Process the event based on its type
      switch (event.type) {
        case 'Battle':
        case 'Boss Battle':
        case 'Trainer Battle':
          processBattleEvent(player, event, results, updateLog);
          break;
        
        case 'Treasure':
          processTreasureEvent(player, event, results, updateLog);
          break;
        
        case 'Shop':
          processShopEvent(player, event, results, updateLog);
          break;
        
        case 'Random Encounter':
          processRandomEncounterEvent(player, event, results, updateLog);
          break;
        
        default:
          updateLog(`Unknown event type: ${event.type}`);
      }
    }
  }
}

/**
 * Process a battle event
 */
function processBattleEvent(player, event, results, updateLog) {
  results.totalBattles++;
  
  // Create enemy party
  const enemyParty = [];
  if (event.pokemonEncounter) {
    enemyParty.push(event.pokemonEncounter);
  } else {
    // Generate a random enemy with power scaled to player's party
    const partyPower = calculatePartyPower(player.party);
    const enemyPower = partyPower * event.difficultyMultiplier;
    
    // Create a simple enemy with that approximate power
    const enemyPokemon = {
      name: `Wild ${['Pikachu', 'Charmander', 'Bulbasaur', 'Squirtle', 'Pidgey'][Math.floor(Math.random() * 5)]}`,
      hp: Math.floor(enemyPower * 10),
      atk: Math.floor(enemyPower),
      def: Math.floor(enemyPower * 0.5),
      level: Math.floor(enemyPower / 10) + 1
    };
    
    enemyParty.push(enemyPokemon);
  }
  
  updateLog(`Battle started against ${enemyParty.map(p => p.name).join(', ')}`);
  
  // Simulate battle
  const battleResult = simulateBattle(player.party, enemyParty, updateLog);
  
  if (battleResult.playerWon) {
    results.battlesWon++;
    updateLog('Battle won!');
    
    // Award rewards
    player.gold += event.rewardGold;
    results.goldEarned += event.rewardGold;
    updateLog(`Earned ${event.rewardGold} gold`);
    
    // Chance to capture enemy Pokemon
    if (Math.random() < 0.3) { // 30% chance
      const capturedPokemon = { ...enemyParty[0] };
      player.party.push(capturedPokemon);
      player.pokemonCaught++;
      results.totalPokemonCaught++;
      updateLog(`Captured ${capturedPokemon.name}!`);
      
      // Limit party size to 3
      if (player.party.length > 3) {
        const removed = player.party.shift();
        updateLog(`Party full. Released ${removed.name}.`);
      }
    }
  } else {
    results.battlesLost++;
    updateLog('Battle lost!');
    
    // Lose some gold
    const goldLost = Math.min(player.gold, Math.floor(event.rewardGold / 2));
    player.gold -= goldLost;
    updateLog(`Lost ${goldLost} gold`);
  }
  
  // Log the battle details
  results.battleLog.push({
    playerParty: [...player.party],
    enemyParty: [...enemyParty],
    result: battleResult.playerWon ? 'win' : 'lose',
    rounds: battleResult.rounds
  });
}

/**
 * Simulate a turn-based battle between two parties
 */
function simulateBattle(playerParty, enemyParty, updateLog) {
  let rounds = 0;
  const maxRounds = 50; // Prevent infinite battles
  
  // Deep clone parties to avoid modifying originals during battle simulation
  const playerPokemon = JSON.parse(JSON.stringify(playerParty));
  const enemyPokemon = JSON.parse(JSON.stringify(enemyParty));
  
  while (true) {
    rounds++;
    
    // Player attack phase
    for (const pokemon of playerPokemon) {
      if (pokemon.hp <= 0) continue; // Skip fainted Pokemon
      
      // Select target (first non-fainted enemy)
      const target = enemyPokemon.find(p => p.hp > 0);
      if (!target) break; // All enemies defeated
      
      // Calculate damage
      const damage = Math.max(1, Math.floor(pokemon.atk - (target.def * 0.5)));
      target.hp -= damage;
      
      updateLog(`${pokemon.name} attacks ${target.name} for ${damage} damage`);
      
      if (target.hp <= 0) {
        updateLog(`${target.name} fainted!`);
        // Check if all enemies are defeated
        if (enemyPokemon.every(p => p.hp <= 0)) {
          return { playerWon: true, rounds };
        }
      }
    }
    
    // Enemy attack phase
    for (const pokemon of enemyPokemon) {
      if (pokemon.hp <= 0) continue; // Skip fainted Pokemon
      
      // Select target (first non-fainted player Pokemon)
      const target = playerPokemon.find(p => p.hp > 0);
      if (!target) break; // All player Pokemon defeated
      
      // Calculate damage
      const damage = Math.max(1, Math.floor(pokemon.atk - (target.def * 0.5)));
      target.hp -= damage;
      
      updateLog(`${pokemon.name} attacks ${target.name} for ${damage} damage`);
      
      if (target.hp <= 0) {
        updateLog(`${target.name} fainted!`);
        // Check if all player Pokemon are defeated
        if (playerPokemon.every(p => p.hp <= 0)) {
          return { playerWon: false, rounds };
        }
      }
    }
    
    // Check for battle timeout
    if (rounds >= maxRounds) {
      updateLog('Battle timed out.');
      // Determine winner based on remaining HP percentage
      const playerHpPercent = calculatePartyRemainingHpPercent(playerPokemon);
      const enemyHpPercent = calculatePartyRemainingHpPercent(enemyPokemon);
      
      return { playerWon: playerHpPercent >= enemyHpPercent, rounds };
    }
  }
}

/**
 * Calculate the percentage of HP remaining in a party
 */
function calculatePartyRemainingHpPercent(party) {
  const totalMaxHp = party.reduce((sum, pokemon) => sum + pokemon.maxHp || pokemon.hp, 0);
  const totalCurrentHp = party.reduce((sum, pokemon) => sum + Math.max(0, pokemon.hp), 0);
  
  return totalCurrentHp / totalMaxHp;
}

/**
 * Process a treasure event
 */
function processTreasureEvent(player, event, results, updateLog) {
  updateLog('Found a treasure chest!');
  
  // Award gold
  player.gold += event.rewardGold;
  results.goldEarned += event.rewardGold;
  updateLog(`Found ${event.rewardGold} gold`);
  
  // Add items if any
  if (event.rewardItems && event.rewardItems.length > 0) {
    for (const item of event.rewardItems) {
      player.inventory.push(item);
      results.itemsFound++;
      updateLog(`Found item: ${item.name}`);
    }
  }
}

/**
 * Process a shop event
 */
function processShopEvent(player, event, results, updateLog) {
  updateLog('Entered a Pokemon shop');
  
  // Chance to upgrade a Pokemon if player has enough gold
  if (player.party.length > 0 && player.gold >= 50) {
    const pokemonToUpgrade = player.party[Math.floor(Math.random() * player.party.length)];
    const upgradeCost = 50 * pokemonToUpgrade.level;
    
    if (player.gold >= upgradeCost) {
      // Level up the Pokemon
      pokemonToUpgrade.level += 1;
      pokemonToUpgrade.hp += 10;
      pokemonToUpgrade.atk += 2;
      pokemonToUpgrade.def += 1;
      
      player.gold -= upgradeCost;
      results.goldSpent += upgradeCost;
      
      updateLog(`Upgraded ${pokemonToUpgrade.name} to level ${pokemonToUpgrade.level} for ${upgradeCost} gold`);
    } else {
      updateLog(`Not enough gold to upgrade Pokemon. Need ${upgradeCost} gold.`);
    }
  } else {
    updateLog('Nothing to buy at the shop.');
  }
}

/**
 * Process a random encounter event
 */
function processRandomEncounterEvent(player, event, results, updateLog) {
  updateLog('Random encounter!');
  
  // 50% chance for a beneficial event, 50% chance for a detrimental event
  if (Math.random() < 0.5) {
    // Beneficial event
    const goldFound = Math.floor(Math.random() * 30) + 10;
    player.gold += goldFound;
    results.goldEarned += goldFound;
    
    updateLog(`Found ${goldFound} gold on the ground!`);
  } else {
    // Detrimental event
    const goldLost = Math.min(player.gold, Math.floor(Math.random() * 20) + 5);
    player.gold -= goldLost;
    
    updateLog(`Lost ${goldLost} gold in a mishap!`);
  }
}

/**
 * Calculate the total power of a party
 */
function calculatePartyPower(party) {
  return party.reduce((total, pokemon) => {
    // If pokemon has totalPower property, use that
    if (pokemon.totalPower) {
      return total + pokemon.totalPower;
    }
    
    // Otherwise calculate it
    const hpWeight = pokemon.hpWeight || 0.5;
    const atkWeight = pokemon.atkWeight || 1.0;
    const defWeight = pokemon.defWeight || 0.7;
    
    const power = Math.sqrt((pokemon.hp * hpWeight) + (pokemon.atk * atkWeight) + (pokemon.def * defWeight) * pokemon.hp);
    return total + power;
  }, 0);
}

/**
 * Attempt to upgrade the player's party using available gold and caught Pokemon
 */
function upgradeParty(player, allPokemons, updateLog) {
  updateLog('Trying to upgrade party...');
  
  // Try to level up existing Pokemon
  for (const pokemon of player.party) {
    const levelUpCost = 50 * pokemon.level;
    
    if (player.gold >= levelUpCost) {
      // Level up the Pokemon
      pokemon.level += 1;
      pokemon.hp += 10;
      pokemon.atk += 2;
      pokemon.def += 1;
      
      // Recalculate total power
      const hpWeight = pokemon.hpWeight || 0.5;
      const atkWeight = pokemon.atkWeight || 1.0;
      const defWeight = pokemon.defWeight || 0.7;
      
      pokemon.totalPower = Math.sqrt((pokemon.hp * hpWeight) + (pokemon.atk * atkWeight) + (pokemon.def * defWeight) * pokemon.hp);
      
      player.gold -= levelUpCost;
      
      updateLog(`Upgraded ${pokemon.name} to level ${pokemon.level} for ${levelUpCost} gold`);
    }
  }
  
  // Check for evolution opportunities
  // For this simple simulation, we just check if there are any pokemon of the same name
  // In a real game, this would be more complex
  const pokemonCounts = {};
  
  for (const pokemon of player.party) {
    pokemonCounts[pokemon.name] = (pokemonCounts[pokemon.name] || 0) + 1;
    
    // If we have 3 of the same Pokemon, evolve it
    if (pokemonCounts[pokemon.name] >= 3) {
      // Find the Pokemon that this evolves to
      const evolution = allPokemons.find(p => p.evolvesFrom === pokemon.name);
      
      if (evolution) {
        // Remove all 3 of the base Pokemon
        player.party = player.party.filter(p => p.name !== pokemon.name);
        
        // Add the evolved form
        player.party.push({...evolution});
        
        player.pokemonEvolved++;
        
        updateLog(`Evolved 3x ${pokemon.name} into ${evolution.name}!`);
        break;
      }
    }
  }
};