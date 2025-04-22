"use client";

import type { Note } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Sparkles } from "lucide-react";

import { formatDate } from "@/lib/utils";

interface NotesListProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
  onSummarizeNote: (note: Note) => void;
  onViewSummary: (note: Note) => void;
  isLoading?: boolean;
}

export function NotesList({
  notes,
  onEditNote,
  onDeleteNote,
  onSummarizeNote,
  onViewSummary,
  isLoading = false,
}: NotesListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="flex flex-col card-gradient border-border/50 hover:border-primary/50 transition-all"
        >
          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-1 text-foreground">
              {note.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {formatDate(note.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="line-clamp-4 text-sm text-muted-foreground">
              {note.content}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            {!note?.summary ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSummarizeNote(note)}
                className="border-white/70 text-white hover:bg-primary"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Summarize
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewSummary(note)}
                className="border-white/70 text-white hover:bg-primary"
              >
                View Summary
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditNote(note)}
              className="border-primary/50 text-primary hover:bg-secondary"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteNote(note)}
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
