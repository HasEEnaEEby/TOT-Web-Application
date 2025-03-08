export type Category = 'appetizer' | 'main course' | 'dessert' | 'beverage' | 'special';
export type SpicyLevel = 'mild' | 'medium' | 'hot' | 'extra hot';
export type Allergen = 'nuts' | 'dairy' | 'gluten' | 'soy' | 'shellfish' | 'eggs';

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface CreateMenuItemData {
  name: string;
  description: string;
  price: number;
  category: Category;
  isVegetarian?: boolean;
  isAvailable?: boolean;
  spicyLevel?: SpicyLevel;
  preparationTime?: number;
  allergens: Allergen[];
  nutritionalInfo?: NutritionalInfo;
  image?: File | string | undefined;
}

export interface MenuItem extends Omit<CreateMenuItemData, 'image'> {
  _id: string;
  restaurant: string;
  createdAt: string;
  updatedAt: string;
  formattedPrice: string;
  image?: string;
}

export interface MenuResponse {
  status: 'success' | 'error';
  data?: {
    menuItems?: MenuItem[];
    menuItem?: MenuItem;
  };
  message?: string;
  error?: string;
}