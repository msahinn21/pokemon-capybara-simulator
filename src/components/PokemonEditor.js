import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Slider
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { RARITY_TYPES, EVOLUTION_TYPES, createPokemon } from '../utils/models';

const PokemonEditor = ({ gameConfig, setGameConfig }) => {
  const [newPokemon, setNewPokemon] = useState({
    name: '',
    hp: 100,
    atk: 10,
    def: 10,
    level: 1,
    rarity: RARITY_TYPES.COMMON,
    evolutionType: EVOLUTION_TYPES.BASIC,
    evolvesFrom: null,
    evolvesTo: null,
    hpWeight: 0.5,
    atkWeight: 1.0,
    defWeight: 0.7
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  
  const handleAddPokemon = () => {
    const pokemon = createPokemon(newPokemon);
    
    if (editMode && editIndex !== -1) {
      // Update existing Pokemon
      const updatedPokemons = [...gameConfig.pokemons];
      updatedPokemons[editIndex] = {
        ...pokemon,
        id: gameConfig.pokemons[editIndex].id // Preserve the original ID
      };
      
      setGameConfig({
        ...gameConfig,
        pokemons: updatedPokemons
      });
      
      setEditMode(false);
      setEditIndex(-1);
    } else {
      // Add new Pokemon
      setGameConfig({
        ...gameConfig,
        pokemons: [...gameConfig.pokemons, pokemon]
      });
    }
    
    // Reset form
    setNewPokemon({
      name: '',
      hp: 100,
      atk: 10,
      def: 10,
      level: 1,
      rarity: RARITY_TYPES.COMMON,
      evolutionType: EVOLUTION_TYPES.BASIC,
      evolvesFrom: null,
      evolvesTo: null,
      hpWeight: 0.5,
      atkWeight: 1.0,
      defWeight: 0.7
    });
  };
  
  const handleDeletePokemon = (index) => {
    const updatedPokemons = [...gameConfig.pokemons];
    updatedPokemons.splice(index, 1);
    setGameConfig({
      ...gameConfig,
      pokemons: updatedPokemons
    });
    
    if (editIndex === index) {
      setEditMode(false);
      setEditIndex(-1);
      
      setNewPokemon({
        name: '',
        hp: 100,
        atk: 10,
        def: 10,
        level: 1,
        rarity: RARITY_TYPES.COMMON,
        evolutionType: EVOLUTION_TYPES.BASIC,
        evolvesFrom: null,
        evolvesTo: null,
        hpWeight: 0.5,
        atkWeight: 1.0,
        defWeight: 0.7
      });
    } else if (editIndex > index) {
      setEditIndex(editIndex - 1);
    }
  };
  
  const handleEditPokemon = (index) => {
    const pokemon = gameConfig.pokemons[index];
    setNewPokemon({
      name: pokemon.name,
      hp: pokemon.hp,
      atk: pokemon.atk,
      def: pokemon.def,
      level: pokemon.level,
      rarity: pokemon.rarity,
      evolutionType: pokemon.evolutionType,
      evolvesFrom: pokemon.evolvesFrom,
      evolvesTo: pokemon.evolvesTo,
      hpWeight: pokemon.hpWeight || 0.5,
      atkWeight: pokemon.atkWeight || 1.0,
      defWeight: pokemon.defWeight || 0.7
    });
    
    setEditMode(true);
    setEditIndex(index);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPokemon({
      ...newPokemon,
      [name]: name === 'name' || name === 'rarity' || name === 'evolutionType' || name === 'evolvesFrom' || name === 'evolvesTo' 
        ? value 
        : parseFloat(value)
    });
  };
  
  const handleSliderChange = (name) => (e, value) => {
    setNewPokemon({
      ...newPokemon,
      [name]: value
    });
  };
  
  // Calculate total power
  const totalPower = Math.sqrt(
    (newPokemon.hp * newPokemon.hpWeight) + 
    (newPokemon.atk * newPokemon.atkWeight) + 
    (newPokemon.def * newPokemon.defWeight) * newPokemon.hp
  );
  
  // Get available Pokemon names for evolution chains
  const pokemonNames = gameConfig.pokemons.map(p => p.name);
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Pokemon Editor
      </Typography>
      
      <Grid container spacing={3}>
        {/* Pokemon List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, minHeight: 400 }}>
            <Typography variant="h6" gutterBottom>
              Pokemon List
            </Typography>
            
            <List>
              {gameConfig.pokemons.map((pokemon, index) => (
                <ListItem key={pokemon.id}>
                  <ListItemText
                    primary={`${pokemon.name} (Lvl ${pokemon.level})`}
                    secondary={`HP: ${pokemon.hp} | ATK: ${pokemon.atk} | DEF: ${pokemon.def} | Power: ${pokemon.totalPower.toFixed(2)} | ${pokemon.rarity} | ${pokemon.evolutionType}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleEditPokemon(index)} sx={{ mr: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeletePokemon(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Pokemon Editor */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {editMode ? 'Edit Pokemon' : 'Create New Pokemon'}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Pokemon Name"
                  name="name"
                  value={newPokemon.name}
                  onChange={handleInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="HP"
                  name="hp"
                  type="number"
                  value={newPokemon.hp}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="ATK"
                  name="atk"
                  type="number"
                  value={newPokemon.atk}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="DEF"
                  name="def"
                  type="number"
                  value={newPokemon.def}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Level"
                  name="level"
                  type="number"
                  value={newPokemon.level}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rarity</InputLabel>
                  <Select
                    name="rarity"
                    value={newPokemon.rarity}
                    onChange={handleInputChange}
                  >
                    {Object.values(RARITY_TYPES).map((rarity) => (
                      <MenuItem key={rarity} value={rarity}>
                        {rarity}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Evolution Type</InputLabel>
                  <Select
                    name="evolutionType"
                    value={newPokemon.evolutionType}
                    onChange={handleInputChange}
                  >
                    {Object.values(EVOLUTION_TYPES).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Evolves From</InputLabel>
                  <Select
                    name="evolvesFrom"
                    value={newPokemon.evolvesFrom || ''}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {pokemonNames.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Evolves To</InputLabel>
                  <Select
                    name="evolvesTo"
                    value={newPokemon.evolvesTo || ''}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {pokemonNames.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Power Weight Configuration
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography gutterBottom>
                  HP Weight: {newPokemon.hpWeight.toFixed(1)}
                </Typography>
                <Slider
                  value={newPokemon.hpWeight}
                  onChange={handleSliderChange('hpWeight')}
                  step={0.1}
                  min={0.1}
                  max={2.0}
                  valueLabelDisplay="auto"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography gutterBottom>
                  ATK Weight: {newPokemon.atkWeight.toFixed(1)}
                </Typography>
                <Slider
                  value={newPokemon.atkWeight}
                  onChange={handleSliderChange('atkWeight')}
                  step={0.1}
                  min={0.1}
                  max={2.0}
                  valueLabelDisplay="auto"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography gutterBottom>
                  DEF Weight: {newPokemon.defWeight.toFixed(1)}
                </Typography>
                <Slider
                  value={newPokemon.defWeight}
                  onChange={handleSliderChange('defWeight')}
                  step={0.1}
                  min={0.1}
                  max={2.0}
                  valueLabelDisplay="auto"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="primary">
                  Calculated Power: {Math.round(totalPower * 100) / 100}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={editMode ? <EditIcon /> : <AddIcon />}
                  onClick={handleAddPokemon}
                  fullWidth
                  disabled={!newPokemon.name}
                >
                  {editMode ? 'Update Pokemon' : 'Add Pokemon'}
                </Button>
              </Grid>
              
              {editMode && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setEditIndex(-1);
                      setNewPokemon({
                        name: '',
                        hp: 100,
                        atk: 10,
                        def: 10,
                        level: 1,
                        rarity: RARITY_TYPES.COMMON,
                        evolutionType: EVOLUTION_TYPES.BASIC,
                        evolvesFrom: null,
                        evolvesTo: null,
                        hpWeight: 0.5,
                        atkWeight: 1.0,
                        defWeight: 0.7
                      });
                    }}
                    fullWidth
                  >
                    Cancel Edit
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PokemonEditor;