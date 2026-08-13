import { Alert, Snackbar } from '@mui/material';

/**
 * Thin Snackbar/Alert wrapper. Used for the "we sent you a code" MFA banner,
 * standing in for an SMS/email send that can't actually happen without a
 * real backend.
 */
export function AppToast({ open, message, severity = 'info', onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={severity === 'info' ? 8000 : null}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
