export interface Restaurant {
  id: number;
  name: string;
  city: string;
}

export const RESTAURANTS: Restaurant[] = [
  { id: 1, name: "La Petite", city: "Paris" },
  { id: 2, name: "Sushi Zen", city: "Tokyo" },
  { id: 3, name: "Pasta House", city: "Rome" },
  { id: 4, name: "Burger Barn", city: "New York" },
  { id: 5, name: "Curry Corner", city: "Delhi" },
];

export async function getRestaurants(): Promise<Restaurant[]> {
  return RESTAURANTS;
}
