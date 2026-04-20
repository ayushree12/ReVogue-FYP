import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

describe('Login form', () => {
  it('shows email and password fields', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });
});
