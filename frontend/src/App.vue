<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import NoteForm from "./components/NoteForm.vue";
import NoteList from "./components/NoteList.vue";
import AuthForm from "./components/AuthForm.vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";
import type { Note, CreateNoteDto, UpdateNoteDto } from "./types/note";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from "./api/notes";
import { setAuthToken } from "./api/client";
import { loginUser, registerUser, getCurrentUser, type AuthUser } from "./api/auth.js";

type SortBy = "createdAt_desc" | "createdAt_asc" | "title_asc" | "title_desc";
type StatusFilter = "all" | "active" | "done";
type Theme = "light" | "dark";

const notes = ref<Note[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const noteToEdit = ref<Note | null>(null);

const sortBy = ref<SortBy>("createdAt_desc");
const statusFilter = ref<StatusFilter>("all");
const searchQuery = ref("");

const pageSize = ref(5);
const currentPage = ref(1);

const theme = ref<Theme>("dark");

const confirmDeleteId = ref<number | null>(null);
const confirmDeleteNote = ref<Note | null>(null);
const isConfirmOpen = ref(false);

const token = ref<string | null>(localStorage.getItem("token"));
const currentUser = ref<AuthUser | null>(null);
const authLoading = ref(false);
const authError = ref<string | null>(null);

const isAuthenticated = computed(() => !!token.value);


function applyTheme(value: Theme) {
  document.documentElement.dataset.theme = value;
}


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

onMounted(async () => {
  const savedTheme = localStorage.getItem("theme") as Theme | null;
  if (savedTheme === "light" || savedTheme === "dark") {
    theme.value = savedTheme;
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    theme.value = "light";
  } else {
    theme.value = "dark";
  }
  applyTheme(theme.value);

  if (token.value) {
    setAuthToken(token.value);
    try {
      const me = await getCurrentUser();
      currentUser.value = me;
      await loadNotes();
    } catch (e) {
      console.error(e);
      token.value = null;
      currentUser.value = null;
      setAuthToken(null);
      localStorage.removeItem("token");
    }
  }

});


watch(theme, (value: Theme) => {
  localStorage.setItem("theme", value);
  applyTheme(value);
});

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}

const filteredAndSortedNotes = computed(() => {
  let result = [...notes.value];

  if (statusFilter.value === "active") {
    result = result.filter((n) => !n.isDone);
  } else if (statusFilter.value === "done") {
    result = result.filter((n) => n.isDone);
  }

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
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      case "createdAt_desc":
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
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

const totalItems = computed(() => filteredAndSortedNotes.value.length);
const totalPages = computed(() =>
  totalItems.value === 0
    ? 1
    : Math.ceil(totalItems.value / pageSize.value)
);

watch([searchQuery, sortBy, statusFilter, pageSize], () => {
  currentPage.value = 1;
});

const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredAndSortedNotes.value.slice(start, end);
});

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

function goPrevPage() {
  goToPage(currentPage.value - 1);
}

