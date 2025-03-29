import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Grid, Typography, Box } from '@mui/material';
import RecipeCard from './components/RecipeCard';
import MealWheel from './components/MealWheel';
import { recipeDB } from './data/recipes';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ff8f00',
    },
  },
});

const meals = [
  'Pizza',
  'Burger',
  'Sushi',
  'Pasta',
  'Salad',
  'Tacos',
  'Curry',
  'Steak'
];

function App() {
  const recipes = recipeDB.getAllRecipes();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
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
          <MealWheel recipes={recipes} />
          <Grid container spacing={3}>
            {recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <RecipeCard recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 