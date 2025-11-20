<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import NoteForm from "./components/NoteForm.vue";
import NoteList from "./components/NoteList.vue";
import type { Note, CreateNoteDto, UpdateNoteDto } from "./types/note";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from "./api/notes";

const notes = ref<Note[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const noteToEdit = ref<Note | null>(null);

type SortBy = "createdAt_desc" | "createdAt_asc" | "title_asc" | "title_desc";
const sortBy = ref<SortBy>("createdAt_desc");

const searchQuery = ref("");


async function loadNotes() {
  loading.value = true;
  error.value = null;

  try {
    notes.value = await fetchNotes();
  } catch (e: any) {
    console.error(e);
    error.value = e?.response?.data?.message ?? "Не удалось загрузить заметки";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadNotes();
});

const displayedNotes = computed(() => {
  let result = [...notes.value];

  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }

  result.sort((a, b) => {
    switch (sortBy.value) {
      case "createdAt_asc":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "createdAt_desc":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "title_asc":
        return a.title.localeCompare(b.title);
      case "title_desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return result;
});


async function handleCreate(payload: CreateNoteDto) {
  saving.value = true;
  error.value = null;

  try {
    const created = await createNote(payload);
    notes.value = [created, ...notes.value];
  } catch (e: any) {
    console.error(e);
    error.value = e?.response?.data?.message ?? "Не удалось создать заметку";
  } finally {
    saving.value = false;
  }
}

async function handleUpdate(args: { id: number; data: UpdateNoteDto }) {
  saving.value = true;
  error.value = null;

  try {
    const updated = await updateNote(args.id, args.data);
    notes.value = notes.value.map((n: { id: number; }) => (n.id === updated.id ? updated : n));
    noteToEdit.value = null;
  } catch (e: any) {
    console.error(e);
    error.value = e?.response?.data?.message ?? "Не удалось обновить заметку";
  } finally {
    saving.value = false;
  }
}

async function handleDelete(id: number) {
  saving.value = true;
  error.value = null;

  try {
    await deleteNote(id);
    notes.value = notes.value.filter((n: { id: number; }) => n.id !== id);
    if (noteToEdit.value?.id === id) {
      noteToEdit.value = null;
    }
  } catch (e: any) {
    console.error(e);
    error.value = e?.response?.data?.message ?? "Не удалось удалить заметку";
  } finally {
    saving.value = false;
  }
}

async function handleToggleDone(note: Note) {
  const newIsDone = !note.isDone;
  const prev = [...notes.value];
  notes.value = notes.value.map((n: { id: number; }) =>
    n.id === note.id ? { ...n, isDone: newIsDone } : n
  );

  try {
    await updateNote(note.id, { isDone: newIsDone });
  } catch (e) {
    console.error(e);
    notes.value = prev;
  }
}

function handleEdit(note: Note) {
  noteToEdit.value = note;
}

function handleCancelEdit() {
  noteToEdit.value = null;
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Notes Platform</h1>
      <span class="subtitle">Простое TODO / заметки</span>
    </header>

    <main>
      <NoteForm
        :note-to-edit="noteToEdit"
        :loading="saving"
        @create="handleCreate"
        @update="handleUpdate"
        @cancel-edit="handleCancelEdit"
      />

      <section class="toolbar">
        <div class="toolbar-item">
          <label>
            Сортировка:
            <select v-model="sortBy">
              <option value="createdAt_desc">По дате: новые сверху</option>
              <option value="createdAt_asc">По дате: старые сверху</option>
              <option value="title_asc">По заголовку: A–Z</option>
              <option value="title_desc">По заголовку: Z–A</option>
            </select>
          </label>
        </div>

        <div class="toolbar-item">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по заголовку и содержанию..."
          />
        </div>
      </section>

      <section v-if="error" class="error">
        {{ error }}
      </section>

      <NoteList
        :notes="displayedNotes"
        :loading="loading"
        @toggle-done="handleToggleDone"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </main>
  </div>
</template>


<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  color: #f0f0f0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

.header {
  margin-bottom: 16px;
}

.subtitle {
  font-size: 0.9rem;
  color: #aaa;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.toolbar-item input,
.toolbar-item select {
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #222;
  color: #f0f0f0;
}

.error {
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: #3b0a0a;
  border: 1px solid #ff4a4a;
}
</style>
