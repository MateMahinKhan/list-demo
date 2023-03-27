import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders List Demo header', () => {
  render(<App />);
  const linkElement = screen.getByText(/List Demo/i);
  expect(linkElement).toBeInTheDocument();
});
