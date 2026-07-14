import type { Role } from "./roles";

export interface User {
  email: string;
  name: string;
  role: Role;
  password: string;
}

export const USERS: User[] = [
  {
    email: "admin@demo.com",
    name: "Alex Admin",
    role: "admin",
    password: "admin",
  },
  {
    email: "manager@demo.com",
    name: "Morgan Manager",
    role: "manager",
    password: "manager",
  },
  {
    email: "waitress@demo.com",
    name: "Wendy Waitress",
    role: "waitress",
    password: "waitress",
  },
];

export function findUser(email: string, password: string): User | null {
  const match = USERS.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password,
  );
  return match ?? null;
}
