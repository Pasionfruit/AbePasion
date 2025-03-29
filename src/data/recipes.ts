import { Recipe } from '../types/Recipe';

export const recipes: Recipe[] = [
  {
    id: 1,
    title: 'Classic Spaghetti Carbonara',
    description: 'A traditional Italian pasta dish made with eggs, cheese, pancetta, and black pepper.',
    image: 'https://source.unsplash.com/random/400x300/?spaghetti',
    prepTime: '20 mins',
    cookTime: '15 mins',
    servings: 4,
    ingredients: [
      { item: 'Spaghetti', amount: 400, unit: 'g' },
      { item: 'Pancetta', amount: 150, unit: 'g' },
      { item: 'Eggs', amount: 4, unit: 'whole' },
      { item: 'Parmesan cheese', amount: 100, unit: 'g' },
      { item: 'Black pepper', amount: 2, unit: 'tsp' },
    ],
    instructions: [
      'Bring a large pot of salted water to boil',
      'Cook spaghetti according to package instructions',
      'Meanwhile, cook diced pancetta until crispy',
      'Whisk eggs and grated cheese in a bowl',
      'Combine hot pasta with egg mixture and pancetta',
      'Season with black pepper and serve immediately'
    ],
    category: ['Italian', 'Pasta', 'Main Course'],
    difficulty: 'Medium',
    createdAt: '2024-02-15T12:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z'
  },
  {
    id: 2,
    title: 'Chicken Stir Fry',
    description: 'Quick and healthy Asian-inspired dish with fresh vegetables and tender chicken.',
    image: 'https://source.unsplash.com/random/400x300/?stir-fry',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: 4,
    ingredients: [
      { item: 'Chicken breast', amount: 500, unit: 'g' },
      { item: 'Mixed vegetables', amount: 400, unit: 'g' },
      { item: 'Soy sauce', amount: 3, unit: 'tbsp' },
      { item: 'Garlic', amount: 3, unit: 'cloves' },
      { item: 'Ginger', amount: 1, unit: 'thumb' }
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Prepare and chop all vegetables',
      'Heat oil in a wok or large frying pan',
      'Stir-fry chicken until golden',
      'Add vegetables and sauce',
      'Cook until vegetables are tender-crisp'
    ],
    category: ['Asian', 'Chicken', 'Healthy'],
    difficulty: 'Easy',
    createdAt: '2024-02-15T12:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z'
  },
  {
    id: 3,
    title: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil.',
    image: 'https://source.unsplash.com/random/400x300/?pizza',
    prepTime: '30 mins',
    cookTime: '15 mins',
    servings: 4,
    ingredients: [
      { item: 'Pizza dough', amount: 500, unit: 'g' },
      { item: 'Tomato sauce', amount: 200, unit: 'ml' },
      { item: 'Fresh mozzarella', amount: 250, unit: 'g' },
      { item: 'Fresh basil', amount: 20, unit: 'g' },
      { item: 'Extra virgin olive oil', amount: 2, unit: 'tbsp' }
    ],
    instructions: [
      'Roll out the pizza dough',
      'Spread tomato sauce evenly',
      'Add sliced mozzarella',
      'Bake at 250°C for 12-15 minutes',
      'Top with fresh basil and olive oil'
    ],
    category: ['Italian', 'Pizza', 'Main Course'],
    difficulty: 'Medium',
    createdAt: '2024-02-15T12:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z'
  },
  {
    id: 4,
    title: 'Caesar Salad',
    description: 'Classic Caesar salad with crisp romaine lettuce, croutons, and parmesan.',
    image: 'https://source.unsplash.com/random/400x300/?salad',
    prepTime: '15 mins',
    cookTime: '0 mins',
    servings: 4,
    ingredients: [
      { item: 'Romaine lettuce', amount: 2, unit: 'heads' },
      { item: 'Croutons', amount: 100, unit: 'g' },
      { item: 'Parmesan cheese', amount: 50, unit: 'g' },
      { item: 'Caesar dressing', amount: 200, unit: 'ml' },
      { item: 'Black pepper', amount: 1, unit: 'tsp' }
    ],
    instructions: [
      'Wash and chop romaine lettuce',
      'Add croutons and grated parmesan',
      'Drizzle with Caesar dressing',
      'Season with black pepper',
      'Toss gently and serve'
    ],
    category: ['Salad', 'Appetizer', 'Healthy'],
    difficulty: 'Easy',
    createdAt: '2024-02-15T12:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z'
  },
  {
    id: 5,
    title: 'Beef Tacos',
    description: 'Mexican-style beef tacos with fresh toppings and homemade seasoning.',
    image: 'https://source.unsplash.com/random/400x300/?tacos',
    prepTime: '20 mins',
    cookTime: '20 mins',
    servings: 4,
    ingredients: [
      { item: 'Ground beef', amount: 500, unit: 'g' },
      { item: 'Taco seasoning', amount: 2, unit: 'tbsp' },
      { item: 'Taco shells', amount: 8, unit: 'pieces' },
      { item: 'Lettuce', amount: 100, unit: 'g' },
      { item: 'Tomatoes', amount: 2, unit: 'whole' }
    ],
    instructions: [
      'Brown the ground beef',
      'Add taco seasoning',
      'Warm taco shells',
      'Prepare toppings',
      'Assemble tacos'
    ],
    category: ['Mexican', 'Main Course', 'Quick'],
    difficulty: 'Easy',
    createdAt: '2024-02-15T12:00:00Z',
    updatedAt: '2024-02-15T12:00:00Z'
  }
];

// Helper functions to interact with the recipe data
export const recipeDB = {
  getAllRecipes: (): Recipe[] => recipes,
  
  getRecipeById: (id: number): Recipe | undefined => {
    return recipes.find(recipe => recipe.id === id);
  },
  
  getRecipesByCategory: (category: string): Recipe[] => {
    return recipes.filter(recipe => recipe.category.includes(category));
  },
  
  searchRecipes: (query: string): Recipe[] => {
    const lowercaseQuery = query.toLowerCase();
    return recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery) ||
      recipe.category.some(cat => cat.toLowerCase().includes(lowercaseQuery))
    );
  }
}; 