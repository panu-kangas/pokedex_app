import type { ApiErrorBody, Pokemon, TypeCounts, WeightDistribution } from '@pokedex/shared';

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { signal });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body?.message ?? `Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export const api = {
  getPokemon: (id: number, signal?: AbortSignal) => request<Pokemon>(`/api/pokemon/${id}`, signal),
  searchPokemon: (name: string, signal?: AbortSignal) =>
    request<Pokemon[]>(`/api/pokemon-search?name=${encodeURIComponent(name)}`, signal),
  getTypeCounts: (signal?: AbortSignal) => request<TypeCounts>('/api/types-count', signal),
  getWeightDistribution: (signal?: AbortSignal) =>
    request<WeightDistribution>('/api/weight-dist', signal),
};
