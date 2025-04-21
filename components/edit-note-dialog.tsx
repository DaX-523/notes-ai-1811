"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Note } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  onUpdateNote: (note: Note) => void;
}

export function EditNoteDialog({
  open,
  onOpenChange,
  note,
  onUpdateNote,
}: EditNoteDialogProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isLoading, setIsLoading] = useState(false);

  // Update state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedNote: Note = {
      ...note,
      title,
      content,
    };
    const response = await supabase
      .from("notes")
      .update(updatedNote)
      .eq("id", note?.id)
      .select();
    if (response.error) {
      console.error("Error updating note:", response.error);
      setIsLoading(false);
      return;
    }
    onUpdateNote(updatedNote);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title" className="text-foreground">
                Title
              </Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                required
                className="bg-muted border-border/50 text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content" className="text-foreground">
                Content
              </Label>
              <Textarea
                id="edit-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                className="min-h-[200px] bg-muted border-border/50 text-foreground"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title || !content}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Updating..." : "Update Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
