"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Note } from "@/lib/types";
import { summarizeWithGroq } from "@/lib/groq-api";

interface SummarizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  isViewMode?: boolean;
  onUpdateNote?: (note: Note) => void;
  isLoading?: boolean;
}

export function SummarizeDialog({
  open,
  onOpenChange,
  note,
  isViewMode = false,
  onUpdateNote,
  isLoading: externalLoading = false,
}: SummarizeDialogProps) {
  const [summary, setSummary] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combine both loading states
  const isLoading = externalLoading || internalLoading;

  useEffect(() => {
    if (open) {
      if (isViewMode && note?.summary) {
        // If in view mode and summary exists, just load it
        setSummary(note.summary);
      } else {
        // Otherwise generate a new summary
        generateSummary();
      }
    }
  }, [open, note, isViewMode]);

  const generateSummary = async () => {
    setInternalLoading(true);
    setError(null);

    try {
      const content = note?.content;

      if (!content || content.trim() === "") {
        setSummary("No content to summarize.");
        setInternalLoading(false);
        return;
      }

      // Use Groq API for summarization
      const result = await summarizeWithGroq(content);

      // Create updated note object with the new summary
      const updatedNote = {
        ...note,
        summary: result,
      };

      // Update the local state in the parent component
      if (onUpdateNote) {
        onUpdateNote(updatedNote);
      }

      setSummary(result);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Failed to generate summary. Please try again later.");
      setSummary("");
    } finally {
      setInternalLoading(false);
    }
  };

  const dialogTitle =
    isViewMode && note?.summary ? "View Summary" : "Generate Summary";

  const dialogDescription =
    isViewMode && note?.summary
      ? "AI-generated summary of your note"
      : "AI-generated summary powered by Groq";

  // Determine appropriate button text based on context
  const buttonText =
    isViewMode && note?.summary
      ? "Regenerate Summary"
      : note?.summary
      ? "Regenerate Summary"
      : "Generate Summary";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-2">{error}</div>
          ) : (
            <Textarea
              value={summary}
              readOnly
              className="min-h-[200px] bg-muted border-border/50 text-foreground"
            />
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            Close
          </Button>
          {!isLoading && (
            <Button
              type="button"
              onClick={generateSummary}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {buttonText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