function goNextPage() {
  goToPage(currentPage.value + 1);
}

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
    notes.value = notes.value.map((n: Note) => (n.id === updated.id ? updated : n));
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
    notes.value = notes.value.filter((n) => n.id !== id);
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

  notes.value = notes.value.map((n) =>
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

function requestDelete(id: number) {
  confirmDeleteId.value = id;
  confirmDeleteNote.value = notes.value.find((n) => n.id === id) ?? null;
  isConfirmOpen.value = true;
}

async function confirmDelete() {
  if (confirmDeleteId.value == null) return;
  await handleDelete(confirmDeleteId.value);
  isConfirmOpen.value = false;
  confirmDeleteId.value = null;
}

function cancelDelete() {
  isConfirmOpen.value = false;
  confirmDeleteId.value = null;
  confirmDeleteNote.value = null;
}

async function handleRegister(payload: { email: string; password: string; name?: string }) {
  authLoading.value = true;
  authError.value = null;

  try {
    const res = await registerUser(payload);
    token.value = res.token;
    currentUser.value = res.user;
    localStorage.setItem("token", res.token);
    setAuthToken(res.token);
    await loadNotes();
  } catch (e: any) {
    console.error(e);
    authError.value =
      e?.response?.data?.message ?? "Не удалось зарегистрироваться";
  } finally {
    authLoading.value = false;
  }
}

async function handleLogin(payload: { email: string; password: string }) {
  authLoading.value = true;
  authError.value = null;

  try {
    const res = await loginUser(payload);
    token.value = res.token;
    currentUser.value = res.user;
    localStorage.setItem("token", res.token);
    setAuthToken(res.token);
    await loadNotes();
  } catch (e: any) {
    console.error(e);
    authError.value =
      e?.response?.data?.message ?? "Не удалось войти. Проверьте email и пароль.";
  } finally {
    authLoading.value = false;
  }
}

function handleLogout() {
  token.value = null;
  currentUser.value = null;
  notes.value = [];
  localStorage.removeItem("token");
  setAuthToken(null);
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div>
        <h1>Notes Platform</h1>
        <span class="subtitle">
          by NIMARS
          <template v-if="isAuthenticated && currentUser">
            — {{ currentUser.email }}
          </template>
        </span>
      </div>

      <div class="header-actions">
        <button class="theme-toggle" type="button" @click="toggleTheme">
          {{ theme === "dark" ? "☀️ Светлая тема" : "🌙 Тёмная тема" }}
        </button>
        <button v-if="isAuthenticated" type="button" class="logout" @click="handleLogout">
          Выйти
        </button>
      </div>
    </header>

    <main>
      <AuthForm v-if="!isAuthenticated" :loading="authLoading" :error="authError" @login="handleLogin"
        @register="handleRegister" />

      <template v-else>
        <NoteForm :note-to-edit="noteToEdit" :loading="saving" @create="handleCreate" @update="handleUpdate"
          @cancel-edit="handleCancelEdit" />

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

          <div class="toolbar-item status-filter">
            <span class="status-label">Статус:</span>
            <button type="button" class="chip" :class="{ active: statusFilter === 'all' }"
              @click="statusFilter = 'all'">
              Все
            </button>
            <button type="button" class="chip" :class="{ active: statusFilter === 'active' }"
              @click="statusFilter = 'active'">
              Активные
            </button>
            <button type="button" class="chip" :class="{ active: statusFilter === 'done' }"
              @click="statusFilter = 'done'">
              Выполненные
            </button>
          </div>

          <div class="toolbar-item">
            <input v-model="searchQuery" type="text" placeholder="Поиск по заголовку и содержанию..." />
          </div>

          <div class="toolbar-item">
            <label>
              На странице:
              <select v-model.number="pageSize">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
              </select>
            </label>
          </div>
        </section>

        <section v-if="error" class="error">
          {{ error }}
        </section>

        <section v-if="totalItems > 0" class="pagination">
          <div class="pagination-info">
            Показаны
            {{ (currentPage - 1) * pageSize + 1 }}–{{
              Math.min(currentPage * pageSize, totalItems)
            }}
            из {{ totalItems }}
          </div>
          <div class="pagination-controls">
            <button type="button" @click="goPrevPage" :disabled="currentPage === 1">
              «
            </button>
            <button v-for="page in totalPages" :key="page" type="button" :class="{ active: currentPage === page }"
              @click="goToPage(page)">
              {{ page }}
            </button>
            <button type="button" @click="goNextPage" :disabled="currentPage === totalPages">
              »
            </button>
          </div>
        </section>

        <NoteList :notes="paginatedNotes" :loading="loading" @toggle-done="handleToggleDone" @edit="handleEdit"
          @delete="requestDelete" />

        <ConfirmDialog :visible="isConfirmOpen" title="Удаление заметки" :message="confirmDeleteNote
          ? `Вы действительно хотите удалить заметку «${confirmDeleteNote.title}»?`
          : 'Вы действительно хотите удалить эту заметку?'
          " :loading="saving" confirm-text="Удалить" cancel-text="Отмена" @confirm="confirmDelete"
          @cancel="cancelDelete" />

      </template>

    </main>
  </div>
</template>


<style scoped>
.app {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  color: var(--text-color);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

.header {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.theme-toggle {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--accent-color-soft);
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.85rem;
}

.theme-toggle:hover {
  border-color: var(--accent-color);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.toolbar-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-item input,
.toolbar-item select {
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-color);
}

.status-filter {
  flex-wrap: wrap;
}

.status-label {
  font-size: 0.9rem;
}

.chip {
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-color);
}

.chip.active {
  background: var(--accent-color-soft);
  border-color: var(--accent-color);
  color: var(--text-color);
}

.error {
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
}

.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.pagination-info {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.pagination-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.pagination-controls button {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  color: var(--text-color);
  font-size: 0.85rem;
}

.pagination-controls button.active {
  background: var(--accent-color-soft);
  border-color: var(--accent-color);
}

.pagination-controls button:disabled {
  opacity: 0.6;
  cursor: default;
}

@media (max-width: 600px) {
  .app {
    padding: 12px;
  }

  .header {
    align-items: flex-start;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-item {
    width: 100%;
    justify-content: space-between;
  }

  .toolbar-item input,
  .toolbar-item select {
    width: 100%;
  }

  .pagination {
    flex-direction: column;
    align-items: flex-start;
  }
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.logout {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.85rem;
}
</style>