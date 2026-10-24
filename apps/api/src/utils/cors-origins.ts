import { escapeRegex } from './escape-regex.js';

export type CorsOrigin = string | RegExp;

// "*" matches within a single hostname label (letters, digits, hyphens), never across dots
export function parseCorsOrigins(value: string): CorsOrigin[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) =>
      origin.includes('*')
        ? new RegExp(`^${escapeRegex(origin).replaceAll('\\*', '[a-z0-9-]+')}$`)
        : origin,
    );
}
