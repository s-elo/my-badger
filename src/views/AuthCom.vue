<script lang="ts" setup>
import { computed, ref } from 'vue';
import { searchBudgets } from '../api';
import { useUserStore } from '../store';
import { decrypt } from '../utils';
import { AxiosError } from 'axios';
import { BUDGET_TOKEN_LOCAL_STORAGE_KEY } from '../constant';

const emit = defineEmits(['validated']);

const userStore = useUserStore();

const errorMsg = ref('');
const password = ref('');

const token = computed(() => {
  return decrypt(password.value);
});

const auth = async () => {
  userStore.setToken(token.value);
  try {
    const budgets = await searchBudgets({ content: 'test-00' });
    emit('validated', budgets);
    localStorage.setItem(BUDGET_TOKEN_LOCAL_STORAGE_KEY, token.value);
  } catch (e) {
    errorMsg.value =
      (e as AxiosError<{ message: string }>).response?.data?.message || 'Error';
  }
};
</script>

<template>
  <div class="auth">
    <w-input v-model="password">😜</w-input>
    <w-button class="auth-btn" @click="auth">Auth</w-button>
    <w-notification
      v-model="errorMsg"
      :timeout="1000"
      error
      plain
      round
      shadow
      top
      center
      absolute
    >
      {{ errorMsg }}.
    </w-notification>
  </div>
</template>

<style lang="scss" scoped>
.auth {
  &-btn {
    margin-top: 1rem;
  }
}
</style>
