const React = require('react');

// Minimal mocks sufficient for our App rendering in tests
function BrowserRouter({ children }) {
  return React.createElement(React.Fragment, null, children);
}

function NavLink({ children, to, className }) {
  return React.createElement('a', { href: to, className }, children);
}

function Routes({ children }) {
  // Simply render children; real route matching not needed for tests
  return React.createElement(React.Fragment, null, children);
}

function Route({ element }) {
  return element || null;
}

function Navigate() {
  return null;
}

module.exports = {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  Navigate,
};
