<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type { Note, CreateNoteDto, UpdateNoteDto } from "../types/note";

const props = defineProps<{
  noteToEdit: Note | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "create", payload: CreateNoteDto): void;
  (e: "update", payload: { id: number; data: UpdateNoteDto }): void;
  (e: "cancelEdit"): void;
}>();

const form = reactive({
  title: "",
  content: "",
  isDone: false,
});

const isEditMode = computed(() => props.noteToEdit !== null);

watch(
  () => props.noteToEdit,
  (note) => {
    if (note) {
      form.title = note.title;
      form.content = note.content;
      form.isDone = note.isDone;
    } else {
      form.title = "";
      form.content = "";
      form.isDone = false;
    }
  },
  { immediate: true }
);

function onSubmit() {
  if (!form.title.trim()) {
    return;
  }

  if (isEditMode.value && props.noteToEdit) {
    const payload: UpdateNoteDto = {
      title: form.title,
      content: form.content,
      isDone: form.isDone,
    };
    emit("update", { id: props.noteToEdit.id, data: payload });
  } else {
    const payload: CreateNoteDto = {
      title: form.title,
      content: form.content,
      isDone: form.isDone,
    };
    emit("create", payload);
  }
}

function onCancel() {
  emit("cancelEdit");
}
</script>

<template>
  <form class="note-form" @submit.prevent="onSubmit">
    <h2>{{ isEditMode ? "Редактировать заметку" : "Создать заметку" }}</h2>

    <div class="field">
      <label for="title">Заголовок</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        placeholder="Например: Идеи для нового проекта"
      />
    </div>

    <div class="field">
      <label for="content">Содержание</label>
      <textarea
        id="content"
        v-model="form.content"
        rows="4"
        placeholder="Текст заметки..."
      />
    </div>

    <div class="field checkbox">
      <label>
        <input type="checkbox" v-model="form.isDone" />
        Выполнено
      </label>
    </div>

    <div class="actions">
      <button type="submit" :disabled="loading">
        {{ isEditMode ? "Сохранить" : "Создать" }}
      </button>
      <button
        v-if="isEditMode"
        type="button"
        class="secondary"
        @click="onCancel"
        :disabled="loading"
      >
        Отмена
      </button>
    </div>
  </form>
</template>

<style scoped>
.note-form {
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: #111;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.field label {
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.field input,
.field textarea {
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #222;
  color: #f0f0f0;
}
.field textarea {
  resize: vertical;
  min-height: 120px;
  min-width: 318px;
}

.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

button {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

button[disabled] {
  opacity: 0.6;
  cursor: default;
}

button.secondary {
  background: transparent;
  border: 1px solid #555;
  color: #ddd;
}
</style>
