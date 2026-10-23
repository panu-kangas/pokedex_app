import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { api } from '../../api/client';
import { makePokemon } from '../../test/fixtures';
import Screen from './Screen';

vi.mock('../../api/client', () => ({ api: { getPokemon: vi.fn() } }));

const getPokemonMock = vi.mocked(api.getPokemon);
const decodeMock = vi.fn<() => Promise<void>>();

beforeEach(() => {
  vi.useFakeTimers();
  getPokemonMock.mockReset();
  getPokemonMock.mockImplementation(async (id) => makePokemon({ id, name: `pokemon-${id}` }));
  decodeMock.mockReset();
  decodeMock.mockResolvedValue();
  // jsdom does not implement HTMLImageElement.decode
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    configurable: true,
    value: decodeMock,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

const advance = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

const image = () => document.querySelector('.pokemon-image');

async function renderShowing(id: number) {
  const view = render(<Screen currentId={id} isBig={false} />);
  await advance(400);
  return view;
}

describe('Screen', () => {
  it('shows only the last Pokémon when the id changes quickly', async () => {
    const signals: AbortSignal[] = [];
    getPokemonMock.mockImplementation(async (id, signal) => {
      if (signal) signals.push(signal);
      return makePokemon({ id, name: `pokemon-${id}` });
    });

    const { rerender } = render(<Screen currentId={1} isBig={false} />);
    rerender(<Screen currentId={2} isBig={false} />);
    rerender(<Screen currentId={3} isBig={false} />);
    await advance(400);

    expect(signals.map((signal) => signal.aborted)).toEqual([true, true, false]);
    expect(screen.getByText('#3')).toBeInTheDocument();
  });

  it('fades out the current Pokémon for the full fade duration even when data is instant', async () => {
    const { rerender } = await renderShowing(1);

    rerender(<Screen currentId={2} isBig={false} />);
    expect(image()).toHaveClass('fade');

    await advance(399);
    expect(screen.getByText('#1')).toBeInTheDocument();

    await advance(1);
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(image()).not.toHaveClass('fade');
  });

  it('keeps the current Pokémon until the next sprite is decoded', async () => {
    const { rerender } = await renderShowing(1);
    let finishDecode = () => {};
    decodeMock.mockReturnValueOnce(new Promise<void>((resolve) => (finishDecode = resolve)));

    rerender(<Screen currentId={2} isBig={false} />);
    await advance(1000);
    expect(screen.getByText('#1')).toBeInTheDocument();

    finishDecode();
    await advance(0);
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('still shows the Pokémon if its sprite fails to load', async () => {
    decodeMock.mockRejectedValueOnce(new Error('EncodingError'));

    await renderShowing(1);

    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('aborts the in-flight request when the id changes', async () => {
    const signals: AbortSignal[] = [];
    getPokemonMock.mockImplementation((_id, signal) => {
      if (signal) signals.push(signal);
      return new Promise(() => {});
    });

    const { rerender } = render(<Screen currentId={1} isBig={false} />);
    rerender(<Screen currentId={2} isBig={false} />);

    expect(signals[0]?.aborted).toBe(true);
  });
});
