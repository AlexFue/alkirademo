import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { AppLayout } from '../components/AppLayout.jsx';
import { PROTECTED_ITEMS } from '../mocks/protectedScreenItems.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const canEdit = user?.role === 'read-write';

  const [items, setItems] = useState(PROTECTED_ITEMS);
  const [editingItem, setEditingItem] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
  };

  const closeEditDialog = () => setEditingItem(null);
  const saveEdit = () => {
    closeEditDialog();
  };

  return (
    <AppLayout userRole={user?.role} onLogout={handleLogout}>
      <Typography variant="h5" component="h1" gutterBottom>
        Network Resources
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {canEdit
          ? 'You have read/write access — edit actions are enabled.'
          : 'You have read-only access — edit actions are disabled.'}
      </Typography>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">
                  <Tooltip title={canEdit ? 'Edit' : 'Read-only access'}>
                    {/* span wrapper so the tooltip still works while the button is disabled */}
                    <span>
                      <IconButton
                        aria-label={`Edit ${item.name}`}
                        disabled={!canEdit}
                        onClick={() => openEditDialog(item)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingItem} onClose={closeEditDialog} fullWidth maxWidth="xs">
        <DialogTitle>Edit resource</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2">
        <DialogContentText>Mock Dialog</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </AppLayout>
  );
}
