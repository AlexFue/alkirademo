import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { OtpInput } from '../components/OtpInput/OtpInput.jsx';
import { AppToast } from '../components/AppToast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function MfaPage() {
  const { pendingUser, pendingOtp, verifyOtp, resendOtp, logout } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [toastOpen, setToastOpen] = useState(true);
  const [toastCode, setToastCode] = useState(pendingOtp);

  // Re-open the "code sent" banner whenever a fresh code is generated.
  useEffect(() => {
    setToastCode(pendingOtp);
    setToastOpen(true);
  }, [pendingOtp]);

  // Handle OTP verification when the user submits the code
  const handleVerify = () => {
    const result = verifyOtp(code);
    if (result.success) {
      navigate('/protected');
      return;
    }
    setError(result.error);
    setCode('');
  };

  // Handle resending the OTP
  const handleResend = () => {
    resendOtp();
    setError('');
    setCode('');
  };

  const handleBackToLogin = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box className="flex min-h-screen items-center justify-center p-6" sx={{ bgcolor: 'background.default' }}>
      <AppToast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        severity="info"
        message={`We sent a verification code to ${pendingUser?.email}: ${toastCode}`}
      />

      <Card className="w-full max-w-sm">
        <CardContent>
          <Stack spacing={3}>
            <div>
              <Typography variant="h5" component="h1" gutterBottom>
                Enter your code
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter the 6-digit code shown in the banner above.
              </Typography>
            </div>

            {error && (
              <Typography role="alert" color="error" variant="body2">
                {error}
              </Typography>
            )}

            <OtpInput
              value={code}
              onChange={setCode}
              error={!!error}
              autoFocus
            />

            <Button
              variant="contained"
              size="large"
              disabled={code.length !== 6}
              onClick={handleVerify}
            >
              Verify code
            </Button>

            <Stack spacing={2} direction="column" justifyContent="space-between">
              <Link display="block" component="button" type="button" onClick={handleResend}>
                Resend code
              </Link>
              <Link display="block" component="button" type="button" onClick={handleBackToLogin}>
                Back to login
              </Link>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
