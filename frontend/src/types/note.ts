export interface Note {
  id: number;
  title: string;
  content: string;
  isDone: boolean;
  createdAt: string; // ISO-строки от бэка
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content?: string;
  isDone?: boolean;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  isDone?: boolean;
}
