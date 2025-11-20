<script setup lang="ts">
import type { Note } from "../types/note";

defineProps<{
  notes: Note[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "toggleDone", note: Note): void;
  (e: "edit", note: Note): void;
  (e: "delete", id: number): void;
}>();

function onToggle(note: Note) {
  emit("toggleDone", note);
}

function onEdit(note: Note) {
  emit("edit", note);
}

function onDelete(id: number) {
  if (confirm("Удалить эту заметку?")) {
    emit("delete", id);
  }
}
</script>

<template>
  <div class="note-list">
    <h2>Заметки</h2>

    <div v-if="loading">Загружаем заметки...</div>
    <div v-else-if="!notes.length">Упс! Похоже пока нет ни одной заметки.</div>

    <ul v-else>
      <li v-for="note in notes" :key="note.id" class="note-item">
        <div class="note-header">
          <label>
            <input
              type="checkbox"
              :checked="note.isDone"
              @change="onToggle(note)"
            />
            <span :class="{ done: note.isDone }">{{ note.title }}</span>
          </label>

          <div class="actions">
            <button type="button" @click="onEdit(note)">✏️</button>
            <button type="button" @click="onDelete(note.id)">🗑️</button>
          </div>
        </div>

        <p v-if="note.content" class="content">
          {{ note.content }}
        </p>

        <div class="meta">
          <span
            >Создано:
            {{ new Date(note.createdAt).toLocaleString() }}</span
          >
          <span
            >Обновлено:
            {{ new Date(note.updatedAt).toLocaleString() }}</span
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.note-list {
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  background: #111;
}

.note-item {
  border-bottom: 1px solid #333;
  padding: 8px 0;
}

.note-item:last-child {
  border-bottom: none;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.note-header label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.note-header .done {
  text-decoration: line-through;
  opacity: 0.7;
}

.content {
  margin: 4px 0;
  white-space: pre-wrap;
}

.meta {
  font-size: 0.8rem;
  color: #aaa;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  gap: 4px;
}

.actions button {
  background: transparent;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
  color: #ddd;
}
</style>
