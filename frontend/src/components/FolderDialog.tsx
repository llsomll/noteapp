import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';
import { useEffect, useState } from 'react';

type FolderFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
  initialValues?: { id: string; name: string } | null;
};

export default function FolderDialog({
  open,
  onClose,
  onSubmit,
  initialValues,
}: FolderFormProps) {
  const [name, setName] = useState('');


  useEffect(() => {
    setName(initialValues?.name || '');
  }, [initialValues, open]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim() });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{initialValues ? 'Edit Folder' : 'Add Folder'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Folder Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialValues ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
