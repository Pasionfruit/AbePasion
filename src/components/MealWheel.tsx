import React, { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Recipe } from '../types/Recipe';

interface MealWheelProps {
  recipes: Recipe[];
}

const MealWheel: React.FC<MealWheelProps> = ({ recipes }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedRecipe(null);
    
    const spins = 5;
    const degrees = 360 * spins + Math.random() * 360;
    const duration = 3000;

    setRotation(rotation + degrees);

    setTimeout(() => {
      setIsSpinning(false);
      const finalRotation = (rotation + degrees) % 360;
      const recipeIndex = Math.floor(
        (360 - (finalRotation % 360)) / (360 / recipes.length)
      );
      setSelectedRecipe(recipes[recipeIndex]);
    }, duration);
  };

  return (
    <Box sx={{ textAlign: 'center', my: 4 }}>
      <Box
        sx={{
          width: 400,
          height: 400,
          position: 'relative',
          margin: '0 auto',
          border: '2px solid #2e7d32',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        {/* Static pointer */}
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: '30px solid #2e7d32',
            zIndex: 2,
          }}
        />

        {/* Spinning wheel */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transition: `transform ${isSpinning ? '3s' : '0s'} cubic-bezier(0.2, 0.8, 0.3, 1)`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {recipes.map((recipe, index) => {
            const angle = (360 / recipes.length) * index;
            return (
              <Box
                key={recipe.id}
                sx={{
                  position: 'absolute',
                  width: '50%',
                  height: '50%',
                  left: '25%',
                  top: '0%',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    transform: 'rotate(90deg)',
                    transformOrigin: 'left bottom',
                    paddingLeft: '20px',
                    color: 'white',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      maxWidth: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {recipe.title}
                  </Typography>
                </Box>
              </Box>
            );
          })}

          {/* Wheel segments */}
          {recipes.map((_, index) => {
            const angle = (360 / recipes.length) * index;
            return (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '50% 50%',
                  clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%)',
                  backgroundColor: index % 2 ? '#4caf50' : '#81c784',
                }}
              />
            );
          })}
        </Box>
      </Box>

      <Button 
        variant="contained"
        color="primary"
        onClick={spinWheel}
        disabled={isSpinning}
        sx={{ mt: 3, mb: 2 }}
      >
        Spin for a Recipe!
      </Button>

      {selectedRecipe && !isSpinning && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="primary">
            Selected Recipe:
          </Typography>
          <Typography variant="body1">
            {selectedRecipe.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prep Time: {selectedRecipe.prepTime} | Cook Time: {selectedRecipe.cookTime}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MealWheel; 