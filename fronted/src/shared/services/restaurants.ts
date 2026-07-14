export interface Restaurant {
  id: number;
  name: string;
  city: string;
}

export const RESTAURANTS: Restaurant[] = [
  { id: 1, name: "La Petite", city: "Paris" },
  { id: 2, name: "Sushi Zen", city: "Tokyo" },
  { id: 3, name: "Pasta House", city: "Rome" },
];

export async function getRestaurants(): Promise<Restaurant[]> {
  return RESTAURANTS;
}

export async function getRestaurant(id: number): Promise<Restaurant | undefined> {
  return RESTAURANTS.find((r) => r.id === id);
}
