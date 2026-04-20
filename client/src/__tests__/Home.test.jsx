import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

describe('Home page', () => {
  it('renders hero heading', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Revogue - sustainable fashion for Nepal/i)).toBeInTheDocument();
  });
});
