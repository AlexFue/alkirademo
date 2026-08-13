import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { loginSchema } from '../schemas/loginSchema.js';
import { PasswordField } from '../components/PasswordField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  // Access the login function from the authentication context
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');

  // React Hook Form setup for form state management and validation using Zod schema
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  // 
  const onSubmit = ({ email, password }) => {
    setAuthError('');
    const result = login(email, password);
    if (!result.success) {
      // set error message from login failure
      setAuthError(result.error);
      return;
    }
    navigate('/mfa');
  };

  return (
    <Box className="flex min-h-screen items-center justify-center p-6" sx={{ bgcolor: 'background.default' }}>
      <Card className="w-full max-w-sm">
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Typography variant="h5" component="h1" gutterBottom>
                Sign in
              </Typography>
            </div>

            {authError && <Alert severity="error">{authError}</Alert>}

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordField
                  {...field}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
              )}
            />

            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              Sign in
            </Button>

            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/signup">
                Sign up
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
