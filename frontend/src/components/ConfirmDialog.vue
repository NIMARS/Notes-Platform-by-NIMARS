<script setup lang="ts">
withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
  }>(),
  {
    title: "Подтверждение",
    confirmText: "Удалить",
    cancelText: "Отмена",
    loading: false,
  }
);

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

function onBackgroundClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit("cancel");
  }
}
</script>

<template>
  <teleport to="body">
    <div v-if="visible" class="backdrop" @click="onBackgroundClick">
      <div class="dialog">
        <h3 class="title">{{ title }}</h3>
        <p class="message">{{ message }}</p>
        <div class="actions">
          <button
            type="button"
            class="btn secondary"
            @click="emit('cancel')"
            :disabled="loading"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="btn danger"
            @click="emit('confirm')"
            :disabled="loading"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.dialog {
  width: 100%;
  max-width: 360px;
  background: var(--bg-elevated);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  padding: 16px 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
}

.title {
  margin: 0 0 8px;
}

.message {
  margin: 0 0 16px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn.secondary {
  background: transparent;
  border-color: var(--border-color);
  color: var(--text-color);
}

.btn.danger {
  background: #b91c1c;
  border-color: #b91c1c;
  color: #ffffff;
}

.btn:disabled {
  opacity: 0.7;
  cursor: default;
}
</style>
