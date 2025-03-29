import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
} from '@mui/material';
import RecipeCard from './RecipeCard';
import { recipeDB } from '../data/recipes';

const difficulties = ['Easy', 'Medium', 'Hard'];
const prepTimes = ['0 mins', '5 mins', '10 mins', '15 mins', '20 mins', '25 mins', '30 mins'];
const cookTimes = ['0 mins', '5 mins', '10 mins', '15 mins', '20 mins', '25 mins', '30 mins'];

const RecipePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedPrepTime, setSelectedPrepTime] = useState('');
  const [selectedCookTime, setSelectedCookTime] = useState('');

  const filteredRecipes = recipeDB.getAllRecipes().filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = !selectedDifficulty || recipe.difficulty === selectedDifficulty;
    const matchesPrepTime = !selectedPrepTime || recipe.prepTime === selectedPrepTime;
    const matchesCookTime = !selectedCookTime || recipe.cookTime === selectedCookTime;

    return matchesSearch && matchesDifficulty && matchesPrepTime && matchesCookTime;
  });

  return (
    <>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          textAlign: 'center',
          color: 'primary.main',
          fontWeight: 'bold',
          mb: 4,
        }}
      >
        Recipe Book
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search recipes"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={selectedDifficulty}
                label="Difficulty"
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {difficulties.map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Prep Time</InputLabel>
              <Select
                value={selectedPrepTime}
                label="Prep Time"
                onChange={(e) => setSelectedPrepTime(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {prepTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Cook Time</InputLabel>
              <Select
                value={selectedCookTime}
                label="Cook Time"
                onChange={(e) => setSelectedCookTime(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {cookTimes.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {filteredRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default RecipePage; 