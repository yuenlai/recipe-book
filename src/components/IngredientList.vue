<template>
  <div class="ingredient-list">
    <h3 class="section-title">
      <el-icon><List /></el-icon>
      食材清单
      <span class="ingredient-count">({{ checkedCount }}/{{ ingredients.length }})</span>
    </h3>

    <div class="ingredients">
      <label
        v-for="(ing, index) in ingredients"
        :key="index"
        :class="['ingredient-item', { checked: checkedItems[index] }]"
      >
        <el-checkbox v-model="checkedItems[index]" />
        <div class="ingredient-info">
          <span class="ingredient-name">{{ ing.name }}</span>
          <span class="ingredient-amount">{{ ing.amount }}</span>
          <span v-if="ing.note" class="ingredient-note">{{ ing.note }}</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  ingredients: {
    type: Array,
    required: true
  }
})

const checkedItems = ref(props.ingredients.map(() => false))

const checkedCount = computed(() => checkedItems.value.filter(Boolean).length)
</script>

<style scoped>
.ingredient-list {
  margin: 24px 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 16px;
}

.ingredient-count {
  font-size: 14px;
  font-weight: normal;
  color: #757575;
}

.ingredients {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #FAFAFA;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ingredient-item:hover {
  background: #FFF0E8;
}

.ingredient-item.checked {
  background: #F0FFF0;
}

.ingredient-item.checked .ingredient-info {
  text-decoration: line-through;
  opacity: 0.6;
}

.ingredient-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ingredient-name {
  font-weight: 500;
  color: #3D3D3D;
}

.ingredient-amount {
  color: #FF6B35;
  font-weight: 500;
}

.ingredient-note {
  font-size: 12px;
  color: #999;
  background: #F5F5F5;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
