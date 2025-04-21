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

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSummarizeDialogOpen, setIsSummarizeDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }

    // Load notes from localStorage
    const storedNotes = localStorage.getItem(`notes-${user.id}`);
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, [user, router]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (user && notes.length > 0) {
      localStorage.setItem(`notes-${user.id}`, JSON.stringify(notes));
    }
  }, [notes, user]);

  const handleCreateNote = (note: Note) => {
    const newNotes = [...notes, note];
    setNotes(newNotes);
    setIsCreateDialogOpen(false);
    toast({
      title: "Note Created",
      description: "Your note has been created successfully.",
    });
  };

  const handleEditNote = (updatedNote: Note) => {
    const newNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(newNotes);
    setIsEditDialogOpen(false);
    setSelectedNote(null);
    toast({
      title: "Note Updated",
      description: "Your note has been updated successfully.",
    });
  };

  const handleDeleteNote = () => {
    if (selectedNote) {
      const newNotes = notes.filter((note) => note.id !== selectedNote.id);
      setNotes(newNotes);
      setIsDeleteDialogOpen(false);
      setSelectedNote(null);
      toast({
        title: "Note Deleted",
        description: "Your note has been deleted successfully.",
      });
    }
  };

  const handleEditClick = (note: Note) => {
    setSelectedNote(note);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (note: Note) => {
    setSelectedNote(note);
    setIsDeleteDialogOpen(true);
  };

  const handleSummarizeClick = () => {
    setIsSummarizeDialogOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="mr-4 flex">
            <span className="text-xl font-bold text-primary">NotesApp</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSummarizeClick}
              disabled={notes.length === 0}
              className="border-primary/70 text-primary hover:bg-secondary"
            >
              Summarize All Notes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-foreground hover:text-primary hover:bg-secondary"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Your Notes</h1>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Note
          </Button>
        </div>

        <NotesList
          notes={notes}
          onEditNote={handleEditClick}
          onDeleteNote={handleDeleteClick}
        />

        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You don&apos;t have any notes yet.
            </p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Note
            </Button>
          </div>
        )}
      </main>

      <CreateNoteDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateNote={handleCreateNote}
      />

      {selectedNote && (
        <EditNoteDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          note={selectedNote}
          onUpdateNote={handleEditNote}
        />
      )}

      {selectedNote && (
        <DeleteNoteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteNote}
        />
      )}

      <SummarizeDialog
        open={isSummarizeDialogOpen}
        onOpenChange={setIsSummarizeDialogOpen}
        notes={notes}
      />
    </div>
  );
}
