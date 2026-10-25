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
const nameLabel = () => document.querySelector('.pokemon-name');

async function renderShowing(id: number) {
  const view = render(<Screen currentId={id} isBig={false} />);
  await advance(400);
  return view;
}

describe('Screen', () => {
  it('fetches only the Pokémon the presses settle on', async () => {
    const { rerender } = await renderShowing(1);

    rerender(<Screen currentId={2} isBig={false} />);
    await advance(100);
    rerender(<Screen currentId={3} isBig={false} />);
    await advance(100);
    rerender(<Screen currentId={4} isBig={false} />);
    await advance(400);

    expect(getPokemonMock.mock.calls.map(([id]) => id)).toEqual([1, 4]);
    expect(nameLabel()).toHaveTextContent('pokemon-4');
  });

  it('updates the number immediately and hides the old name while pending', async () => {
    const { rerender } = await renderShowing(1);

    rerender(<Screen currentId={2} isBig={false} />);

    expect(screen.getByText('#2')).toHaveClass('pending');
    expect(nameLabel()).toHaveTextContent('pokemon-1');
    expect(nameLabel()).toHaveClass('pending');
    expect(image()).toHaveClass('fade');

    await advance(400);
    expect(screen.getByText('#2')).not.toHaveClass('pending');
    expect(nameLabel()).toHaveTextContent('pokemon-2');
    expect(nameLabel()).not.toHaveClass('pending');
  });

  it('keeps the old sprite faded out for the full fade duration even when data is instant', async () => {
    const { rerender } = await renderShowing(1);

    rerender(<Screen currentId={2} isBig={false} />);
    await advance(399);
    expect(nameLabel()).toHaveTextContent('pokemon-1');
    expect(image()).toHaveClass('fade');

    await advance(1);
    expect(nameLabel()).toHaveTextContent('pokemon-2');
    expect(image()).not.toHaveClass('fade');
  });

  it('keeps the current Pokémon until the next sprite is decoded', async () => {
    const { rerender } = await renderShowing(1);
    let finishDecode = () => {};
    decodeMock.mockReturnValueOnce(new Promise<void>((resolve) => (finishDecode = resolve)));

    rerender(<Screen currentId={2} isBig={false} />);
    await advance(1000);
    expect(nameLabel()).toHaveTextContent('pokemon-1');

    finishDecode();
    await advance(0);
    expect(nameLabel()).toHaveTextContent('pokemon-2');
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
    await advance(0);
    rerender(<Screen currentId={2} isBig={false} />);

    expect(signals[0]?.aborted).toBe(true);
  });
});
