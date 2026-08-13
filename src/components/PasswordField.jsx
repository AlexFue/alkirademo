import { forwardRef, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

/**
 * MUI TextField with a show/hide toggle, forwarding a ref so it can be
 * wired through react-hook-form's <Controller> like any other text input.
 */
export const PasswordField = forwardRef(function PasswordField(
  { label = 'Password', ...textFieldProps },
  ref,
) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...textFieldProps}
      inputRef={ref}
      label={label}
      type={visible ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={visible ? 'Hide password' : 'Show password'}
                onClick={() => setVisible((v) => !v)}
                edge="end"
                tabIndex={-1}
              >
                {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
});
