<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AuthCom from './components/AuthCom.vue';
import BudgetList from './components/BudgetList.vue';
import { BUDGET_TOKEN_LOCAL_STORAGE_KEY } from './constant';
import { useUserStore } from './store';

const isAuth = ref(false);

const userStore = useUserStore();

onMounted(() => {
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
    <BudgetList v-if="isAuth" />
  </main>
</template>

<style scoped>
.main-wrapper {
  padding: 1rem;
  width: 100vw;
  height: 100vh;
}
</style>
