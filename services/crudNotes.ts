/* 
  all CRUD operations on notes are managed in this file
*/

import { supabase, serializeSupabaseData } from "@/lib/supabase";
import { Note } from "@/lib/types";

const summarizeNote = async (updatedNote: Note) => {
  if (!updatedNote.user_id) {
    throw new Error("User ID is required to update a note summary");
  }

  const { data, error } = await supabase
    .from("notes")
    .update({ summary: updatedNote.summary })
    .eq("id", updatedNote.id)
    .eq("user_id", updatedNote.user_id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update summary: ${error.message}`);
  return serializeSupabaseData(data);
};

const updateNote = async (updatedNote: Note) => {
  if (!updatedNote.user_id) {
    throw new Error("User ID is required to update a note");
  }

  const { data, error } = await supabase
    .from("notes")
    .update(updatedNote)
    .eq("id", updatedNote.id)
    .eq("user_id", updatedNote.user_id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update note: ${error.message}`);
  return serializeSupabaseData(data);
};

const fetchNotes = async (userId: string) => {
  try {
    const notesResponse = await supabase
      .from("notes")
      .select()
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (notesResponse.error) {
      throw new Error(`Error fetching notes: ${notesResponse.error.message}`);
    }
    return serializeSupabaseData(notesResponse.data || []);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    throw error;
  }
};

const createNote = async (newNote: Note) => {
  const { data, error } = await supabase
    .from("notes")
    .insert(newNote)
    .select()
    .single();

  if (error) throw new Error(`Failed to create note: ${error.message}`);
  return serializeSupabaseData(data);
};

const deleteNote = async (params: { noteId: string; userId: string }) => {
  const { noteId, userId } = params;

  if (!userId) {
    throw new Error("User ID is required to delete a note");
  }

  const { data: noteData } = await supabase
    .from("notes")
    .select("id")
    .eq("id", noteId)
    .eq("user_id", userId)
    .single();

  if (!noteData) {
    throw new Error("Note not found or you don't have permission to delete it");
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", userId);

  if (error) throw new Error(`Failed to delete note: ${error.message}`);
  return noteId;
};

export { createNote, fetchNotes, summarizeNote, updateNote, deleteNote };
