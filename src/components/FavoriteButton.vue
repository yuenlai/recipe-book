<template>
  <button
    :class="['favorite-btn', { 'is-favorite': isFav }]"
    @click="handleClick"
  >
    <el-icon :size="20">
      <StarFilled v-if="isFav" />
      <Star v-else />
    </el-icon>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useRecipeStore } from '../stores/recipe'

const props = defineProps({
  recipeId: {
    type: Number,
    required: true
  }
})

const store = useRecipeStore()

const isFav = computed(() => store.isFavorite(props.recipeId))

function handleClick(e) {
  e.stopPropagation()
  store.toggleFavorite(props.recipeId)
}
</script>

<style scoped>
.favorite-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #999;
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: white;
}

.favorite-btn.is-favorite {
  color: #FFB800;
  background: white;
}

.favorite-btn.is-favorite:hover {
  color: #FF9800;
}
</style>
