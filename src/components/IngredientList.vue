<template>
  <div class="ingredient-list">
    <h3 class="section-title">
      <el-icon><List /></el-icon>
      食材清单
      <span class="ingredient-count">({{ checkedCount }}/{{ ingredients.length }})</span>
      <span v-if="scaleRatio !== 1" class="scale-hint">
        已按 {{ currentServings }} 人份换算
      </span>
    </h3>

    <div class="ingredients">
      <label
        v-for="(ing, index) in scaledIngredients"
        :key="index"
        :class="['ingredient-item', { checked: checkedItems[index] }]"
      >
        <el-checkbox v-model="checkedItems[index]" />
        <div class="ingredient-info">
          <span class="ingredient-name">{{ ing.name }}</span>
          <span class="ingredient-amount">
            {{ ing.displayAmount }}
            <span v-if="ing.originalAmount && ing.displayAmount !== ing.originalAmount" class="original-amount">
              (原: {{ ing.originalAmount }})
            </span>
          </span>
          <span v-if="ing.note" class="ingredient-note">{{ ing.note }}</span>
        </div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { parseAmount, formatAmount } from '../data/ingredientCategories'

const props = defineProps({
  ingredients: {
    type: Array,
    required: true
  },
  scaleRatio: {
    type: Number,
    default: 1
  },
  originalServings: {
    type: Number,
    default: 2
  },
  currentServings: {
    type: Number,
    default: 2
  }
})

const checkedItems = ref(props.ingredients.map(() => false))

watch(() => props.ingredients, (newIngredients) => {
  checkedItems.value = newIngredients.map(() => false)
}, { deep: true })

const checkedCount = computed(() => checkedItems.value.filter(Boolean).length)

const scaledIngredients = computed(() => {
  return props.ingredients.map(ing => {
    const parsed = parseAmount(ing.amount)
    let scaledValue = parsed.value
    let displayAmount = ing.amount

    if (parsed.value !== null && props.scaleRatio !== 1) {
      scaledValue = parsed.value * props.scaleRatio
      if (scaledValue < 1 && scaledValue > 0) {
        scaledValue = Math.round(scaledValue * 100) / 100
      } else if (scaledValue >= 1) {
        scaledValue = Math.round(scaledValue * 10) / 10
        if (Number.isInteger(scaledValue)) {
          scaledValue = Math.round(scaledValue)
        }
      }
      displayAmount = formatAmount(scaledValue, parsed.unit)
    }

    return {
      ...ing,
      displayAmount,
      originalAmount: props.scaleRatio !== 1 ? ing.amount : null
    }
  })
})
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
  flex-wrap: wrap;
}

.ingredient-count {
  font-size: 14px;
  font-weight: normal;
  color: #757575;
}

.scale-hint {
  font-size: 12px;
  font-weight: normal;
  color: #FF6B35;
  background: #FFF0E8;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: auto;
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
  display: flex;
  align-items: center;
  gap: 6px;
}

.original-amount {
  color: #999;
  font-size: 12px;
  font-weight: normal;
  text-decoration: line-through;
}

.ingredient-note {
  font-size: 12px;
  color: #999;
  background: #F5F5F5;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
