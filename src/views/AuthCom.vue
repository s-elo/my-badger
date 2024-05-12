<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useUserStore, useBudgetStore } from '../store';
import { decrypt } from '../utils';
import { AxiosError } from 'axios';
import { BUDGET_TOKEN_LOCAL_STORAGE_KEY } from '../constant';

const emit = defineEmits(['validated']);

const userStore = useUserStore();
const budgetStore = useBudgetStore();

const password = ref('');
const checking = ref(false);

const token = computed(() => {
  return decrypt(password.value);
});

const auth = async () => {
  userStore.setToken(token.value);
  try {
    checking.value = true;
    await budgetStore.getSummary();
    emit('validated');
    localStorage.setItem(BUDGET_TOKEN_LOCAL_STORAGE_KEY, token.value);
  } catch (e) {
    ElMessage({
      message:
        (e as AxiosError<{ message: string }>).response?.data?.message ||
        (e as Error).message,
      type: 'error',
    });
  } finally {
    checking.value = false;
  }
};
</script>

<template>
  <div class="auth">
    <img src="../assets/budgets.svg" class="budget-icon" />
    <el-input v-model="password" type="password" placeholder="Who Are You?">
      <template #prefix>
        <div class="prefix">😜</div>
      </template>
    </el-input>
    <el-button :loading="checking" class="auth-btn" type="primary" @click="auth"
      >Auth</el-button
    >
  </div>
</template>

<style lang="scss" scoped>
.auth {
  &-btn {
    margin-top: 1rem;
    width: 100%;
  }
  .budget-icon {
    display: block;
    width: 100px;
    margin: 0 auto;
    margin-top: 100px;
  }
}
</style>
