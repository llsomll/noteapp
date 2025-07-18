import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';

type Folder = {
  id: string;
  name: string;
};

type NoteFormData = {
  id: string;
  title: string;
  content: string;
  folder_id?: string | null;
}

type NoteFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    id?: string;
    folder_id?: string;
  }) => void;
  initialData?: NoteFormData | null;
  folders?: Folder[];
  foldersLoading?: boolean;
  foldersError?: boolean;
};

export default function NoteDialog({
  open,
  onClose,
  initialData,
  onSubmit,
  folders,
  foldersLoading,
  foldersError
}: NoteFormProps) {
  const { palette } = useTheme()
  const theme = useTheme();
  const isEditMode = Boolean(initialData);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folderId, setFolderId] = useState<string | ''>('');
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setFolderId(initialData.folder_id ?? '');
    } else {
      setTitle('');
      setContent('');
      setFolderId('');
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    if (isEditMode && !initialData) {
      console.error("Missing initialData in edit mode");
      return;
    }

    const noteData = {
      title,
      content,
      ...(isEditMode && initialData ? { id: initialData.id } : {}),
      ...(folderId && { folder_id: folderId }),
    };

    onSubmit(noteData);
    onClose();
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle variant='h5'
        sx={{
          bgcolor: `${palette.primary.main}`,
          paddingBottom: '10px',
          marginBottom: '20px',
          color: '#fff'
        }}>{isEditMode ? 'Edit Note' : 'Add Note'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Content"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/* Folder Dropdown */}
        {foldersLoading ? (
          <Typography variant="body2" color="text.secondary">
            Loading folders...
          </Typography>
        ) : foldersError ? (
          <Typography variant="body2" color="error">
            Failed to load folders.
          </Typography>
        ) : (
          <FormControl fullWidth margin="normal">
            <InputLabel id="folder-select-label">Folder (Optional)</InputLabel>
            <Select
              labelId="folder-select-label"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              label="Folder (Optional)"
            >
              <MenuItem value="">None</MenuItem>
              {folders?.map((folder) => (
                <MenuItem key={folder.id} value={folder.id}>
                  {folder.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEditMode ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
