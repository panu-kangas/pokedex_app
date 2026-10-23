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

  it('does not call the API for a blank query', async () => {
    await searchFor('   ');

    expect(searchMock).not.toHaveBeenCalled();
    expect(screen.getByText('No results yet')).toBeInTheDocument();
  });

  it('shows "not found" when the request fails', async () => {
    searchMock.mockRejectedValue(new ApiError(400, 'Search must be 1-30 characters'));

    await searchFor('x');

    expect(await screen.findByText('Pokémon not found')).toBeInTheDocument();
  });
});
