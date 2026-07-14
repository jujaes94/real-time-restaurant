export interface Waitress {
  id: number;
  fullName: string;
  restaurantId: number;
  workingHours: string;
}

let nextId = 1;

const WAITRESSES: Waitress[] = [
  { id: nextId++, fullName: "Maria Garcia", restaurantId: 1, workingHours: "09:00 - 17:00" },
  { id: nextId++, fullName: "Sofia Rodriguez", restaurantId: 1, workingHours: "12:00 - 20:00" },
  { id: nextId++, fullName: "Lucia Martinez", restaurantId: 2, workingHours: "08:00 - 16:00" },
  { id: nextId++, fullName: "Ana Lopez", restaurantId: 3, workingHours: "11:00 - 19:00" },
];

export async function getWaitresses(): Promise<Waitress[]> {
  return WAITRESSES;
}

export async function addWaitress(
  data: Omit<Waitress, "id">,
): Promise<Waitress> {
  const waitress: Waitress = { id: nextId++, ...data };
  WAITRESSES.push(waitress);
  return waitress;
}

export async function deleteWaitress(id: number): Promise<void> {
  const idx = WAITRESSES.findIndex((w) => w.id === id);
  if (idx !== -1) WAITRESSES.splice(idx, 1);
}