import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { makePokemon } from '../../test/fixtures';
import BigInfoCard from './BigInfoCard';

describe('BigInfoCard', () => {
  it('shows height and weight in metric units', () => {
    render(<BigInfoCard pokemon={makePokemon({ height: 6, weight: 85 })} />);

    expect(screen.getByText(/0\.6 m/)).toBeInTheDocument();
    expect(screen.getByText(/8\.5 kg/)).toBeInTheDocument();
  });

  it('caps stat bars at full width for stats above the scale', () => {
    const pokemon = makePokemon({
      stats: [
        { statName: 'hp', baseStat: 250 },
        { statName: 'attack', baseStat: 75 },
      ],
    });
    const { container } = render(<BigInfoCard pokemon={pokemon} />);

    const widths = [...container.querySelectorAll<HTMLElement>('.stat-fill')].map(
      (bar) => bar.style.width,
    );
    expect(widths).toEqual(['100%', '50%']);
  });
});
