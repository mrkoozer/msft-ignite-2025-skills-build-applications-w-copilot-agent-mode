import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => {
  const React = require('react');
  const resolveClassName = (classNameProp) =>
    typeof classNameProp === 'function' ? classNameProp({ isActive: false }) : classNameProp;

  return {
    NavLink: ({ children, className, ...rest }) => (
      <a className={resolveClassName(className)} {...rest}>
        {children}
      </a>
    ),
    BrowserRouter: ({ children }) => <>{children}</>,
    Routes: () => null,
    Route: () => null,
    Navigate: () => null,
  };
}, { virtual: true });

test('renders hero call to action', () => {
  render(<App />);

  expect(
    screen.getByText(/track activities, teams, and workouts in one place/i)
  ).toBeInTheDocument();
});
