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
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NotesListProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
}

export function NotesList({ notes, onEditNote, onDeleteNote }: NotesListProps) {
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
              {formatDate(note.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="line-clamp-4 text-sm text-muted-foreground">
              {note.content}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
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
