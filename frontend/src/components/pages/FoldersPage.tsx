import React, { useState } from 'react'
import { Box, Typography, useTheme, Fab } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useCreateFolder, useGetFolders, useGetNotes } from '../../api/api-client'
import FolderDialog from '../FolderDialog'
import { useQueryClient } from '@tanstack/react-query'
import AddIcon from '@mui/icons-material/Add';

export default function FoldersPage() {
    const { palette } = useTheme();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {
        data: folders = [],
        isLoading,
        isError,
    } = useGetFolders();
    const { data: notes = [] } = useGetNotes();

    const [openDialog, setOpenDialog] = useState(false);



    const colors = ['#FFAB91', '#FFF59D', '#C5CAE9', '#90CAF9', '#B2DFDB'];
    const bgColors = ['#FF7043', '#FDD835', '#7986CB', '#64B5F6', '#4DB6AC'];


    const noteCountMap = notes.reduce((acc, note) => {
        if (note.folder_id) {
            acc[note.folder_id] = (acc[note.folder_id] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);


    const createFolderMutation = useCreateFolder({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/api/v1/folder/'] });
            },
            onError: (error) => {
                console.error('Failed to create folder', error);
            },
        },
    });


    const handleCreateFolder = (data: { name: string }) => {
        createFolderMutation.mutate({ data });
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
                                width: 150,
                                height: 110,
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
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={handleCreateFolder}
            />

        </Box>
    )
}
