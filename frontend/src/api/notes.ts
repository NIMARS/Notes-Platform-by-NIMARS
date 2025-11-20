import axios from "axios";
import type { Note, CreateNoteDto, UpdateNoteDto } from "../types/note";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  timeout: 5000,
});

export async function fetchNotes(): Promise<Note[]> {
  const res = await api.get<Note[]>("/notes");
  return res.data;
}

export async function fetchNote(id: number): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(payload: CreateNoteDto): Promise<Note> {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
}

export async function updateNote( id: number, payload: UpdateNoteDto): Promise<Note> {
  const res = await api.patch<Note>(`/notes/${id}`, payload);
  return res.data;
}

export async function deleteNote(id: number): Promise<void> {
  await api.delete(`/notes/${id}`);
}
