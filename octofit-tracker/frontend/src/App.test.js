import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders navigation and default route', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText(/OctoFit Tracker/i)).toBeInTheDocument();
  // nav links are present
  expect(screen.getByRole('link', { name: /Activities/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Leaderboard/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Teams/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Users/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Workouts/i })).toBeInTheDocument();
});
