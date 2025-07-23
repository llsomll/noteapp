import { useCreateFolder, useDeleteFolder, useGetFolders, useUpdateFolder } from "../api/api-client";
import { useQueryClient } from "@tanstack/react-query";

export function useFolders() {
    const queryClient = useQueryClient();

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

    const updateFolderMutation = useUpdateFolder({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/api/v1/folder/'] });
            },
        },
    });

    const deleteFolderMutation = useDeleteFolder({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/api/v1/folder/'] });
            },
        },
    });

    const foldersQuery = useGetFolders();

    return { 
        createFolderMutation, 
        updateFolderMutation, 
        deleteFolderMutation,
        foldersQuery
    };
}

