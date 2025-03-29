export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: {
    item: string;
    amount: number;
    unit: string;
  }[];
  instructions: string[];
  category: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: string;
  updatedAt: string;
} 