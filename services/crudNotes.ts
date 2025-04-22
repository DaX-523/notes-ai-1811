import { supabase, serializeSupabaseData } from "@/lib/supabase";
import { Note } from "@/lib/types";

const summarizeNote = async (updatedNote: Note) => {
  const { data, error } = await supabase
    .from("notes")
    .update({ summary: updatedNote.summary })
    .eq("id", updatedNote.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update summary: ${error.message}`);
  return serializeSupabaseData(data);
};

const updateNote = async (updatedNote: Note) => {
  const { data, error } = await supabase
    .from("notes")
    .update(updatedNote)
    .eq("id", updatedNote.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update note: ${error.message}`);
  return serializeSupabaseData(data);
};

const fetchNotes = async () => {
  try {
    const notesResponse = await supabase
      .from("notes")
      .select()
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

const deleteNote = async (noteId: string) => {
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) throw new Error(`Failed to delete note: ${error.message}`);
  return noteId;
};

export { createNote, fetchNotes, summarizeNote, updateNote, deleteNote };
