import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  IconButton,
  Slider,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { EVENT_TYPES, createChapter, createEvent } from '../utils/models';

const GameConfig = ({ gameConfig, setGameConfig }) => {
  const [newChapter, setNewChapter] = useState({
    name: '',
    difficultyMultiplier: 1.0,
    days: 5,
    requiredPowerToComplete: 100
  });
  
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(-1);
  const [newEvent, setNewEvent] = useState({
    name: '',
    type: EVENT_TYPES.BATTLE,
    description: '',
    rewardGold: 10,
    difficultyMultiplier: 1.0
  });
  
  const handleAddChapter = () => {
    const chapter = createChapter(newChapter);
    setGameConfig({
      ...gameConfig,
      chapters: [...gameConfig.chapters, chapter]
    });
    setNewChapter({
      name: '',
      difficultyMultiplier: 1.0,
      days: 5,
      requiredPowerToComplete: 100
    });
  };
  
  const handleDeleteChapter = (index) => {
    const updatedChapters = [...gameConfig.chapters];
    updatedChapters.splice(index, 1);
    setGameConfig({
      ...gameConfig,
      chapters: updatedChapters
    });
    if (selectedChapterIndex === index) {
      setSelectedChapterIndex(-1);
    } else if (selectedChapterIndex > index) {
      setSelectedChapterIndex(selectedChapterIndex - 1);
    }
  };
  
  const handleChapterInputChange = (e) => {
    const { name, value } = e.target;
    setNewChapter({
      ...newChapter,
      [name]: name === 'name' ? value : parseFloat(value)
    });
  };
  
  const handleSelectChapter = (index) => {
    setSelectedChapterIndex(index);
  };
  
  const handleAddEvent = () => {
    if (selectedChapterIndex === -1) return;
    
    const event = createEvent(newEvent);
    const updatedChapters = [...gameConfig.chapters];
    updatedChapters[selectedChapterIndex].events.push(event);
    
    setGameConfig({
      ...gameConfig,
      chapters: updatedChapters
    });
    
    setNewEvent({
      name: '',
      type: EVENT_TYPES.BATTLE,
      description: '',
      rewardGold: 10,
      difficultyMultiplier: 1.0
    });
  };
  
  const handleDeleteEvent = (eventIndex) => {
    const updatedChapters = [...gameConfig.chapters];
    updatedChapters[selectedChapterIndex].events.splice(eventIndex, 1);
    
    setGameConfig({
      ...gameConfig,
      chapters: updatedChapters
    });
  };
  
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: name === 'name' || name === 'description' || name === 'type' 
        ? value 
        : parseFloat(value)
    });
  };
  
  const handleSimulationConfigChange = (e) => {
    const { name, value } = e.target;
    setGameConfig({
      ...gameConfig,
      simulationConfig: {
        ...gameConfig.simulationConfig,
        [name]: name === 'autoRun' ? value === 'true' : parseFloat(value)
      }
    });
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Game Configuration
      </Typography>
      
      <Grid container spacing={3}>
        {/* Simulation Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Simulation Settings
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="autorun-label">Auto Run</InputLabel>
                  <Select
                    labelId="autorun-label"
                    name="autoRun"
                    value={gameConfig.simulationConfig?.autoRun?.toString() || 'true'}
                    onChange={handleSimulationConfigChange}
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  Simulation Speed
                </Typography>
                <Slider
                  name="speed"
                  value={gameConfig.simulationConfig?.speed || 1}
                  onChange={(e, value) => {
                    handleSimulationConfigChange({
                      target: { name: 'speed', value }
                    });
                  }}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Chapter Configuration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Chapters
            </Typography>
            
            <List>
              {gameConfig.chapters.map((chapter, index) => (
                <ListItem
                  key={chapter.id}
                  button
                  selected={selectedChapterIndex === index}
                  onClick={() => handleSelectChapter(index)}
                >
                  <ListItemText
                    primary={`${index + 1}. ${chapter.name}`}
                    secondary={`Days: ${chapter.days} | Difficulty: ${chapter.difficultyMultiplier}x | Required Power: ${chapter.requiredPowerToComplete}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleDeleteChapter(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Add New Chapter
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chapter Name"
                  name="name"
                  value={newChapter.name}
                  onChange={handleChapterInputChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Days"
                  name="days"
                  type="number"
                  value={newChapter.days}
                  onChange={handleChapterInputChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Difficulty Multiplier"
                  name="difficultyMultiplier"
                  type="number"
                  value={newChapter.difficultyMultiplier}
                  onChange={handleChapterInputChange}
                  inputProps={{ min: 0.1, step: 0.1 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Required Power"
                  name="requiredPowerToComplete"
                  type="number"
                  value={newChapter.requiredPowerToComplete}
                  onChange={handleChapterInputChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddChapter}
                  fullWidth
                  disabled={!newChapter.name}
                >
                  Add Chapter
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Events Configuration */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Events
            </Typography>
            
            {selectedChapterIndex === -1 ? (
              <Typography variant="body2" color="text.secondary">
                Select a chapter to configure its events
              </Typography>
            ) : (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Events for {gameConfig.chapters[selectedChapterIndex].name}
                </Typography>
                
                <List>
                  {gameConfig.chapters[selectedChapterIndex].events.map((event, index) => (
                    <ListItem key={event.id}>
                      <ListItemText
                        primary={`${event.name} (${event.type})`}
                        secondary={`Gold: ${event.rewardGold} | Difficulty: ${event.difficultyMultiplier}x`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleDeleteEvent(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Add New Event
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Event Name"
                      name="name"
                      value={newEvent.name}
                      onChange={handleEventInputChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Event Type</InputLabel>
                      <Select
                        name="type"
                        value={newEvent.type}
                        onChange={handleEventInputChange}
                      >
                        {Object.values(EVENT_TYPES).map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={newEvent.description}
                      onChange={handleEventInputChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Gold Reward"
                      name="rewardGold"
                      type="number"
                      value={newEvent.rewardGold}
                      onChange={handleEventInputChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Difficulty Multiplier"
                      name="difficultyMultiplier"
                      type="number"
                      value={newEvent.difficultyMultiplier}
                      onChange={handleEventInputChange}
                      inputProps={{ min: 0.1, step: 0.1 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddEvent}
                      fullWidth
                      disabled={!newEvent.name}
                    >
                      Add Event
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameConfig;