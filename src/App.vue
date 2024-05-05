<script setup lang="ts">
import { ref, computed } from 'vue';
import { decrypt } from './utils';

const password = ref('');
const token = computed(() => {
  return decrypt(password.value);
});
</script>

<template>
  <input v-model="password" type="text" />
  <div>{{ token }}</div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
