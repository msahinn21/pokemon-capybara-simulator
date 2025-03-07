import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, Tabs, Tab, Alert, Snackbar } from '@mui/material';

// Components
import GameConfig from './components/GameConfig';
import PokemonEditor from './components/PokemonEditor';
import SimulationRunner from './components/SimulationRunner';
import SimulationResults from './components/SimulationResults';

// Sample Data
import { getSampleGameConfig } from './utils/sampleData';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [gameConfig, setGameConfig] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Load sample data on initial mount
  useEffect(() => {
    setGameConfig(getSampleGameConfig());
    
    // Show welcome notification
    setNotification({
      open: true,
      message: 'Welcome to Pokemon Capybara Simulator! Sample data has been loaded for your convenience.',
      severity: 'success'
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Wait for game config to load
  if (!gameConfig) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box sx={{ my: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Pokemon Capybara Simulator
            </Typography>
            <Typography variant="body1">
              Loading...
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Pokemon Capybara Simulator
          </Typography>
          
          <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Game Config" />
            <Tab label="Pokemon Editor" />
            <Tab label="Run Simulation" />
            <Tab label="Results" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {tabIndex === 0 && (
              <GameConfig 
                gameConfig={gameConfig} 
                setGameConfig={setGameConfig} 
              />
            )}
            
            {tabIndex === 1 && (
              <PokemonEditor 
                gameConfig={gameConfig} 
                setGameConfig={setGameConfig} 
              />
            )}
            
            {tabIndex === 2 && (
              <SimulationRunner 
                gameConfig={gameConfig} 
                setSimulationResults={setSimulationResults}
                setTabIndex={setTabIndex}
              />
            )}
            
            {tabIndex === 3 && (
              <SimulationResults results={simulationResults} />
            )}
          </Box>
        </Box>
        
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;