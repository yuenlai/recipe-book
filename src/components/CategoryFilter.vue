<template>
  <div class="category-filter">
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['category-tab', { active: selectedCategory === cat }]"
        @click="handleSelect(cat)"
      >
        <span class="category-emoji">{{ categoryEmojis[cat] }}</span>
        <span>{{ cat }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRecipeStore } from '../stores/recipe'
import { categories } from '../data/recipes'

const store = useRecipeStore()
const selectedCategory = store.selectedCategory

const categoryEmojis = {
  '全部': '🍽️',
  '中餐': '🥢',
  '西餐': '🍝',
  '甜点': '🍰',
  '饮品': '🥤',
  '小吃': '🥟'
}

function handleSelect(cat) {
  store.setCategory(cat)
}
</script>

<style scoped>
.category-filter {
  margin-bottom: 24px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.category-tabs {
  display: flex;
  gap: 10px;
  padding: 4px 0;
  white-space: nowrap;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  background: #FFFFFF;
  color: #757575;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.category-tab:hover {
  background: #FFF0E8;
  color: #FF6B35;
  transform: translateY(-2px);
}

.category-tab.active {
  background: #FF6B35;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.category-emoji {
  font-size: 18px;
}

.category-filter::-webkit-scrollbar {
  height: 4px;
}

.category-filter::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}
</style>
