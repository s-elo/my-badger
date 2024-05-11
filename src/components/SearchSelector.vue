<script lang="ts" setup>
import { computed, ref } from 'vue';
import { set } from '../utils';

type OptionItem = {
  label: string;
  value?: unknown;
  disabled?: boolean;
  isNew?: boolean;
};

const props = defineProps<{
  modelValue: string | string[];
  options: OptionItem[];
  multiple?: boolean;
  placeholder?: string;
  label?: string;
}>();
const emit = defineEmits(['update:modelValue']);

const selectSearch = ref<string>();
const selectedNewTag = ref<OptionItem[]>([]);

const tagOptions = computed(() => {
  if (!selectSearch.value) {
    return set(
      [
        { label: 'searchSlot', disabled: true },
        ...selectedNewTag.value,
        ...props.options,
      ],
      'label',
    );
  }

  const filtered = [
    { label: 'searchSlot', disabled: true },
    ...selectedNewTag.value,
    ...props.options,
  ].filter((tag) => {
    if (tag.label === 'searchSlot') return true;
    if (selectSearch.value) {
      return tag.label.includes(selectSearch.value);
    }

    return true;
  });

  if (filtered.length === 1) {
    filtered.push({
      label: `#${selectSearch.value}`,
      isNew: true,
    });
  }

  return set(filtered, 'label');
});

const syncData = (data: string[]) => {
  const newTag = tagOptions.value.find((tag) => tag.isNew);
  if (
    newTag &&
    !selectedNewTag.value.find((tag) => tag.label === newTag.label)
  ) {
    selectedNewTag.value.unshift(newTag);
  }
  emit('update:modelValue', data);
};
</script>

<template>
  <w-select
    :model-value="modelValue"
    :placeholder="placeholder"
    :label="label"
    :items="tagOptions"
    multiple
    @update:model-value="syncData"
  >
    <template #item="{ item, selected }">
      <w-icon v-if="selected" class="primary">wi-check</w-icon>
      <span v-else class="px2"></span>

      <div v-if="item.label === 'searchSlot'" class="select-search">
        <w-input
          v-model="selectSearch"
          placeholder="search or add"
          class="search-input"
        />
      </div>
      <span v-else class="ml1"
        >{{ item.label }}
        <span v-if="item.isNew" class="new-dot"></span>
      </span>
    </template>
  </w-select>
</template>

<style lang="scss" scoped>
.select-search {
  width: 100%;
  display: flex;
  align-items: center;
  .search-input {
    flex: 1;
    margin-right: 7px;
  }
}
.new-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: rgb(67, 240, 67);
}
</style>
