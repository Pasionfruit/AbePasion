import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MealWheel from './components/MealWheel';
import Navbar from './components/Navbar';
import RecipePage from './components/RecipePage';
import Portfolio from './pages/Portfolio';
import RecipeBook from './pages/RecipeBook';

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

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route
            path="/recipes"
            element={
              <>
                <Navbar />
                <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
                  <Container maxWidth="lg">
                    <RecipeBook />
                  </Container>
                </Box>
              </>
            }
          />
          <Route
            path="/wheel"
            element={
              <>
                <Navbar />
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
                      Meal Wheel
                    </Typography>
                    <MealWheel recipes={[]} />
                  </Container>
                </Box>
              </>
            }
          />
          <Route
            path="/calendar"
            element={
              <>
                <Navbar />
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
                      Calendar (Coming Soon)
                    </Typography>
                  </Container>
                </Box>
              </>
            }
          />
          <Route
            path="/grocery-list"
            element={
              <>
                <Navbar />
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
                      Grocery List (Coming Soon)
                    </Typography>
                  </Container>
                </Box>
              </>
            }
          />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App; 