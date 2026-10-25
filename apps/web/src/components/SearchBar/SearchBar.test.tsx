import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { api, ApiError } from '../../api/client';
import { makePokemon } from '../../test/fixtures';
import SearchBar from './SearchBar';

vi.mock('../../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/client')>();
  return { ...actual, api: { searchPokemon: vi.fn() } };
});

const searchMock = vi.mocked(api.searchPokemon);

beforeEach(() => {
  searchMock.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

async function searchFor(text: string) {
  const user = userEvent.setup();
  render(<SearchBar />);
  if (text) await user.type(screen.getByPlaceholderText('Type Pokémon name...'), text);
  await user.click(screen.getByRole('button', { name: 'Search' }));
}

describe('SearchBar', () => {
  it('shows a card for each result', async () => {
    searchMock.mockResolvedValue([
      makePokemon({ id: 4, name: 'charmander' }),
      makePokemon({ id: 6, name: 'charizard', types: ['fire', 'flying'] }),
    ]);

    await searchFor('char');

    expect(searchMock).toHaveBeenCalledWith('char');
    expect(await screen.findByText(/Charmander/)).toBeInTheDocument();
    expect(screen.getByText(/Charizard/)).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('searches when Enter is pressed', async () => {
    searchMock.mockResolvedValue([makePokemon({ id: 25, name: 'pikachu', types: ['electric'] })]);
    const user = userEvent.setup();
    render(<SearchBar />);

    await user.type(screen.getByRole('searchbox', { name: 'Pokémon name' }), 'pika{Enter}');

    expect(searchMock).toHaveBeenCalledWith('pika');
    expect(await screen.findByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('does not call the API for a blank query', async () => {
    await searchFor('   ');

    expect(searchMock).not.toHaveBeenCalled();
    expect(screen.getByText('No results yet')).toBeInTheDocument();
  });

  // Current behaviour: API failures look the same as "no matches". A real error state comes with the PR 11 search rework.
  it('falls back to "not found" when the API request fails', async () => {
    searchMock.mockRejectedValue(new ApiError(500, 'Internal server error'));

    await searchFor('pikachu');

    expect(await screen.findByText('Pokémon not found')).toBeInTheDocument();
  });
});
