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

interface SummarizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: Note[];
}

export function SummarizeDialog({
  open,
  onOpenChange,
  notes,
}: SummarizeDialogProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      generateSummary();
    }
  }, [open]);

  const generateSummary = () => {
    setIsLoading(true);

    // Combine all note content
    const allContent = notes.map((note) => note.content).join("\n\n");

    // Simulate AI summarization with a delay
    setTimeout(() => {
      // Simple summarization logic (in a real app, you'd use an AI service)
      const words = allContent.split(/\s+/);
      const summaryWords = words.slice(0, Math.min(50, words.length));
      const generatedSummary =
        summaryWords.join(" ") +
        (words.length > 50
          ? "... (Summary generated from " + notes.length + " notes)"
          : "");

      setSummary(generatedSummary);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">Notes Summary</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            AI-generated summary of all your notes
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
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
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
