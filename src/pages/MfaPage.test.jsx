import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { AuthDriver } from '../test/AuthDriver.jsx';
import MfaPage from './MfaPage.jsx';

function renderMfaPage() {
  let driver;
  render(
    <AuthProvider>
      <AuthDriver ref={(r) => (driver = r)} />
      <MemoryRouter initialEntries={['/mfa']}>
        <Routes>
          <Route path="/login" element={<div>Login Screen</div>} />
          <Route path="/mfa" element={<MfaPage />} />
          <Route path="/protected" element={<div>Protected Screen</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
  act(() => driver.login('reader@alkira.dev', 'ReadOnly123!'));
  return {
    getPendingOtp: () => driver.pendingOtp,
  };
}

describe('MfaPage', () => {
  it('displays the generated code in the "code sent" banner', () => {
    const { getPendingOtp } = renderMfaPage();
    const code = getPendingOtp();
    expect(screen.getByText(new RegExp(code))).toBeInTheDocument();
  });

  it('the verify button stays disabled until 6 digits are entered', async () => {
    const user = userEvent.setup();
    renderMfaPage();

    const verifyButton = screen.getByRole('button', { name: /verify code/i });
    expect(verifyButton).toBeDisabled();

    await user.click(screen.getByLabelText('Digit 1 of 6'));
    await user.keyboard('123');
    expect(verifyButton).toBeDisabled();
  });

  it('"Back to login" logs out and returns to /login', async () => {
    const user = userEvent.setup();
    renderMfaPage();

    await user.click(screen.getByRole('button', { name: /back to login/i }));

    expect(await screen.findByText('Login Screen')).toBeInTheDocument();
  });
});
