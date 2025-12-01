import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMockLocalStorage } from './test-helpers';

import AuthProvider from '../components/auth/AuthProvider';
import SignUp from '../pages/SignUp';

const mockNavigate = jest.fn();

// This lets us assert that successful register redirects home.
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('Register', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockNavigate.mockClear();

    Object.defineProperty(window, 'localStorage', {
      value: createMockLocalStorage(),
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('lets the user fill out each field', async () => {
    render(
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    );

    // Wait for AuthProvider's validate effect to run and settle
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/validate'), expect.anything());
    });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    // Step 1: show the component react to typing.
    fireEvent.change(usernameInput, { target: { name: 'username', value: 'student' } });
    fireEvent.change(emailInput, { target: { name: 'email', value: 'student@test.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: '123456' } });

    expect(usernameInput).toHaveValue('student');
    expect(emailInput).toHaveValue('student@test.com');
    expect(passwordInput).toHaveValue('123456');
  });

  test('registers and sets user in AuthProvider (signed in)', async () => {

    // Render a component that uses the context hook
    const DisplayUser = () => {
      const { user } = require('../components/auth/AuthContext').useAuth();
      return (
        <>
          <div data-testid="username">{user ? user.username : 'no-user'}</div>
          <div data-testid="email">{user ? user.email : 'no-email'}</div>
        </>
      )
    };

    // Mock fetch responses
    global.fetch.mockImplementation((url, options) => {
      const s = String(url || '');

      if (s.includes('/auth/validate')) {
        return Promise.resolve({ ok: true, json: async () => ({ valid: false, user: null }) });
      }

      if (s.includes('/auth/signup')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'User registered successfully', user: { username: 'student', email: 'student@test.com' }, token: 'new-token' })
        });
      }

      return Promise.resolve({ ok: true, json: async () => ({}) });
    });

    render(
      <AuthProvider>
        <SignUp />
        <DisplayUser />
      </AuthProvider>
    );

    // Wait for AuthProvider's validate effect to run and settle before interacting
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/validate'), expect.anything());
    });

    fireEvent.change(screen.getByLabelText(/username/i), { target: { name: 'username', value: 'student' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { name: 'email', value: 'student@test.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { name: 'password', value: '123456' } });
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), { target: { name: 'confirmPassword', value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait until the provider's user is set and reflected by DisplayUser
    await waitFor(() => {
      expect(screen.getByTestId('username')).toHaveTextContent('student');
      expect(screen.getByTestId('email')).toHaveTextContent('student@test.com');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
