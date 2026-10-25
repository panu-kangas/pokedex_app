import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatBars, { statLevel } from './StatBars';

describe('statLevel', () => {
  it('splits base stats into weak, mid and strong', () => {
    expect([1, 54, 55, 84, 85, 250].map(statLevel)).toEqual([
      'weak',
      'weak',
      'mid',
      'mid',
      'strong',
      'strong',
    ]);
  });
});

describe('StatBars', () => {
  it('labels each bar and colours it by strength', () => {
    render(
      <StatBars
        stats={[
          { statName: 'special-attack', baseStat: 40 },
          { statName: 'speed', baseStat: 120 },
        ]}
      />,
    );

    const [spAtk, speed] = screen.getAllByRole('meter');
    expect(spAtk).toHaveAccessibleName('SP.ATK');
    expect(spAtk).toHaveAttribute('aria-valuenow', '40');
    expect(spAtk?.firstElementChild).toHaveAttribute('data-level', 'weak');
    expect(speed?.firstElementChild).toHaveAttribute('data-level', 'strong');
  });
});
