import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { api } from '../../api/client';
import { makePokemon } from '../../test/fixtures';
import Screen from './Screen';

vi.mock('../../api/client', () => ({ api: { getPokemon: vi.fn() } }));

const getPokemonMock = vi.mocked(api.getPokemon);

beforeEach(() => {
  vi.useFakeTimers();
  getPokemonMock.mockReset();
  getPokemonMock.mockImplementation(async (id) => makePokemon({ id, name: `pokemon-${id}` }));
});

afterEach(() => {
  vi.useRealTimers();
});

const advance = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

describe('Screen', () => {
  it('only fetches the last Pokémon when the id changes quickly', async () => {
    const { rerender } = render(<Screen currentId={1} isBig={false} />);
    rerender(<Screen currentId={2} isBig={false} />);
    rerender(<Screen currentId={3} isBig={false} />);

    await advance(400);

    expect(getPokemonMock).toHaveBeenCalledTimes(1);
    expect(getPokemonMock).toHaveBeenCalledWith(3, expect.any(AbortSignal));
    expect(screen.getByText('#3')).toBeInTheDocument();
  });

  it('aborts the in-flight request when the id changes', async () => {
    const signals: AbortSignal[] = [];
    getPokemonMock.mockImplementation((_id, signal) => {
      if (signal) signals.push(signal);
      return new Promise(() => {});
    });

    const { rerender } = render(<Screen currentId={1} isBig={false} />);
    await advance(400);
    rerender(<Screen currentId={2} isBig={false} />);

    expect(signals[0]?.aborted).toBe(true);
  });
});
