export type MenuCategory = "appetizer" | "main" | "dessert" | "drink" | "side";

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  ingredients: string;
  category: MenuCategory;
  size: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isActive: boolean;
  isAvailable: boolean;
  allergens: string | null;
  preparationTime: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

function toCamel(obj: Record<string, unknown>): MenuItem {
  return {
    id: obj.id as string,
    restaurantId: obj.restaurant_id as string,
    name: obj.name as string,
    description: (obj.description as string) ?? "",
    price: obj.price as number,
    ingredients: (obj.ingredients as string) ?? "",
    category: obj.category as MenuCategory,
    size: obj.size as string,
    isVegetarian: obj.is_vegetarian as boolean,
    isVegan: obj.is_vegan as boolean,
    isActive: obj.is_active as boolean,
    isAvailable: obj.is_available as boolean,
    allergens: (obj.allergens as string | null) ?? null,
    preparationTime: (obj.preparation_time as number | null) ?? null,
    imageUrl: (obj.image_url as string | null) ?? null,
    createdAt: obj.created_at as string,
    updatedAt: obj.updated_at as string,
  };
}

function toSnake(data: Partial<MenuItem>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.name !== undefined) out.name = data.name;
  if (data.description !== undefined) out.description = data.description;
  if (data.price !== undefined) out.price = data.price;
  if (data.ingredients !== undefined) out.ingredients = data.ingredients;
  if (data.category !== undefined) out.category = data.category;
  if (data.size !== undefined) out.size = data.size;
  if (data.isVegetarian !== undefined) out.is_vegetarian = data.isVegetarian;
  if (data.isVegan !== undefined) out.is_vegan = data.isVegan;
  if (data.isActive !== undefined) out.is_active = data.isActive;
  if (data.isAvailable !== undefined) out.is_available = data.isAvailable;
  if (data.allergens !== undefined) out.allergens = data.allergens;
  if (data.preparationTime !== undefined) out.preparation_time = data.preparationTime;
  if (data.imageUrl !== undefined) out.image_url = data.imageUrl;
  if (data.restaurantId !== undefined) out.restaurant_id = data.restaurantId;
  return out;
}

export async function getMenuItems(token: string, restaurantId: string): Promise<MenuItem[]> {
  const res = await fetch(`http://localhost:8000/menus?restaurant_id=${restaurantId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch menu items: ${res.statusText}`);
  const data = (await res.json()) as Record<string, unknown>[];
  return data.map(toCamel);
}

export async function createMenuItem(token: string, data: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch("http://localhost:8000/menus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(toSnake(data)),
  });
  if (!res.ok) throw new Error(`Failed to create menu item: ${res.statusText}`);
  return toCamel((await res.json()) as Record<string, unknown>);
}

export async function updateMenuItem(token: string, id: string, data: Partial<MenuItem>): Promise<MenuItem> {
  const res = await fetch(`http://localhost:8000/menus/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(toSnake(data)),
  });
  if (!res.ok) throw new Error(`Failed to update menu item: ${res.statusText}`);
  return toCamel((await res.json()) as Record<string, unknown>);
}

export async function deleteMenuItem(token: string, id: string): Promise<void> {
  const res = await fetch(`http://localhost:8000/menus/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to delete menu item: ${res.statusText}`);
}

export async function toggleMenuItemAvailability(token: string, id: string, isAvailable: boolean): Promise<MenuItem> {
  const res = await fetch(`http://localhost:8000/menus/${id}/availability`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ is_available: isAvailable }),
  });
  if (!res.ok) throw new Error(`Failed to toggle availability: ${res.statusText}`);
  return toCamel((await res.json()) as Record<string, unknown>);
}

// ── Mock data for backward compat (tables/orders pages not yet connected) ──

let mockNextId = 101;

export interface LegacyMenuItem {
  id: number;
  restaurantId: number;
  name: string;
  category: string;
  price: number;
  description: string;
}

const MOCK_ITEMS: LegacyMenuItem[] = [
  { id: 1, restaurantId: 1, name: "Grilled Salmon", category: "main", price: 24, description: "Atlantic salmon with herbs" },
  { id: 2, restaurantId: 1, name: "Beef Tenderloin", category: "main", price: 32, description: "8oz tenderloin" },
  { id: 3, restaurantId: 1, name: "Caesar Salad", category: "appetizer", price: 10, description: "Romaine, parmesan" },
  { id: 4, restaurantId: 1, name: "Chocolate Lava Cake", category: "dessert", price: 10, description: "Warm chocolate cake" },
  { id: 5, restaurantId: 2, name: "Vegetable Risotto", category: "main", price: 16, description: "Creamy arborio rice" },
  { id: 6, restaurantId: 2, name: "Bruschetta", category: "appetizer", price: 8, description: "Toasted bread with tomatoes" },
  { id: 7, restaurantId: 2, name: "House Red Wine", category: "drink", price: 8, description: "Glass of Chianti" },
  { id: 8, restaurantId: 2, name: "Crème Brûlée", category: "dessert", price: 11, description: "Vanilla custard" },
  { id: 9, restaurantId: 3, name: "Sparkling Water", category: "drink", price: 4, description: "San Pellegrino" },
  { id: 10, restaurantId: 3, name: "Tiramisu", category: "dessert", price: 9, description: "Classic Italian" },
];

export async function getMockMenuItems(): Promise<LegacyMenuItem[]> {
  return MOCK_ITEMS;
}
