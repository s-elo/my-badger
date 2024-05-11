<script lang="ts" setup>
import { computed, ref } from 'vue';
import { BudgetItem, BudgetType } from '../type';
import { useBudgetStore } from '../store';
import { BUDGET_TYPE_OPTS } from '../constant';
import SearchSelector from '../components/SearchSelector.vue';

const validators = {
  price: (value: string) => !!value && /^[\d\.\+\-\*\/]+$/.test(value),
};

const budgetStore = useBudgetStore();
const props = defineProps<{
  budget?: BudgetItem;
  show: boolean;
  adding?: boolean;
}>();

const emits = defineEmits(['cancel', 'confirm']);

const formData = ref({
  price: String(props.budget?.price || ''),
  tags: props.budget?.tags || [],
  desc: props.budget?.desc || '',
  type: props.budget?.type || BudgetType.spending,
});

const tagOptions = computed(() =>
  Object.keys({ ...budgetStore.allTags }).map((tag) => ({
    label: `#${tag}`,
  })),
);
const isPriceValid = computed(() =>
  validators.price(formData.value.price || ''),
);
const calculatedPrice = computed(() => {
  if (/[\+\*\-\/]/.test(formData.value.price)) {
    try {
      return eval(formData.value.price);
    } catch {
      return '';
    }
  }

  return '';
});

const confirm = () => {
  if (isPriceValid.value) {
    if (calculatedPrice.value) {
      formData.value.price = calculatedPrice.value;
    }

    emits('confirm', { ...(props.budget || {}), ...formData.value });
  }
};
</script>

<template>
  <w-dialog
    :model-value="show"
    title="How are you today"
    persistent
    class="budget-form-modal"
  >
    <w-radios
      v-model="formData.type"
      :items="BUDGET_TYPE_OPTS"
      inline
      class="form-radio"
      :style="{ marginBottom: '7px' }"
    />
    <w-input
      v-model="formData.price"
      :label="calculatedPrice"
      placeholder="Price"
      :color="isPriceValid ? '' : 'red'"
    />
    <SearchSelector
      v-model="formData.tags"
      placeholder="Tags"
      :options="tagOptions"
      multiple
    />
    <w-textarea v-model="formData.desc" placeholder="Note" color="gray" />
    <template #actions>
      <div class="spacer" />
      <w-button class="mr2" outline @click="$emit('cancel')"> cancel </w-button>
      <w-button bg-color="primary" :disabled="adding" @click="confirm">
        confirm
      </w-button>
    </template>
  </w-dialog>
</template>

<style lang="scss" scoped></style>
