import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Grid, Typography, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RecipeCard from './components/RecipeCard';
import MealWheel from './components/MealWheel';
import Navbar from './components/Navbar';
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
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/" element={<Navigate to="/recipes" replace />} />
              <Route
                path="/recipes"
                element={
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
                    <Grid container spacing={3}>
                      {recipes.map((recipe) => (
                        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                          <RecipeCard recipe={recipe} />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                }
              />
              <Route
                path="/wheel"
                element={
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
                      Meal Wheel
                    </Typography>
                    <MealWheel recipes={recipes} />
                  </>
                }
              />
              <Route
                path="/calendar"
                element={
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
                    Calendar (Coming Soon)
                  </Typography>
                }
              />
              <Route
                path="/grocery-list"
                element={
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
                    Grocery List (Coming Soon)
                  </Typography>
                }
              />
            </Routes>
          </Container>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App; 