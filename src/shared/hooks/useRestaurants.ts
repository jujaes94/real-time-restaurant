"use client";

import { useState } from "react";

import type { Restaurant } from "@/shared/services/restaurants";

interface UseRestaurantsState {
  data: Restaurant[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useRestaurants(initialData: Restaurant[]): UseRestaurantsState {
  const [data] = useState<Restaurant[] | null>(initialData);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  return { data, isLoading, error };
}
