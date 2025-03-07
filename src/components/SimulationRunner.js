import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Grid,
  Divider,
  Alert,
  AlertTitle,
  Card,
  CardContent
} from '@mui/material';
import { PlayArrow as PlayIcon, Stop as StopIcon } from '@mui/icons-material';
import { runSimulation } from '../utils/simulator';

const SimulationRunner = ({ gameConfig, setSimulationResults, setTabIndex }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);
  
  useEffect(() => {
    // Scroll to bottom of logs whenever logs change
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);
  
  const startSimulation = async () => {
    if (isRunning) return;
    
    // Validate game configuration
    if (!gameConfig.chapters || gameConfig.chapters.length === 0) {
      addLog('Error: No chapters configured. Please add at least one chapter.');
      return;
    }
    
    if (!gameConfig.pokemons || gameConfig.pokemons.length === 0) {
      addLog('Error: No pokemons configured. Please add at least one pokemon.');
      return;
    }
    
    setIsRunning(true);
    setLogs([]);
    addLog('Starting simulation...');
    
    try {
      const results = await runSimulation(
        gameConfig,
        (progressData) => {
          setProgress(progressData);
        },
        (logMessage) => {
          addLog(logMessage);
        }
      );
      
      addLog('Simulation completed!');
      setSimulationResults(results);
      
      // Navigate to results tab
      setTimeout(() => {
        setTabIndex(3);
      }, 2000);
    } catch (error) {
      addLog(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  const stopSimulation = () => {
    setIsRunning(false);
    addLog('Simulation stopped by user.');
  };
  
  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };
  
  const canRunSimulation = () => {
    return gameConfig.chapters?.length > 0 && gameConfig.pokemons?.length > 0;
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Simulation Runner
      </Typography>
      
      <Grid container spacing={3}>
        {/* Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Simulation Controls
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayIcon />}
                    onClick={startSimulation}
                    disabled={isRunning || !canRunSimulation()}
                    fullWidth
                  >
                    Start Simulation
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<StopIcon />}
                    onClick={stopSimulation}
                    disabled={!isRunning}
                    fullWidth
                  >
                    Stop Simulation
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Simulation Configuration
                </Typography>
                
                <Typography variant="body2">
                  Chapters: {gameConfig.chapters?.length || 0}
                </Typography>
                
                <Typography variant="body2">
                  Pokemons: {gameConfig.pokemons?.length || 0}
                </Typography>
                
                <Typography variant="body2">
                  Events: {gameConfig.chapters?.reduce((total, chapter) => total + (chapter.events?.length || 0), 0) || 0}
                </Typography>
                
                <Typography variant="body2">
                  Auto Run: {gameConfig.simulationConfig?.autoRun ? 'Yes' : 'No'}
                </Typography>
                
                <Typography variant="body2">
                  Simulation Speed: {gameConfig.simulationConfig?.speed || 1}x
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Progress */}
        {isRunning && progress && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Simulation Progress
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Chapter {progress.chapter} of {progress.totalChapters}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(progress.chapter / progress.totalChapters) * 100} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Day {progress.day}
                </Typography>
              </Box>
              
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Party Power
                  </Typography>
                  
                  <Typography variant="h4" color="primary">
                    {progress.currentPower.toFixed(2)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Required: {progress.requiredPower}
                  </Typography>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={(progress.currentPower / progress.requiredPower) * 100} 
                    sx={{ height: 6, borderRadius: 3, mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        )}
        
        {/* Logs */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Simulation Log
            </Typography>
            
            {!canRunSimulation() && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <AlertTitle>Cannot Run Simulation</AlertTitle>
                You need to configure at least one chapter and one pokemon before running the simulation.
              </Alert>
            )}
            
            <Box sx={{ height: 400, overflow: 'auto', border: '1px solid #eee', borderRadius: 1 }}>
              <List dense>
                {logs.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No logs yet. Start the simulation to see logs." />
                  </ListItem>
                ) : (
                  logs.map((log) => (
                    <React.Fragment key={log.id}>
                      <ListItem>
                        <ListItemText 
                          primary={log.message} 
                          secondary={log.timestamp}
                          primaryTypographyProps={{
                            style: {
                              whiteSpace: 'pre-wrap',
                              fontFamily: log.message.startsWith('Error') ? 'monospace' : 'inherit',
                              color: log.message.startsWith('Error') ? 'red' : 'inherit'
                            }
                          }}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))
                )}
                <div ref={logEndRef} />
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulationRunner;