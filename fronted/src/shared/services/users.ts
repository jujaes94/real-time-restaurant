import type { Role } from "./roles";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  token: string;
  restaurantId: string | null;
  password?: string;
}

export const USERS: User[] = [
  {
    id: "admin-1",
    email: "admin@demo.com",
    name: "Alex Admin",
    role: "admin",
    token: "",
    restaurantId: null,
  },
  {
    id: "manager-1",
    email: "manager@demo.com",
    name: "Morgan Manager",
    role: "manager",
    token: "",
    restaurantId: "1",
  },
  {
    id: "waitress-1",
    email: "waitress@demo.com",
    name: "Wendy Waitress",
    role: "waitress",
    token: "",
    restaurantId: null,
  },
];

export function findUser(email: string, password: string): User | null {
  const match = USERS.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password,
  );
  return match ?? null;
}
