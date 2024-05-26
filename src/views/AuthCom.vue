<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useUserStore, useBudgetStore } from '../store';
import { decrypt } from '../utils';
import { AxiosError } from 'axios';
import { BUDGET_TOKEN_LOCAL_STORAGE_KEY } from '../constant';
import { useQuasar } from 'quasar';

const emit = defineEmits(['validated']);

const userStore = useUserStore();
const budgetStore = useBudgetStore();

const $q = useQuasar();

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
    $q.notify({
      message:
        (e as AxiosError<{ message: string }>).response?.data?.message ||
        (e as Error).message,
      type: 'negative',
    });
  } finally {
    checking.value = false;
  }
};
</script>

<template>
  <div class="auth">
    <img src="../assets/budgets.svg" class="budget-icon" />
    <q-form class="form-container" @submit="auth">
      <q-input
        v-model="password"
        type="password"
        label="😜"
        placeholder="Who Are You?"
      />
      <q-btn
        type="submit"
        :loading="checking"
        class="auth-btn"
        color="primary"
        no-caps
      >
        You don't know your father?
        <template #loading>
          <q-spinner-gears class="on-left" />
          Checking...
        </template>
      </q-btn>
    </q-form>
  </div>
</template>

<style lang="scss" scoped>
.auth {
  padding: 24px;
  .form-container {
    width: 100%;
  }
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
