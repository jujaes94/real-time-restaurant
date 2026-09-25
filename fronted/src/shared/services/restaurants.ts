export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

let nextId = 4;

export const RESTAURANTS: Restaurant[] = [
  { id: 1, name: "La Petite", address: "12 Rue de Rivoli, Paris", phone: "+33 1 23 45 67 89", isActive: true },
  { id: 2, name: "Sushi Zen", address: "4-2-8 Ginza, Chuo, Tokyo", phone: "+81 3-1234-5678", isActive: true },
  { id: 3, name: "Pasta House", address: "Via della Croce 15, Rome", phone: "+39 06 1234 5678", isActive: true },
];

export async function getRestaurants(): Promise<Restaurant[]> {
  return RESTAURANTS;
}

export async function getRestaurant(id: number): Promise<Restaurant | undefined> {
  return RESTAURANTS.find((r) => r.id === id);
}

export async function createRestaurant(data: Omit<Restaurant, "id">): Promise<Restaurant> {
  const restaurant: Restaurant = { id: nextId++, ...data };
  RESTAURANTS.push(restaurant);
  return restaurant;
}

export async function updateRestaurant(id: number, data: Partial<Omit<Restaurant, "id">>): Promise<Restaurant | undefined> {
  const restaurant = RESTAURANTS.find((r) => r.id === id);
  if (!restaurant) return undefined;
  if (data.name !== undefined) restaurant.name = data.name;
  if (data.address !== undefined) restaurant.address = data.address;
  if (data.phone !== undefined) restaurant.phone = data.phone;
  if (data.isActive !== undefined) restaurant.isActive = data.isActive;
  return restaurant;
}

export async function deleteRestaurant(id: number): Promise<void> {
  const idx = RESTAURANTS.findIndex((r) => r.id === id);
  if (idx !== -1) RESTAURANTS.splice(idx, 1);
}
