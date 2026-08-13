import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { AuthDriver } from '../test/AuthDriver.jsx';
import ProtectedPage from './ProtectedPage.jsx';

function renderAsAuthenticated(email, password) {
  let driver;
  render(
    <AuthProvider>
      <AuthDriver ref={(r) => (driver = r)} />
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Screen</div>} />
          <Route path="/protected" element={<ProtectedPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
  act(() => driver.login(email, password));
  act(() => driver.verifyOtp(driver.pendingOtp));
}

describe('ProtectedPage — read-only role', () => {
  it('shows edit buttons disabled', () => {
    renderAsAuthenticated('reader@alkira.dev', 'ReadOnly123!');

    const editButtons = screen.getAllByRole('button', { name: /^edit/i });
    expect(editButtons.length).toBeGreaterThan(0);
    editButtons.forEach((button) => expect(button).toBeDisabled());
  });

  it('shows a read-only access message', () => {
    renderAsAuthenticated('reader@alkira.dev', 'ReadOnly123!');
    expect(screen.getByText(/read-only access/i)).toBeInTheDocument();
  });
});

describe('ProtectedPage — shared', () => {
  it('logout returns to /login', async () => {
    const user = userEvent.setup();
    renderAsAuthenticated('reader@alkira.dev', 'ReadOnly123!');

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(await screen.findByText('Login Screen')).toBeInTheDocument();
  });
});
