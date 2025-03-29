import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Recipe } from '../types/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={recipe.image}
        alt={recipe.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {recipe.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{ mb: 2 }}
        >
          {recipe.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<AccessTimeIcon />}
            label={`Prep: ${recipe.prepTime}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={`Cook: ${recipe.cookTime}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<RestaurantIcon />}
            label={`${recipe.servings} servings`}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton color="error" size="small">
            <FavoriteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard; 