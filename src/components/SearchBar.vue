<template>
  <el-input
    v-model="query"
    placeholder="搜索食谱、食材..."
    clearable
    class="search-input"
    @input="handleInput"
    @clear="handleClear"
  >
    <template #prefix>
      <el-icon><Search /></el-icon>
    </template>
  </el-input>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRecipeStore } from '../stores/recipe'

const store = useRecipeStore()
const query = ref(store.searchQuery)

let debounceTimer = null

function handleInput(value) {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.setSearch(value)
  }, 300)
}

function handleClear() {
  store.setSearch('')
}

watch(() => store.searchQuery, (val) => {
  if (val !== query.value) {
    query.value = val
  }
})
</script>

<style scoped>
.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background: #F5F5F5;
  box-shadow: none;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper):hover,
.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #FF6B35;
  background: white;
}
</style>
