import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exports simulation results to Excel file
 * 
 * @param {Object} results - Simulation results object
 * @param {String} filename - Name of the file to save
 */
export const exportToExcel = (results, filename = 'simulation-results.xlsx') => {
  const workbook = XLSX.utils.book_new();
  
  // Create summary sheet
  const summaryData = [
    ['Pokemon Capybara Simulator - Results Summary'],
    [''],
    ['Time Statistics'],
    ['Total In-Game Days', results.totalGameDays],
    [''],
    ['Real Player Time (estimated)'],
    ['Total Real Player Time (seconds)', results.realPlayerTimeSeconds],
    ['Total Real Player Time (minutes)', results.realPlayerTimeMinutes],
    ['Total Real Player Time (hours)', results.realPlayerTimeHours],
    ['Total Real Player Time (days)', results.realPlayerTimeDays],
    [''],
    ['Simulation Time (actual)'],
    ['Total Simulation Time (seconds)', results.totalPlaytimeSeconds],
    ['Total Simulation Time (minutes)', results.totalPlaytimeMinutes],
    ['Total Simulation Time (hours)', results.totalPlaytimeHours],
    [''],
    ['Progress Statistics'],
    ['Chapters Completed', results.chaptersCompleted],
    ['Highest Chapter Reached', results.highestChapterReached],
    ['Highest Day Reached', results.highestDayReached],
    [''],
    ['Combat Statistics'],
    ['Total Battles', results.totalBattles],
    ['Battles Won', results.battlesWon],
    ['Battles Lost', results.battlesLost],
    ['Win Rate (%)', results.totalBattles > 0 ? (results.battlesWon / results.totalBattles * 100).toFixed(2) : 0],
    ['Battles Per Day (Average)', results.totalGameDays > 0 ? (results.totalBattles / results.totalGameDays).toFixed(2) : 0],
    [''],
    ['Pokemon Statistics'],
    ['Total Pokemon Caught', results.totalPokemonCaught],
    ['Total Pokemon Evolved', results.totalPokemonEvolved],
    [''],
    ['Economy Statistics'],
    ['Gold Earned', results.goldEarned],
    ['Gold Spent', results.goldSpent],
    ['Net Gold', results.goldEarned - results.goldSpent],
    ['Gold Per Day (Average)', results.totalGameDays > 0 ? (results.goldEarned / results.totalGameDays).toFixed(2) : 0],
    [''],
    ['Item Statistics'],
    ['Items Found', results.itemsFound],
    ['Items Used', results.itemsUsed]
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Create power progression sheet
  if (results.totalPowerProgression && results.totalPowerProgression.length > 0) {
    const powerData = [
      ['Chapter', 'Day', 'Total Power', 'Estimated Time (seconds)', 'Estimated Time (min:sec)']
    ];
    
    results.totalPowerProgression.forEach((entry, index) => {
      const estimatedSeconds = index * 2; // Each day takes 2 seconds of real player time
      const minutes = Math.floor(estimatedSeconds / 60);
      const seconds = estimatedSeconds % 60;
      
      powerData.push([
        entry.chapter,
        entry.day,
        entry.totalPower,
        estimatedSeconds,
        `${minutes}:${seconds.toString().padStart(2, '0')}`
      ]);
    });
    
    const powerSheet = XLSX.utils.aoa_to_sheet(powerData);
    XLSX.utils.book_append_sheet(workbook, powerSheet, 'Power Progression');
  }
  
  // Create chapter progression sheet
  if (results.chapterProgression && results.chapterProgression.length > 0) {
    const chapterData = [
      ['Chapter', 'Day', 'Result', 'Estimated Time (seconds)', 'Estimated Time (min:sec)']
    ];
    
    let cumulativeDays = 0;
    
    for (const entry of results.chapterProgression) {
      cumulativeDays += entry.day;
      const estimatedSeconds = cumulativeDays * 2; // Each day takes 2 seconds of real player time
      const minutes = Math.floor(estimatedSeconds / 60);
      const seconds = estimatedSeconds % 60;
      
      chapterData.push([
        entry.chapter,
        entry.day,
        entry.result,
        estimatedSeconds,
        `${minutes}:${seconds.toString().padStart(2, '0')}`
      ]);
    }
    
    const chapterSheet = XLSX.utils.aoa_to_sheet(chapterData);
    XLSX.utils.book_append_sheet(workbook, chapterSheet, 'Chapter Progression');
  }
  
  // Create battle log sheet
  if (results.battleLog && results.battleLog.length > 0) {
    const battleData = [
      ['Battle #', 'Result', 'Rounds', 'Player Party', 'Enemy Party']
    ];
    
    results.battleLog.forEach((battle, index) => {
      battleData.push([
        index + 1,
        battle.result,
        battle.rounds,
        battle.playerParty.map(p => `${p.name} (Lvl ${p.level})`).join(', '),
        battle.enemyParty.map(p => `${p.name} (Lvl ${p.level})`).join(', ')
      ]);
    });
    
    const battleSheet = XLSX.utils.aoa_to_sheet(battleData);
    XLSX.utils.book_append_sheet(workbook, battleSheet, 'Battle Log');
  }
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  saveAs(blob, filename);
};