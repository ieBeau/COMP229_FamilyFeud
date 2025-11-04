/**
 * @file navigation.js
 * @author Alex Kachur
 * @since 2025-11-04
 * @purpose Centralizes route metadata for the Family Feud front-end.
 */
export const NAV_ITEMS = [
  {
    path: '/',
    label: 'Dashboard',
    description: 'Control surface for hosts with quick stats and active sessions.',
  },
  {
    path: '/question-sets',
    label: 'Question Sets',
    description: 'Create, edit, and curate survey banks for upcoming matches.',
  },
  {
    path: '/sessions',
    label: 'Sessions',
    description: 'Monitor in-progress games, manage teams, and launch rounds.',
  },
  {
    path: '/player',
    label: 'Player Join',
    description: 'Entry point for contestants to join matches using an access code.',
  },
];

export const AUTH_NAV_ITEMS = [
  {
    path: '/signin',
    label: 'Sign In',
    description: 'Authenticate as host or producer to manage game content.',
  },
  {
    path: '/signup',
    label: 'Register',
    description: 'Provision a new host account with role-based permissions.',
  },
];
