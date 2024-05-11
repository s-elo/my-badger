<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AuthCom from './views/AuthCom.vue';
import MainContent from './views/MainContent.vue';
import { BUDGET_TOKEN_LOCAL_STORAGE_KEY } from './constant';
import { useUserStore, useBudgetStore } from './store';

const isAuth = ref(false);

const userStore = useUserStore();
const budgetStore = useBudgetStore();

onMounted(() => {
  budgetStore.getSummary();

  const token = localStorage.getItem(BUDGET_TOKEN_LOCAL_STORAGE_KEY);
  if (token) {
    userStore.setToken(token);
    isAuth.value = true;
  }
});
</script>

<template>
  <main class="main-wrapper">
    <AuthCom v-if="!isAuth" @validated="isAuth = true" />
    <MainContent v-else />
  </main>
</template>

<style scoped>
.main-wrapper {
  padding: 1rem;
  width: 100vw;
  height: 100vh;
}
</style>
