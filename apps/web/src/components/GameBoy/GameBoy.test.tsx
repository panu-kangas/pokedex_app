import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameBoy from './GameBoy';

vi.mock('./Screen', () => ({
  default: ({ currentId }: { currentId: number }) => <p>showing {currentId}</p>,
}));

describe('GameBoy', () => {
  it('wraps around at both ends of the Pokédex', async () => {
    const user = userEvent.setup();
    render(<GameBoy />);

    await user.click(screen.getByRole('button', { name: 'Previous Pokémon' }));
    expect(screen.getByText('showing 151')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next Pokémon' }));
    expect(screen.getByText('showing 1')).toBeInTheDocument();
  });
});
