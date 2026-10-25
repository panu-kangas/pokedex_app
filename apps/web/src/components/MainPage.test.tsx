import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MainPage from './MainPage';
import { NAV_LINKS } from './Layout/NavBar';

// The data-driven sections have their own tests; here only the page structure matters
vi.mock('./GameBoy/GameBoy', () => ({ default: () => null }));
vi.mock('./DataCharts/TypesCountChart', () => ({ default: () => null }));
vi.mock('./DataCharts/WeightDistChart', () => ({ default: () => null }));
vi.mock('./SearchBar/SearchBar', () => ({ default: () => null }));

describe('MainPage', () => {
  it('links every nav item to a section that exists on the page', () => {
    const { container } = render(<MainPage />);

    for (const { href, label } of NAV_LINKS) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href);
      expect(container.querySelector(href)).toBeInTheDocument();
    }
  });

  it('gives each section a labelled heading', () => {
    render(<MainPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('original 151');
    expect(screen.getByRole('region', { name: 'Flip through the Pokédex' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Gen I by the numbers' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Find any Pokémon' })).toBeInTheDocument();
  });
});
