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
  const [clickCount, setClickCount] = useState(0);

  const spinWheel = () => {
    setClickCount(prev => prev + 1);
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
            const colors = [
              '#2e7d32', // Dark green
              '#4caf50', // Medium green
              '#81c784', // Light green
              '#a5d6a7', // Very light green
              '#c8e6c9', // Lightest green
            ];
            const segmentAngle = 360 / recipes.length;
            const radius = 50;
            const startAngle = angle;
            const endAngle = angle + segmentAngle;
            
            // Calculate points for the pie segment
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = 50 + radius * Math.sin(startRad);
            const y1 = 50 - radius * Math.cos(startRad);
            const x2 = 50 + radius * Math.sin(endRad);
            const y2 = 50 - radius * Math.cos(endRad);
            
            // Determine if the arc is large (more than 180 degrees)
            const largeArc = segmentAngle > 180 ? 1 : 0;
            
            const clipPathPoints = [
              '50% 50%', // Center point
              `${x1}% ${y1}%`, // Start point
              `${x2}% ${y2}%`, // End point
            ].join(', ');
            
            return (
              <Box
                key={recipe.id}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '50% 50%',
                  clipPath: `polygon(${clipPathPoints})`,
                  backgroundColor: colors[index % colors.length],
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    textAlign: 'center',
                    transform: `rotate(${-angle + 90}deg)`,
                    transformOrigin: 'center center',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '20px',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#ffffff',
                      padding: '8px 12px',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: '4px',
                      position: 'absolute',
                      top: '35%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {recipe.title}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Button 
        variant="contained"
        color="primary"
        onClick={spinWheel}
        sx={{ 
          mt: 3, 
          mb: 2,
        }}
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