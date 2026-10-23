import { describe, expect, it } from 'vitest';
import { escapeRegex } from '../src/utils/escape-regex.js';

describe('escapeRegex', () => {
  it('escapes every regex metacharacter so the pattern matches literally', () => {
    const special = '.*+?^${}()|[]\\';
    const pattern = new RegExp(`^${escapeRegex(special)}$`);

    expect(pattern.test(special)).toBe(true);
    expect(pattern.test('anything else')).toBe(false);
  });

  it('leaves plain text unchanged', () => {
    expect(escapeRegex('pikachu')).toBe('pikachu');
  });
});
