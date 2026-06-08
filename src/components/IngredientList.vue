<template>
  <div class="ingredient-list">
    <div class="section-header">
      <h3 class="section-title">
        <el-icon><List /></el-icon>
        食材清单
        <span class="ingredient-count">({{ checkedCount }}/{{ ingredients.length }})</span>
        <span v-if="scaleRatio !== 1" class="scale-hint">
          已按 {{ currentServings }} 人份换算
        </span>
      </h3>
      <div v-if="recipeId" class="ingredient-actions">
        <el-button size="small" @click="checkAll">
          <el-icon><Select /></el-icon>
          全选
        </el-button>
        <el-button size="small" @click="uncheckAll">
          <el-icon><Close /></el-icon>
          清空
        </el-button>
      </div>
    </div>

    <div class="ingredients">
      <label
        v-for="(ing, index) in scaledIngredients"
        :key="index"
        :class="[
          'ingredient-item',
          {
            checked: checkedItems[index],
            'highlight-related': highlightRelated && relatedIngredientIndices.includes(index),
            'step-highlight': highlightedStepIngredients.includes(index)
          }
        ]"
      >
        <el-checkbox
          v-model="checkedItems[index]"
          @change="onIngredientChange(index)"
        />
        <div class="ingredient-info">
          <span class="ingredient-name">{{ ing.name }}</span>
          <span class="ingredient-amount">
            {{ ing.displayAmount }}
            <span
              v-if="ing.originalAmount && ing.displayAmount !== ing.originalAmount"
              class="original-amount"
            >
              (原: {{ ing.originalAmount }})
            </span>
          </span>
          <span v-if="ing.note" class="ingredient-note">{{ ing.note }}</span>
        </div>
        <div v-if="highlightRelated && relatedIngredientIndices.includes(index)" class="related-badge">
          <el-icon><Warning /></el-icon>
          本步骤需要
        </div>
      </label>
    </div>

    <div v-if="recipeId && checkedCount > 0 && checkedCount < ingredients.length" class="ingredient-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${(checkedCount / ingredients.length) * 100}%` }"></div>
      </div>
      <span class="progress-text">已准备 {{ Math.round((checkedCount / ingredients.length) * 100) }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { parseAmount, formatAmount } from '../data/ingredientCategories'
import { useRecipeStore } from '../stores/recipe'

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
  },
  recipeId: {
    type: [Number, String],
    default: null
  },
  highlightRelated: {
    type: Boolean,
    default: false
  },
  currentStepIndex: {
    type: Number,
    default: -1
  }
})

const emit = defineEmits(['ingredient-change', 'all-checked'])

const store = useRecipeStore()

const checkedItems = ref(props.ingredients.map(() => false))
const highlightedStepIngredients = ref([])

function loadCheckedState() {
  if (props.recipeId) {
    const savedChecked = store.getCookingIngredientsChecked(props.recipeId)
    checkedItems.value = props.ingredients.map((_, index) => savedChecked.includes(index))
  }
}

function saveCheckedState() {
  if (props.recipeId) {
    checkedItems.value.forEach((checked, index) => {
      store.setCookingIngredientChecked(props.recipeId, index, checked)
    })
  }
}

watch(
  () => props.ingredients,
  (newIngredients) => {
    if (props.recipeId) {
      loadCheckedState()
    } else {
      checkedItems.value = newIngredients.map(() => false)
    }
  },
  { deep: true }
)

watch(
  () => props.recipeId,
  () => {
    loadCheckedState()
  }
)

watch(
  () => props.currentStepIndex,
  (stepIdx) => {
    if (stepIdx >= 0 && props.highlightRelated) {
      updateHighlightedIngredients(stepIdx)
    } else {
      highlightedStepIngredients.value = []
    }
  },
  { immediate: true }
)

const checkedCount = computed(() => checkedItems.value.filter(Boolean).length)

const allChecked = computed(() => checkedCount.value === props.ingredients.length && props.ingredients.length > 0)

watch(allChecked, (newVal) => {
  if (newVal) {
    emit('all-checked')
  }
})

const scaledIngredients = computed(() => {
  return props.ingredients.map((ing) => {
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

const relatedIngredientIndices = computed(() => {
  if (props.currentStepIndex < 0 || !props.ingredients.length) return []
  const step = props.ingredients[props.currentStepIndex]
  if (!step) return []

  const indices = []
  const stepDesc = (step.description || '').toLowerCase()
  const stepNote = (step.note || '').toLowerCase()
  const stepText = stepDesc + ' ' + stepNote

  props.ingredients.forEach((ing, idx) => {
    const ingName = ing.name.toLowerCase()
    if (stepText.includes(ingName) || ingName.split('').some((c) => stepText.includes(c) && ingName.length > 1 && stepText.includes(ingName.slice(0, 2)))) {
      indices.push(idx)
    }
  })

  return indices
})

function updateHighlightedIngredients(stepIdx) {
  if (!props.ingredients || stepIdx < 0) return
  const recipe = store.getRecipeById(props.recipeId)
  if (!recipe || !recipe.steps || !recipe.steps[stepIdx]) return

  const step = recipe.steps[stepIdx]
  const stepText = (step.description + ' ' + (step.tip || '')).toLowerCase()
  const indices = []

  recipe.ingredients.forEach((ing, idx) => {
    const ingName = ing.name.toLowerCase()
    if (stepText.includes(ingName)) {
      indices.push(idx)
    } else {
      const shortName = ingName.replace(/[肉|片|块|丝|丁|末|个|只|根|颗|粒|片]/g, '')
      if (shortName.length >= 2 && stepText.includes(shortName)) {
        indices.push(idx)
      }
    }
  })

  highlightedStepIngredients.value = indices
}

function onIngredientChange(index) {
  if (props.recipeId) {
    store.toggleCookingIngredient(props.recipeId, index)
  }
  emit('ingredient-change', { index, checked: checkedItems.value[index], checkedCount: checkedCount.value })
}

function checkAll() {
  if (props.recipeId) {
    store.checkAllCookingIngredients(props.recipeId, props.ingredients.length)
  }
  checkedItems.value = props.ingredients.map(() => true)
  emit('ingredient-change', { index: -1, checked: true, checkedCount: checkedCount.value })
}

function uncheckAll() {
  if (props.recipeId) {
    store.uncheckAllCookingIngredients(props.recipeId)
  }
  checkedItems.value = props.ingredients.map(() => false)
  emit('ingredient-change', { index: -1, checked: false, checkedCount: 0 })
}

onMounted(() => {
  loadCheckedState()
})

defineExpose({
  checkAll,
  uncheckAll,
  checkedCount,
  allChecked
})
</script>

<style scoped>
.ingredient-list {
  margin: 24px 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin: 0;
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
}

.ingredient-actions {
  display: flex;
  gap: 8px;
}

.ingredient-actions .el-button {
  padding: 8px 16px;
  border-radius: 16px;
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
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.ingredient-item:hover {
  background: #FFF0E8;
  transform: translateX(4px);
}

.ingredient-item.checked {
  background: #F0FFF0;
}

.ingredient-item.checked .ingredient-info {
  text-decoration: line-through;
  opacity: 0.6;
}

.ingredient-item.highlight-related,
.ingredient-item.step-highlight {
  background: #FFF8E7;
  border-color: #FF6B35;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
  animation: pulseHighlight 2s infinite;
}

.ingredient-item.highlight-related:not(.checked) .ingredient-name,
.ingredient-item.step-highlight:not(.checked) .ingredient-name {
  color: #FF6B35;
  font-weight: 600;
}

@keyframes pulseHighlight {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
  }
  50% {
    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
  }
}

.ingredient-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
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

.related-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #FF6B35;
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
  animation: badgePulse 1.5s infinite;
}

@keyframes badgePulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.ingredient-progress {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #F0F0F0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 13px;
  color: #4CAF50;
  font-weight: 600;
  white-space: nowrap;
}
</style>
