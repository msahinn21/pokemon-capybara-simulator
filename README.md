# Pokemon Capybara Simulator

A Pokemon-style game simulator inspired by Capybara Go with chapter progression, battle simulation, and detailed analytics. This simulator allows you to prototype and test game mechanics for a Pokemon-like game with a chapter/day progression system.

## Features

- **Chapter & Day Configuration**: Create custom chapters with different difficulty levels and day counts
- **Pokemon Creation & Evolution**: Design your own Pokemon with custom stats, evolution chains, and rarity types
- **Event System**: Configure various event types like battles, treasures, shops, and random encounters
- **Battle Simulation**: Turn-based battle system with party mechanics (up to 3v3)
- **Progression System**: Pokemon catching, leveling up, and evolution mechanics
- **Real Player Time Estimation**: Calculates how long a real player would take to complete the game (each in-game day = 2 seconds of real player time)
- **Detailed Analytics**: Comprehensive stats and metrics about gameplay progression
- **Data Export**: Export simulation results to Excel for further analysis

## Demo

When you first launch the application, a sample game configuration is loaded with:
- 3 chapters (Pallet Town, Viridian City, Pewter City)
- 11 Pokemon (including evolutionary chains for starters)
- Various event types
- Pre-configured simulation settings

This allows you to quickly run a simulation to see how the system works before creating your own configurations.

## Usage Guide

### Game Configuration Tab

1. **Simulation Settings**: Configure auto-run and simulation speed
2. **Chapter Configuration**: Create new chapters with custom parameters:
   - Name
   - Days (how many days the chapter lasts)
   - Difficulty Multiplier (affects combat difficulty)
   - Required Power (power needed to complete the chapter)
3. **Event Configuration**: Add various events to each chapter:
   - Battle events (standard, trainer, boss battles)
   - Shop events (for upgrading Pokemon)
   - Treasure events (for rewards)
   - Random encounters

### Pokemon Editor Tab

1. **Create Pokemon**: Design new Pokemon with custom:
   - Base stats (HP, ATK, DEF)
   - Level
   - Rarity
   - Evolution type and chain
2. **Power Weighting**: Adjust how different stats contribute to a Pokemon's total power
3. **Edit Existing Pokemon**: Modify any Pokemon's attributes
4. **Evolution Chains**: Link Pokemon together in evolution chains

### Run Simulation Tab

1. **Start/Stop Controls**: Begin or halt the simulation process
2. **Progress Tracking**: View real-time updates on:
   - Current chapter and day
   - Party power vs. required power
3. **Live Log**: Watch detailed logs of what's happening during simulation:
   - Battles
   - Treasures found
   - Pokemon caught
   - Level ups and evolutions

### Results Tab

1. **Key Metrics**: View critical stats like:
   - Total in-game days played
   - Estimated real player time (based on 2 seconds per in-game day)
   - Chapters completed
   - Battle win rate
   - Pokemon caught/evolved
2. **Detailed Analysis**: Explore comprehensive data:
   - Power progression over time
   - Chapter completion results
   - Battle logs
   - Time-based metrics
3. **Data Export**: Download all results as an Excel file for further analysis

## How It Works

The simulator uses a turn-based system to model game progression:

1. **Chapter Progression**: Players advance through configured chapters day by day
2. **Daily Events**: Each day triggers random events from the chapter's event pool
3. **Power Growth**: Players gain power by:
   - Winning battles
   - Catching new Pokemon
   - Leveling up existing Pokemon
   - Evolving Pokemon (combining 3 of the same type)
4. **Chapter Completion**: A chapter is completed when:
   - All days are passed AND
   - The player's party power exceeds the required power
5. **Failure Cases**: If power requirements aren't met, the player:
   - Keeps their progress (gold, Pokemon)
   - Restarts the current chapter to try again
6. **Real Player Time**: Each in-game day is estimated to take 2 seconds of real player time

## Combat System

The battle system uses these mechanics:

- **Turn-Based Combat**: Player and enemies take turns attacking
- **Damage Calculation**: Based on ATK of attacker and DEF of defender
- **Party System**: Up to 3 Pokemon per side
- **Pokemon Capture**: Chance to catch defeated Pokemon
- **Battle Rewards**: Gold from victories, used for upgrades

## Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Technologies

- React
- Material UI
- UUID for entity generation
- XLSX for Excel export
- File-Saver for download functionality

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue if you have suggestions for improvements or find bugs.

## License

MIT License