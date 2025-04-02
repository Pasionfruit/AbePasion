import React from 'react';
import { Link } from 'react-router-dom';
import MealWheel from '../components/MealWheel';
import Navbar from '../components/Navbar';
import RecipePage from '../components/RecipePage';

const RecipeBook: React.FC = () => {
  return (
    <div className="recipe-book-container">
      <Navbar />
      <div className="back-to-portfolio">
        <Link to="/" className="btn btn-outline-primary">
          <i className="bx bx-arrow-back"></i> Back to Portfolio
        </Link>
      </div>
      <RecipePage />
    </div>
  );
};

export default RecipeBook; 