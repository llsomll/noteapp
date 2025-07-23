import React, { useState } from 'react'
import { Box, Typography, useTheme, Fab, IconButton } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useGetFolders, useGetNotes } from '../../api/api-client'
import { useFolders } from '../../hooks/useFolders';
import FolderDialog from '../FolderDialog'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FoldersPage() {
    const { palette } = useTheme();
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [editingFolder, setEditingFolder] = useState<{ id: string; name: string } | null>(null);
    const isDialogOpen = openDialog || editingFolder !== null;

    const {
        data: folders = [],
        isLoading,
        isError,
    } = useGetFolders();
    const { data: notes = [] } = useGetNotes();

    const { createFolderMutation, updateFolderMutation, deleteFolderMutation } = useFolders();

    const colors = ['#FFAB91', '#FFF59D', '#C5CAE9', '#90CAF9', '#B2DFDB'];
    const bgColors = ['#FF7043', '#FDD835', '#7986CB', '#64B5F6', '#4DB6AC'];


    const noteCountMap = notes.reduce((acc, note) => {
        if (note.folder_id) {
            acc[note.folder_id] = (acc[note.folder_id] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);


    const handleCreateFolder = (data: { name: string }) => {
        createFolderMutation.mutate({ data });
    };

    const handleEditFolder = (id: string, name: string) => {
        updateFolderMutation.mutate({ folderId: id, data: { name } });
    };

    const handleDeleteFolder = (id: string) => {
        deleteFolderMutation.mutate({ folderId: id });
    };


    return (
        <Box p={3}>
            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{
                    borderBlockEnd: `solid 2px ${palette.primary.main}`,
                    writingMode: 'horizontal-tb',
                    paddingBottom: '4px',
                    marginBottom: '20px',
                    color: palette.primary.main
                }}
            >
                Folders
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2}>
                {isError && (
                    <Typography color="error" mb={2}>
                        Failed to load folders.
                    </Typography>
                )}

                {!isLoading && folders?.map((folder, index) => {
                    const color = colors[index % colors.length];
                    const bgColor = bgColors[index % bgColors.length];
                    return (
                        <Box
                            key={folder.id}
                            onClick={() =>
                                navigate({ to: '/folder/$folderId', params: { folderId: folder.id } })
                            }
                            sx={{
                                width: 200,
                                height: 150,
                                position: 'relative',
                                cursor: 'pointer',
                                perspective: 1000,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    width: '100%',
                                    height: '92%',
                                    borderRadius: '8px',
                                    backgroundColor: bgColor,
                                    zIndex: 1,
                                    boxShadow: 3,
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '40%',
                                    height: '50%',
                                    borderRadius: '4px',
                                    backgroundColor: bgColor,
                                    zIndex: 2,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '92%',
                                    borderRadius: '8px',
                                    backgroundColor: color,
                                    zIndex: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    padding: 1,
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {folder.name} ({noteCountMap[folder.id] || 0})
                                </Typography>
                            </Box>

                            {/* Edit/Delete icons */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top:110,
                                    right: 1,
                                    zIndex: 4,
                                    display: 'flex',
                                }}>
                                <IconButton onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Delete folder "${folder.name}"?`)) {
                                        handleDeleteFolder(folder.id);
                                    }
                                }}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                                <IconButton onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingFolder({ id: folder.id, name: folder.name });
                                }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Box>

                        </Box>
                    )
                })}
            </Box>


            <Fab
                color="primary"
                aria-label="add"
                onClick={() => { setOpenDialog(true); }}
                sx={{
                    position: 'fixed',
                    bottom: 50,
                    right: 50,
                    width: 60,
                    height: 60,
                }}
            >
                <AddIcon sx={{ fontSize: 35 }} />
            </Fab>

            <FolderDialog
                key={editingFolder?.id || 'new'}
                open={isDialogOpen}
                onClose={() => {
                    setOpenDialog(false);
                    setEditingFolder(null);
                }}
                onSubmit={(data) => {
                    if (editingFolder) {
                        handleEditFolder(editingFolder.id, data.name);
                        setEditingFolder(null);
                    } else {
                        handleCreateFolder(data);
                    }
                    setOpenDialog(false);
                }}
                initialValues={editingFolder}
            />

        </Box>
    )
}
