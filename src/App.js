import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, Tabs, Tab } from '@mui/material';

// Components
import GameConfig from './components/GameConfig';
import PokemonEditor from './components/PokemonEditor';
import SimulationRunner from './components/SimulationRunner';
import SimulationResults from './components/SimulationResults';

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
  const [gameConfig, setGameConfig] = useState({
    chapters: [],
    events: [],
    pokemons: [],
    simulationConfig: {
      autoRun: true,
      speed: 1
    }
  });
  const [simulationResults, setSimulationResults] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

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
      </Container>
    </ThemeProvider>
  );
}

export default App;