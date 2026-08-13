import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink } from 'react-router-dom';
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
import { signupSchema } from '../schemas/signupSchema.js';
import { PasswordField } from '../components/PasswordField.jsx';

// Reachable from Login, but intentionally doesn't create a usable account
export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = () => {
    setSubmitted(true);
  };

  return (
    <Box className="flex min-h-screen items-center justify-center p-6" sx={{ bgcolor: 'background.default' }}>
      <Card className="w-full max-w-sm">
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Typography variant="h5" component="h1" gutterBottom>
                Create an account
              </Typography>
            </div>

            {submitted && (
              <Alert severity="success">
                Account created
              </Alert>
            )}

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
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PasswordField
                  {...field}
                  label="Confirm password"
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  fullWidth
                />
              )}
            />

            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              Sign up
            </Button>

            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Sign in
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
