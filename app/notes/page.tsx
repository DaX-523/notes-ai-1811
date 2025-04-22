"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, LogOut } from "lucide-react";
import { NotesList } from "@/components/notes-list";
import { CreateNoteDialog } from "@/components/create-note-dialog";
import { DeleteNoteDialog } from "@/components/delete-note-dialog";
import { SummarizeDialog } from "@/components/summarize-dialog";
import type { Note } from "@/lib/types";
import { EditNoteDialog } from "@/components/edit-note-dialog";
import { NoteSkeleton } from "@/components/note-skeleton";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  fetchNotes,
  summarizeNote,
  updateNote,
} from "@/services/crudNotes";
import Header from "@/components/header";

export default function NotesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSummarizeDialogOpen, setIsSummarizeDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { authState, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // tanstack-query for fetching notes
  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: () => {
      if (!authState.user) return [];
      return fetchNotes(authState.user.id as string);
    },
    enabled: !!authState.user, // Only enable the query when user exists
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onMutate: async (newNote) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Snapshot the previous value
      const previousNotes = queryClient.getQueryData(["notes"]) as Note[];

      // Optimistically update to the new value
      queryClient.setQueryData(["notes"], (old: Note[] = []) => [
        ...old,
        newNote,
      ]);

      // Return a context object with the snapshot value
      return { previousNotes };
    },
    onError: (err, newNote, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
      toast({
        title: "Failed to create note",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onSuccess: () => {
      toast({
        title: "Note Created",
        description: "Your note has been created successfully.",
      });
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onMutate: async (updatedNote) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData(["notes"]) as Note[];

      queryClient.setQueryData(["notes"], (old: Note[] = []) =>
        old.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );

      return { previousNotes };
    },
    onError: (err, updatedNote, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
      toast({
        title: "Failed to update note",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onSuccess: () => {
      toast({
        title: "Note Updated",
        description: "Your note has been updated successfully.",
      });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData(["notes"]) as Note[];

      queryClient.setQueryData(["notes"], (old: Note[] = []) =>
        old.filter((note) => note.id !== params.noteId)
      );

      return { previousNotes };
    },
    onError: (err, params, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
      toast({
        title: "Failed to delete note",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onSuccess: () => {
      toast({
        title: "Note Deleted",
        description: "Your note has been deleted successfully.",
      });
    },
  });

  // Update note summary mutation
  const updateSummaryMutation = useMutation({
    mutationFn: summarizeNote,
    onMutate: async (updatedNote) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData(["notes"]) as Note[];

      queryClient.setQueryData(["notes"], (old: Note[] = []) =>
        old.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      );

      return { previousNotes };
    },
    onError: (err, updatedNote, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
      console.error("Failed to update summary:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Check for loading states from mutations
  const isCreating = createNoteMutation.isPending;
  const isUpdating = updateNoteMutation.isPending;
  const isDeleting = deleteNoteMutation.isPending;
  const isMutating = isCreating || isUpdating || isDeleting;

  useEffect(() => {
    if (!authState.user) {
      router.push("/signin");
    }
  }, [authState.user, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // mutations based on user clicks
  // Define all handlers
  const handleCreateNote = (note: Note) => {
    if (!authState.user) return;
    // Make sure user_id is included
    const noteWithUserId = {
      ...note,
      user_id: authState.user.id,
    };
    createNoteMutation.mutate(noteWithUserId);
    setIsCreateDialogOpen(false);
  };

  const handleEditNote = (updatedNote: Note) => {
    if (!authState.user) return;
    // Make sure user_id is included
    const noteWithUserId = {
      ...updatedNote,
      user_id: authState.user.id,
    };
    updateNoteMutation.mutate(noteWithUserId);
    setIsEditDialogOpen(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = () => {
    if (!authState.user || !selectedNote) return;
    // Pass both noteId and userId for security
    deleteNoteMutation.mutate({
      noteId: selectedNote.id,
      userId: authState.user.id,
    });
    setIsDeleteDialogOpen(false);
    setSelectedNote(null);
  };

  const handleUpdateNoteWithSummary = (updatedNote: Note) => {
    if (!authState.user) return;
    const noteWithUserId = {
      ...updatedNote,
      user_id: authState.user.id,
    };
    updateSummaryMutation.mutate(noteWithUserId);
  };

  const handleEditClick = (note: Note) => {
    setSelectedNote(note);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (note: Note) => {
    setSelectedNote(note);
    setIsDeleteDialogOpen(true);
  };

  const handleSummarizeClick = (note: Note) => {
    setSelectedNote(note);
    setIsSummarizeDialogOpen(true);
  };

  const handleViewSummary = (note: Note) => {
    setSelectedNote(note);
    setIsSummarizeDialogOpen(true);
  };

  // for route protection
  if (!authState.user) {
    return null;
  }

  // Rest of the component rendering logic
  return (
    <div className="flex min-h-screen flex-col">
      <Header onSignOut={handleSignOut} />
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Notes</h1>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isCreating}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Note
            {isCreating && (
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <NoteSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">
            Error loading notes. Please try again.
          </div>
        ) : (
          <>
            <NotesList
              notes={notes}
              onEditNote={handleEditClick}
              onDeleteNote={handleDeleteClick}
              onSummarizeNote={handleSummarizeClick}
              onViewSummary={handleViewSummary}
              isLoading={isMutating}
            />

            {notes.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  You don&apos;t have any notes yet.
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isCreating}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Note
                  {isCreating && (
                    <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <CreateNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateNote={handleCreateNote}
        isLoading={isCreating}
        userId={authState.user.id}
      />

      {selectedNote && (
        <EditNoteDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          note={selectedNote}
          onUpdateNote={handleEditNote}
          isLoading={isUpdating}
        />
      )}

      {selectedNote && (
        <DeleteNoteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteNote}
          note={selectedNote}
          isLoading={isDeleting}
        />
      )}

      {selectedNote && (
        <SummarizeDialog
          open={isSummarizeDialogOpen}
          onOpenChange={setIsSummarizeDialogOpen}
          note={selectedNote}
          isViewMode={!!selectedNote.summary && selectedNote.summary.length > 0}
          onUpdateNote={handleUpdateNoteWithSummary}
          isLoading={updateSummaryMutation.isPending}
        />
      )}
    </div>
  );
}
