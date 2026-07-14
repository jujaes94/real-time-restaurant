export type MenuCategory = "plate" | "drink" | "dessert" | "appetizer" | "side" | "other";

export interface MenuItem {
  id: number;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
}

let nextId = 1;

const MENU_ITEMS: MenuItem[] = [
  { id: nextId++, name: "Grilled Salmon", category: "plate", price: 24, description: "Atlantic salmon with herbs and lemon butter sauce" },
  { id: nextId++, name: "Beef Tenderloin", category: "plate", price: 32, description: "8oz tenderloin with red wine reduction" },
  { id: nextId++, name: "Chicken Parmesan", category: "plate", price: 18, description: "Breaded chicken breast with marinara and mozzarella" },
  { id: nextId++, name: "Vegetable Risotto", category: "plate", price: 16, description: "Creamy arborio rice with seasonal vegetables" },
  { id: nextId++, name: "Caesar Salad", category: "appetizer", price: 10, description: "Romaine, parmesan, croutons, caesar dressing" },
  { id: nextId++, name: "Bruschetta", category: "appetizer", price: 8, description: "Toasted bread with tomatoes, basil, and garlic" },
  { id: nextId++, name: "French Onion Soup", category: "appetizer", price: 9, description: "Caramelized onion broth with gruyere crouton" },
  { id: nextId++, name: "Sparkling Water", category: "drink", price: 4, description: "San Pellegrino 500ml" },
  { id: nextId++, name: "House Red Wine", category: "drink", price: 8, description: "Glass of Chianti Classico" },
  { id: nextId++, name: "Espresso Martini", category: "drink", price: 12, description: "Vodka, coffee liqueur, espresso" },
  { id: nextId++, name: "Fresh Orange Juice", category: "drink", price: 6, description: "Freshly squeezed" },
  { id: nextId++, name: "Chocolate Lava Cake", category: "dessert", price: 10, description: "Warm chocolate cake with molten center" },
  { id: nextId++, name: "Tiramisu", category: "dessert", price: 9, description: "Classic Italian coffee-flavored dessert" },
  { id: nextId++, name: "Crème Brûlée", category: "dessert", price: 11, description: "Vanilla custard with caramelized sugar" },
  { id: nextId++, name: "Garlic Bread", category: "side", price: 5, description: "Toasted baguette with garlic butter" },
  { id: nextId++, name: "Mashed Potatoes", category: "side", price: 6, description: "Creamy butter mashed potatoes" },
  { id: nextId++, name: "Seasonal Vegetables", category: "side", price: 7, description: "Grilled seasonal vegetables" },
];

export async function getMenuItems(): Promise<MenuItem[]> {
  return MENU_ITEMS;
}

export async function getMenuItem(id: number): Promise<MenuItem | undefined> {
  return MENU_ITEMS.find((m) => m.id === id);
}

export async function addMenuItem(
  data: Omit<MenuItem, "id">,
): Promise<MenuItem> {
  const item: MenuItem = { id: nextId++, ...data };
  MENU_ITEMS.push(item);
  return item;
}

export async function updateMenuItem(
  id: number,
  data: Partial<Omit<MenuItem, "id">>,
): Promise<MenuItem | undefined> {
  const item = MENU_ITEMS.find((m) => m.id === id);
  if (!item) return undefined;
  if (data.name !== undefined) item.name = data.name;
  if (data.category !== undefined) item.category = data.category;
  if (data.price !== undefined) item.price = data.price;
  if (data.description !== undefined) item.description = data.description;
  return item;
}

export async function deleteMenuItem(id: number): Promise<void> {
  const idx = MENU_ITEMS.findIndex((m) => m.id === id);
  if (idx !== -1) MENU_ITEMS.splice(idx, 1);
}