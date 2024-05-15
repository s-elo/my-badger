<script lang="ts" setup>
import { formatDate } from '../utils';
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps<{
  modelValue: number | string;
}>();
defineEmits(['update:modelValue']);

const show = ref(false);
const dateValue = ref(formatDate(props.modelValue, 'YYYY/MM/DD'));

const addCurTime = (val: string) => {
  const now = new Date(Date.now());
  const date = new Date(val);
  date.setHours(now.getHours());
  date.setMinutes(now.getMinutes());
  date.setSeconds(now.getSeconds());

  return date.getTime();
};
</script>

<template>
  <div class="date-picker">
    <q-btn size="xs" @click="show = true">{{ dateValue }}</q-btn>
    <q-dialog v-model="show" position="bottom">
      <div class="wrapper">
        <q-date
          :model-value="dateValue"
          class="q-mt-sm full-width date"
          minimal
          borderless
          outlined
          hide-bottom-space
          @update:model-value="(val) => (dateValue = val)"
        />
        <q-btn
          size="sm"
          label="OK"
          color="primary"
          class="btn"
          @click="
            $emit('update:modelValue', addCurTime(dateValue));
            show = false;
          "
        />
      </div>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  background-color: white;
  display: flex;
  flex-direction: column;
  .date {
    margin-top: 0;
  }
  .btn {
    width: fit-content;
    position: absolute;
    bottom: 8px;
    right: 16px;
  }
}
</style>
