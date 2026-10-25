import { describe, expect, it } from 'vitest';
import { mapWithConcurrency } from '../src/utils/map-with-concurrency.js';

describe('mapWithConcurrency', () => {
  it('keeps input order and never exceeds the limit', async () => {
    let inFlight = 0;
    let maxInFlight = 0;

    const results = await mapWithConcurrency([30, 10, 20, 5, 15], 2, async (ms) => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, ms));
      inFlight--;
      return ms * 2;
    });

    expect(results).toEqual([60, 20, 40, 10, 30]);
    expect(maxInFlight).toBe(2);
  });

  it('handles an empty list', async () => {
    await expect(mapWithConcurrency([], 3, async (x) => x)).resolves.toEqual([]);
  });
});
