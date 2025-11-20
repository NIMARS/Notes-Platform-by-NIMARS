<script setup lang="ts">
import { reactive, ref } from "vue";

const props = defineProps<{
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "login", payload: { email: string; password: string }): void;
  (e: "register", payload: {
    email: string;
    password: string;
    name?: string;
  }): void;
}>();

type Mode = "login" | "register";
const mode = ref<Mode>("login");

const form = reactive({
  email: "",
  password: "",
  name: "",
});

function switchMode(next: Mode) {
  mode.value = next;
}

function onSubmit() {
  if (!form.email || !form.password) return;

  if (mode.value === "login") {
    emit("login", {
      email: form.email,
      password: form.password,
    });
  } else {
    emit("register", {
      email: form.email,
      password: form.password,
      name: form.name || undefined,
    });
  }
}
</script>

<template>
  <section class="auth-card">
    <h2>Вход или регистрация</h2>

    <div class="tabs">
      <button
        type="button"
        class="tab"
        :class="{ active: mode === 'login' }"
        @click="switchMode('login')"
      >
        Вход
      </button>
      <button
        type="button"
        class="tab"
        :class="{ active: mode === 'register' }"
        @click="switchMode('register')"
      >
        Регистрация
      </button>
    </div>

    <form @submit.prevent="onSubmit">
      <div class="field">
        <label for="email">Почта (Email)</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          required
        />
      </div>

      <div v-if="mode === 'register'" class="field">
        <label for="name">Имя (опционально)</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          autocomplete="name"
        />
      </div>

      <div class="field">
        <label for="password">Пароль</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>

      <p v-if="props.error" class="error">
        {{ props.error }}
      </p>

      <button type="submit" :disabled="props.loading">
        {{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.auth-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: var(--bg-elevated);
}

h2 {
  margin-top: 0;
}

.tabs {
  display: inline-flex;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-bottom: 12px;
}

.tab {
  padding: 6px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-color);
}

.tab.active {
  background: var(--accent-color-soft);
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.field label {
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.field input {
  padding: 6px 8px;
  border-radius: 4px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  color: var(--text-color);
}

.error {
  margin: 4px 0 8px;
  color: #f97373;
  font-size: 0.85rem;
}

button[type="submit"] {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: var(--accent-color);
  color: #ffffff;
}
</style>