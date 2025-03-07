import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  AlertTitle,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { CloudDownload as DownloadIcon, BarChart as ChartIcon } from '@mui/icons-material';
import { exportToExcel } from '../utils/export';

const SimulationResults = ({ results }) => {
  const [tabIndex, setTabIndex] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  const handleExportToExcel = () => {
    if (!results) return;
    exportToExcel(results, 'pokemon-capybara-simulation.xlsx');
  };
  
  if (!results) {
    return (
      <Box>
        <Alert severity="info">
          <AlertTitle>No Simulation Results</AlertTitle>
          Run a simulation first to see results here.
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Simulation Results
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportToExcel}
        >
          Export to Excel
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total In-Game Days
                  </Typography>
                  <Typography variant="h4">
                    {results.totalGameDays}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Real Player Time
                  </Typography>
                  <Typography variant="h4">
                    {results.realPlayerTimeMinutes} min
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {results.realPlayerTimeSeconds} seconds
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Chapters Completed
                  </Typography>
                  <Typography variant="h4">
                    {results.chaptersCompleted}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Highest: Chapter {results.highestChapterReached}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Battle Win Rate
                  </Typography>
                  <Typography variant="h4">
                    {results.totalBattles > 0 
                      ? Math.round((results.battlesWon / results.totalBattles) * 100)
                      : 0}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {results.battlesWon} / {results.totalBattles} battles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Detailed Results */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ mb: 2 }}>
              <Tab label="Summary" />
              <Tab label="Power Progression" />
              <Tab label="Chapter Progression" />
              <Tab label="Battle Log" />
            </Tabs>
            
            {/* Summary Tab */}
            {tabIndex === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Time Statistics
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Total In-Game Days" 
                        secondary={results.totalGameDays} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Estimated Real Player Time" 
                        secondary={`${results.realPlayerTimeHours} hours, ${results.realPlayerTimeMinutes % 60} minutes, ${results.realPlayerTimeSeconds % 60} seconds`} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Simulation Runtime" 
                        secondary={`${results.totalPlaytimeHours} hours, ${results.totalPlaytimeMinutes % 60} minutes, ${results.totalPlaytimeSeconds % 60} seconds`} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Time Ratio" 
                        secondary={`1 simulation second = ${results.totalPlaytimeSeconds > 0 ? (results.realPlayerTimeSeconds / results.totalPlaytimeSeconds).toFixed(2) : 0} real player seconds`} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Game Progress
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Chapters Completed" 
                        secondary={results.chaptersCompleted} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Highest Chapter Reached" 
                        secondary={results.highestChapterReached} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Highest Day Reached" 
                        secondary={results.highestDayReached} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Pokemon Statistics" 
                        secondary={`Caught: ${results.totalPokemonCaught} | Evolved: ${results.totalPokemonEvolved}`} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Combat Statistics
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Total Battles" 
                        secondary={results.totalBattles} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Battles Won" 
                        secondary={`${results.battlesWon} (${results.totalBattles > 0 ? Math.round((results.battlesWon / results.totalBattles) * 100) : 0}%)`} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Battles Lost" 
                        secondary={`${results.battlesLost} (${results.totalBattles > 0 ? Math.round((results.battlesLost / results.totalBattles) * 100) : 0}%)`} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Battles Per Day (Average)" 
                        secondary={results.totalGameDays > 0 ? (results.totalBattles / results.totalGameDays).toFixed(2) : 0} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Economy Statistics
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom>
                            Gold Earned
                          </Typography>
                          <Typography variant="h4">
                            {results.goldEarned}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom>
                            Gold Spent
                          </Typography>
                          <Typography variant="h4">
                            {results.goldSpent}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom>
                            Net Gold
                          </Typography>
                          <Typography variant="h4" color={results.goldEarned - results.goldSpent >= 0 ? 'green' : 'error'}>
                            {results.goldEarned - results.goldSpent}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography color="text.secondary" gutterBottom>
                            Gold Per Day (Average)
                          </Typography>
                          <Typography variant="h5">
                            {results.totalGameDays > 0 ? (results.goldEarned / results.totalGameDays).toFixed(2) : 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            
            {/* Power Progression Tab */}
            {tabIndex === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Power Progression Over Time
                </Typography>
                
                {results.totalPowerProgression && results.totalPowerProgression.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Chapter</TableCell>
                          <TableCell>Day</TableCell>
                          <TableCell>Total Power</TableCell>
                          <TableCell>Estimated Time (min:sec)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.totalPowerProgression.map((entry, index) => {
                          // Calculate estimated time (2 seconds per game day)
                          const estimatedSeconds = index * 2;
                          const minutes = Math.floor(estimatedSeconds / 60);
                          const seconds = estimatedSeconds % 60;
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>{entry.chapter}</TableCell>
                              <TableCell>{entry.day}</TableCell>
                              <TableCell>{entry.totalPower.toFixed(2)}</TableCell>
                              <TableCell>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">
                    No power progression data available.
                  </Alert>
                )}
              </Box>
            )}
            
            {/* Chapter Progression Tab */}
            {tabIndex === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Chapter Progression
                </Typography>
                
                {results.chapterProgression && results.chapterProgression.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Chapter</TableCell>
                          <TableCell>Day</TableCell>
                          <TableCell>Result</TableCell>
                          <TableCell>Estimated Time (min:sec)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.chapterProgression.map((entry, index) => {
                          // Calculate a rough estimate of time for this chapter completion/failure
                          // This is a rough approximation since we don't track exact day counts in chapterProgression
                          const previousDays = results.chapterProgression
                            .slice(0, index)
                            .reduce((sum, prev) => sum + prev.day, 0);
                          
                          const estimatedSeconds = (previousDays + entry.day) * 2;
                          const minutes = Math.floor(estimatedSeconds / 60);
                          const seconds = estimatedSeconds % 60;
                          
                          return (
                            <TableRow key={index}>
                              <TableCell>{entry.chapter}</TableCell>
                              <TableCell>{entry.day}</TableCell>
                              <TableCell>
                                <Box sx={{
                                  display: 'inline-block',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  backgroundColor: entry.result === 'completed' ? '#e8f5e9' : '#ffebee',
                                  color: entry.result === 'completed' ? '#2e7d32' : '#c62828'
                                }}>
                                  {entry.result === 'completed' ? 'Completed' : 'Failed'}
                                </Box>
                              </TableCell>
                              <TableCell>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">
                    No chapter progression data available.
                  </Alert>
                )}
              </Box>
            )}
            
            {/* Battle Log Tab */}
            {tabIndex === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Battle Log
                </Typography>
                
                {results.battleLog && results.battleLog.length > 0 ? (
                  <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Battle #</TableCell>
                          <TableCell>Result</TableCell>
                          <TableCell>Rounds</TableCell>
                          <TableCell>Player Party</TableCell>
                          <TableCell>Enemy Party</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {results.battleLog.map((battle, index) => (
                          <TableRow key={index} sx={{ 
                            backgroundColor: battle.result === 'win' ? 'rgba(46, 125, 50, 0.04)' : 'rgba(198, 40, 40, 0.04)' 
                          }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Box sx={{
                                display: 'inline-block',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                backgroundColor: battle.result === 'win' ? '#e8f5e9' : '#ffebee',
                                color: battle.result === 'win' ? '#2e7d32' : '#c62828'
                              }}>
                                {battle.result.toUpperCase()}
                              </Box>
                            </TableCell>
                            <TableCell>{battle.rounds}</TableCell>
                            <TableCell>{battle.playerParty.map(p => `${p.name} (Lvl ${p.level})`).join(', ')}</TableCell>
                            <TableCell>{battle.enemyParty.map(p => `${p.name} (Lvl ${p.level})`).join(', ')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">
                    No battle log data available.
                  </Alert>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulationResults;