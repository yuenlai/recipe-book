<template>
  <div class="meal-plan-page">
    <div class="page-header">
      <div class="header-left">
        <h1>本周备餐计划 📅</h1>
        <p>把食谱拖到每天的早午晚餐，轻松规划一周饮食</p>
      </div>
      <div class="header-actions">
        <el-button type="success" @click="handleGenerateShoppingList">
          <el-icon><ShoppingCart /></el-icon>
          生成购物清单
        </el-button>
        <el-button type="danger" plain @click="handleClearWeek">
          <el-icon><Delete /></el-icon>
          清空本周
        </el-button>
      </div>
    </div>

    <div class="meal-plan-container">
      <div class="recipe-sidebar">
        <div class="sidebar-header">
          <h3>食谱库</h3>
          <div class="sidebar-filter">
            <el-select v-model="sidebarCategory" size="small" placeholder="分类筛选" style="width: 100%">
              <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
            </el-select>
          </div>
        </div>
        <div class="recipe-list">
          <div
            v-for="recipe in sidebarRecipes"
            :key="recipe.id"
            class="draggable-recipe"
            draggable="true"
            @dragstart="handleDragStart($event, recipe)"
            @dragend="handleDragEnd"
          >
            <div class="recipe-emoji" :style="{ backgroundColor: recipe.coverColor }">
              {{ recipe.emoji }}
            </div>
            <div class="recipe-info">
              <div class="recipe-name">{{ recipe.name }}</div>
              <div class="recipe-meta">
                <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                  {{ recipe.difficulty }}
                </el-tag>
                <span class="time">
                  <el-icon><Timer /></el-icon>
                  {{ recipe.prepTime + recipe.cookTime }}分钟
                </span>
              </div>
            </div>
            <el-icon class="drag-handle"><Operation /></el-icon>
          </div>
          <div v-if="sidebarRecipes.length === 0" class="empty-recipe-list">
            <el-empty description="没有匹配的食谱" />
          </div>
        </div>
      </div>

      <div class="schedule-grid-wrapper">
        <div class="schedule-grid">
          <div class="grid-header">
            <div class="time-header">餐次</div>
            <div
              v-for="day in weekDates"
              :key="day.key"
              class="day-header"
              :class="{ 'is-today': day.isToday }"
            >
              <div class="day-label">{{ day.label }}</div>
              <div class="day-date">{{ day.date }}</div>
              <div v-if="getDaySummary(day.key).totalTime > 0" class="day-time">
                <el-icon><Timer /></el-icon>
                {{ getDaySummary(day.key).totalTime }}分钟
              </div>
            </div>
          </div>

          <div v-for="meal in mealTypes" :key="meal.type" class="meal-row">
            <div class="meal-label">
              <el-icon>{{ meal.icon }}</el-icon>
              <span>{{ meal.name }}</span>
            </div>
            <div
              v-for="day in weekDates"
              :key="day.key + '-' + meal.type"
              class="meal-slot"
              :class="{
                'drag-over': dragOverTarget?.date === day.key && dragOverTarget?.meal === meal.type,
                'has-recipes': getMealRecipes(day.key, meal.type).length > 0
              }"
              @dragover.prevent="handleDragOver($event, day.key, meal.type)"
              @dragleave="handleDragLeave"
              @drop="handleDrop($event, day.key, meal.type)"
            >
              <div
                v-for="recipe in getMealRecipes(day.key, meal.type)"
                :key="recipe.id"
                class="scheduled-recipe"
                :style="{ borderLeftColor: recipe.coverColor }"
                draggable="true"
                @dragstart="handleScheduledDragStart($event, recipe, day.key, meal.type)"
                @dragend="handleDragEnd"
              >
                <span class="scheduled-emoji">{{ recipe.emoji }}</span>
                <span class="scheduled-name">{{ recipe.name }}</span>
                <span class="scheduled-time">{{ recipe.prepTime + recipe.cookTime }}分</span>
                <el-button
                  type="text"
                  size="small"
                  class="remove-btn"
                  @click.stop="handleRemoveRecipe(day.key, meal.type, recipe.id)"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
              <div v-if="getMealRecipes(day.key, meal.type).length === 0" class="empty-slot">
                <el-icon><Plus /></el-icon>
                <span>拖入食谱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedDay" class="day-summary-panel">
      <div class="summary-header">
        <h3>{{ selectedDay.label }} {{ selectedDay.date }} 汇总</h3>
        <el-button type="text" size="small" @click="selectedDay = null">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="summary-content">
        <div class="summary-stats">
          <div class="stat-item">
            <div class="stat-value">{{ selectedDaySummary.recipes.length }}</div>
            <div class="stat-label">菜品数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ selectedDaySummary.totalPrepTime }}</div>
            <div class="stat-label">准备(分钟)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ selectedDaySummary.totalCookTime }}</div>
            <div class="stat-label">烹饪(分钟)</div>
          </div>
          <div class="stat-item highlight">
            <div class="stat-value">{{ selectedDaySummary.totalTime }}</div>
            <div class="stat-label">总耗时</div>
          </div>
        </div>

        <div v-if="selectedDaySummary.recipes.length > 0" class="summary-section">
          <h4>今日菜品</h4>
          <div class="recipes-list">
            <div
              v-for="recipe in selectedDaySummary.recipes"
              :key="recipe.id"
              class="recipe-mini-item"
              @click="goToRecipe(recipe.id)"
            >
              <span class="mini-emoji">{{ recipe.emoji }}</span>
              <span class="mini-name">{{ recipe.name }}</span>
              <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                {{ recipe.difficulty }}
              </el-tag>
            </div>
          </div>
        </div>

        <div v-if="selectedDaySummary.ingredients.length > 0" class="summary-section">
          <h4>食材汇总</h4>
          <div class="ingredients-grid">
            <div v-for="ing in selectedDaySummary.ingredients" :key="ing.name" class="ingredient-item">
              <span class="ing-name">{{ ing.name }}</span>
              <span class="ing-amount">{{ ing.amount > 0 ? ing.amount + ing.unit : '适量' }}</span>
            </div>
          </div>
        </div>

        <div class="summary-actions">
          <el-button type="success" @click="handleGenerateDayShoppingList(selectedDay.key)">
            <el-icon><ShoppingCart /></el-icon>
            生成当天购物清单
          </el-button>
          <el-button type="danger" plain @click="handleClearDay(selectedDay.key)">
            <el-icon><Delete /></el-icon>
            清空当天
          </el-button>
        </div>
      </div>
    </div>

    <div class="day-cards">
      <div
        v-for="day in weekDates"
        :key="'card-' + day.key"
        class="day-card"
        :class="{ 'is-today': day.isToday, 'active': selectedDay?.key === day.key }"
        @click="toggleDaySummary(day)"
      >
        <div class="card-day">
          <span class="card-label">{{ day.label }}</span>
          <span class="card-date">{{ day.date }}</span>
        </div>
        <div class="card-meals">
          <div class="meal-count" :class="{ 'has-meals': getMealCount(day.key, 'breakfast') > 0 }">
            早 {{ getMealCount(day.key, 'breakfast') }}
          </div>
          <div class="meal-count" :class="{ 'has-meals': getMealCount(day.key, 'lunch') > 0 }">
            午 {{ getMealCount(day.key, 'lunch') }}
          </div>
          <div class="meal-count" :class="{ 'has-meals': getMealCount(day.key, 'dinner') > 0 }">
            晚 {{ getMealCount(day.key, 'dinner') }}
          </div>
        </div>
        <div v-if="getDaySummary(day.key).totalTime > 0" class="card-time">
          <el-icon><Timer /></el-icon>
          {{ getDaySummary(day.key).totalTime }}分钟
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'
import { categories } from '../data/recipes'

const store = useRecipeStore()
const router = useRouter()

const mealTypes = [
  { type: 'breakfast', name: '早餐', icon: 'Sunrise' },
  { type: 'lunch', name: '午餐', icon: 'Sunny' },
  { type: 'dinner', name: '晚餐', icon: 'Moon' }
]

const sidebarCategory = ref('全部')
const selectedDay = ref(null)
const dragOverTarget = ref(null)
const draggingRecipe = ref(null)
const draggingSource = ref(null)

const sidebarRecipes = computed(() => {
  if (sidebarCategory.value === '全部') {
    return store.recipes
  }
  return store.recipes.filter(r => r.category === sidebarCategory.value)
})

const weekDates = computed(() => store.weekDates)

const selectedDaySummary = computed(() => {
  if (!selectedDay.value) return { recipes: [], totalPrepTime: 0, totalCookTime: 0, totalTime: 0, ingredients: [] }
  return store.getDaySummary(selectedDay.value.key)
})

function getDifficultyType(difficulty) {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[difficulty] || 'info'
}

function getMealRecipes(dateKey, mealType) {
  return store.mealPlanWithRecipes[dateKey]?.[mealType] || []
}

function getMealCount(dateKey, mealType) {
  return getMealRecipes(dateKey, mealType).length
}

function getDaySummary(dateKey) {
  return store.getDaySummary(dateKey)
}

function handleDragStart(event, recipe) {
  draggingRecipe.value = recipe
  draggingSource.value = null
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('text/plain', recipe.id)
  event.target.classList.add('dragging')
}

function handleScheduledDragStart(event, recipe, dateKey, mealType) {
  draggingRecipe.value = recipe
  draggingSource.value = { date: dateKey, meal: mealType }
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', recipe.id)
  event.target.classList.add('dragging')
}

function handleDragEnd(event) {
  event.target.classList.remove('dragging')
  draggingRecipe.value = null
  draggingSource.value = null
  dragOverTarget.value = null
}

function handleDragOver(event, dateKey, mealType) {
  event.dataTransfer.dropEffect = draggingSource.value ? 'move' : 'copy'
  dragOverTarget.value = { date: dateKey, meal: mealType }
}

function handleDragLeave() {
  dragOverTarget.value = null
}

function handleDrop(event, dateKey, mealType) {
  event.preventDefault()
  if (draggingRecipe.value) {
    if (draggingSource.value) {
      store.moveRecipe(
        draggingSource.value.date,
        draggingSource.value.meal,
        dateKey,
        mealType,
        draggingRecipe.value.id
      )
    } else {
      store.addRecipeToMeal(dateKey, mealType, draggingRecipe.value.id)
    }
  }
  dragOverTarget.value = null
}

function handleRemoveRecipe(dateKey, mealType, recipeId) {
  store.removeRecipeFromMeal(dateKey, mealType, recipeId)
}

function handleClearDay(dateKey) {
  ElMessageBox.confirm('确定要清空当天的备餐安排吗？', '确认清空', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.clearDayPlan(dateKey)
    if (selectedDay.value?.key === dateKey) {
      selectedDay.value = null
    }
  }).catch(() => {})
}

function handleClearWeek() {
  ElMessageBox.confirm('确定要清空本周所有备餐安排吗？此操作不可恢复。', '确认清空', {
    confirmButtonText: '确定清空',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.clearWeekPlan()
    selectedDay.value = null
  }).catch(() => {})
}

function toggleDaySummary(day) {
  if (selectedDay.value?.key === day.key) {
    selectedDay.value = null
  } else {
    selectedDay.value = day
  }
}

function goToRecipe(recipeId) {
  router.push(`/recipe/${recipeId}`)
}

function handleGenerateDayShoppingList(dateKey) {
  const dayPlan = store.mealPlan[dateKey]
  const recipeIds = new Set()
  
  if (dayPlan) {
    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      if (dayPlan[mealType]) {
        dayPlan[mealType].forEach(id => recipeIds.add(id))
      }
    })
  }
  
  if (recipeIds.size === 0) {
    ElMessage.warning('当天还没有安排食谱')
    return
  }
  
  ElMessageBox.confirm(
    `检测到当天有 ${recipeIds.size} 道菜，是否导入到购物清单？`,
    '生成当天购物清单',
    {
      confirmButtonText: '导入并跳转',
      cancelButtonText: '仅导入',
      distinguishCancelAndClose: true,
      type: 'info'
    }
  ).then(() => {
    store.addMealPlanToShoppingList([dateKey])
    router.push('/shopping-list')
  }).catch(action => {
    if (action === 'cancel') {
      store.addMealPlanToShoppingList([dateKey])
      ElMessage.success(`已导入 ${recipeIds.size} 道菜到购物清单`)
    }
  })
}

function handleGenerateShoppingList() {
  const recipeIds = new Set()
  
  Object.values(store.mealPlan).forEach(dayPlan => {
    if (dayPlan) {
      ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
        if (dayPlan[mealType]) {
          dayPlan[mealType].forEach(id => recipeIds.add(id))
        }
      })
    }
  })
  
  if (recipeIds.size === 0) {
    ElMessage.warning('备餐计划中还没有食谱，请先添加食谱')
    return
  }
  
  ElMessageBox.confirm(
    `检测到本周备餐计划中有 ${recipeIds.size} 道菜，是否导入到购物清单？`,
    '生成购物清单',
    {
      confirmButtonText: '导入并跳转',
      cancelButtonText: '仅导入',
      distinguishCancelAndClose: true,
      type: 'info'
    }
  ).then(() => {
    store.addMealPlanToShoppingList()
    router.push('/shopping-list')
  }).catch(action => {
    if (action === 'cancel') {
      store.addMealPlanToShoppingList()
      ElMessage.success(`已导入 ${recipeIds.size} 道菜到购物清单`)
    }
  })
}
</script>

<style scoped>
.meal-plan-page {
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-top: 20px;
}

.header-left h1 {
  font-size: 28px;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.header-left p {
  color: #757575;
  font-size: 14px;
}

.meal-plan-container {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.recipe-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  max-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  margin-bottom: 16px;
}

.sidebar-header h3 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #3D3D3D;
}

.recipe-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.draggable-recipe {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #FFF8F0;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.draggable-recipe:hover {
  background: #FFF0E8;
  border-color: #FF6B35;
}

.draggable-recipe.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.recipe-emoji {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.recipe-info {
  flex: 1;
  min-width: 0;
}

.recipe-name {
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recipe-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.recipe-meta .time {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: #757575;
}

.drag-handle {
  color: #BDBDBD;
  cursor: grab;
}

.empty-recipe-list {
  padding: 20px 0;
}

.schedule-grid-wrapper {
  flex: 1;
  overflow-x: auto;
}

.schedule-grid {
  min-width: 800px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.grid-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  background: linear-gradient(135deg, #FF6B35, #FF8A80);
  color: white;
}

.time-header {
  padding: 16px 8px;
  text-align: center;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.1);
}

.day-header {
  padding: 12px 8px;
  text-align: center;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.day-header.is-today {
  background: rgba(255, 255, 255, 0.2);
}

.day-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.day-date {
  font-size: 12px;
  opacity: 0.9;
}

.day-time {
  font-size: 11px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  opacity: 0.95;
}

.meal-row {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 1px solid #F0F0F0;
}

.meal-row:last-child {
  border-bottom: none;
}

.meal-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 8px;
  background: #FAFAFA;
  font-size: 13px;
  font-weight: 500;
  color: #757575;
  border-right: 1px solid #F0F0F0;
}

.meal-slot {
  min-height: 100px;
  padding: 8px;
  border-left: 1px solid #F0F0F0;
  transition: all 0.2s ease;
  background: white;
}

.meal-slot.drag-over {
  background: #FFF0E8;
  border: 2px dashed #FF6B35;
}

.meal-slot.has-recipes {
  background: #FFFBF8;
}

.scheduled-recipe {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: white;
  border-radius: 8px;
  margin-bottom: 6px;
  font-size: 12px;
  border-left: 3px solid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: grab;
  transition: all 0.2s ease;
}

.scheduled-recipe:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.scheduled-recipe.dragging {
  opacity: 0.5;
}

.scheduled-emoji {
  font-size: 16px;
  flex-shrink: 0;
}

.scheduled-name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.scheduled-time {
  color: #757575;
  font-size: 11px;
  flex-shrink: 0;
}

.remove-btn {
  padding: 0;
  margin-left: auto;
  color: #BDBDBD;
}

.remove-btn:hover {
  color: #F56C6C;
}

.empty-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  color: #BDBDBD;
  font-size: 12px;
  gap: 4px;
}

.day-summary-panel {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
}

.summary-header h3 {
  font-size: 18px;
  color: #3D3D3D;
  margin: 0;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #FFF8F0;
  border-radius: 12px;
}

.stat-item.highlight {
  background: linear-gradient(135deg, #FFF0E8, #FFE4D6);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #FF6B35;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #757575;
}

.summary-section {
  margin-bottom: 20px;
}

.summary-section h4 {
  font-size: 14px;
  color: #3D3D3D;
  margin-bottom: 12px;
}

.recipes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recipe-mini-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #F5F5F5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recipe-mini-item:hover {
  background: #EFEFEF;
  transform: translateY(-1px);
}

.mini-emoji {
  font-size: 16px;
}

.mini-name {
  font-size: 13px;
  font-weight: 500;
  color: #3D3D3D;
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #F5F5F5;
  border-radius: 8px;
  font-size: 13px;
}

.ing-name {
  color: #3D3D3D;
  font-weight: 500;
}

.ing-amount {
  color: #FF6B35;
  font-weight: 600;
}

.summary-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.day-cards {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
}

.day-card {
  background: white;
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
}

.day-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.day-card.is-today {
  border-color: #FF6B35;
  background: linear-gradient(135deg, #FFFBF8, #FFF0E8);
}

.day-card.active {
  border-color: #FF6B35;
  background: #FFF0E8;
}

.card-day {
  margin-bottom: 10px;
}

.card-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 2px;
}

.card-date {
  font-size: 12px;
  color: #757575;
}

.card-meals {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
}

.meal-count {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #F5F5F5;
  color: #BDBDBD;
}

.meal-count.has-meals {
  background: #FFE4D6;
  color: #FF6B35;
  font-weight: 600;
}

.card-time {
  font-size: 12px;
  color: #757575;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

@media (max-width: 1200px) {
  .meal-plan-container {
    flex-direction: column;
  }

  .recipe-sidebar {
    width: 100%;
    max-height: 300px;
  }

  .day-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
  }

  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .day-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
