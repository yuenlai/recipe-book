<template>
  <div class="dinner-party-page">
    <div class="page-header">
      <div class="header-left">
        <h1>多人聚餐配菜 🍱</h1>
        <p>输入聚餐人数和口味偏好，智能推荐一桌完美搭配</p>
      </div>
      <div v-if="dinnerPartyPlan" class="header-actions">
        <el-button type="warning" @click="handleRegenerate">
          <el-icon><Refresh /></el-icon>
          换一批
        </el-button>
        <el-button type="success" @click="handleAddToShoppingList">
          <el-icon><ShoppingCart /></el-icon>
          加入购物清单
        </el-button>
        <el-button type="primary" @click="handleAddToMealPlan">
          <el-icon><Calendar /></el-icon>
          加入备餐计划
        </el-button>
      </div>
    </div>

    <div class="input-section">
      <div class="input-card">
        <div class="input-group">
          <label class="input-label">
            <el-icon><UserFilled /></el-icon>
            聚餐人数
          </label>
          <div class="people-selector">
            <el-button
              v-for="count in peopleOptions"
              :key="count"
              :type="people === count ? 'primary' : 'default'"
              @click="people = count"
              :class="{ active: people === count }"
            >
              {{ count }}人
            </el-button>
          </div>
          <div class="people-slider">
            <span class="slider-label">2人</span>
            <el-slider
              v-model="people"
              :min="2"
              :max="20"
              :step="1"
              :marks="sliderMarks"
              show-stops
            />
            <span class="slider-label">20人</span>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">
            <el-icon><Food /></el-icon>
            口味偏好
          </label>
          <div class="taste-selector">
            <div
              v-for="taste in tastePreferences"
              :key="taste.value"
              class="taste-item"
              :class="{ active: selectedTaste === taste.value }"
              @click="selectedTaste = taste.value"
            >
              <span class="taste-emoji">{{ taste.emoji }}</span>
              <span class="taste-label">{{ taste.label }}</span>
            </div>
          </div>
        </div>

        <el-button type="primary" size="large" class="generate-btn" @click="handleGenerate">
          <el-icon><MagicStick /></el-icon>
          智能配菜
        </el-button>
      </div>
    </div>

    <div v-if="dinnerPartyPlan" class="result-section">
      <div class="result-summary">
        <div class="summary-header">
          <h2>🎉 为您推荐的聚餐方案</h2>
          <div class="summary-meta">
            <el-tag type="info" size="large">
              <el-icon><UserFilled /></el-icon>
              {{ dinnerPartyPlan.people }}人聚餐
            </el-tag>
            <el-tag type="warning" size="large">
              {{ dinnerPartyPlan.tasteLabel }}
            </el-tag>
            <el-tag type="success" size="large">
              <el-icon><Bowl /></el-icon>
              共{{ dinnerPartyPlan.recipes.length }}道菜
            </el-tag>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value">{{ dinnerPartyPlan.totalPrepTime }}</div>
              <div class="stat-label">准备时间(分钟)</div>
            </div>
          </div>
          <div class="stat-card highlight">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-value">{{ dinnerPartyPlan.totalCookTime }}</div>
              <div class="stat-label">烹饪时间(分钟)</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⌛</div>
            <div class="stat-content">
              <div class="stat-value">{{ dinnerPartyPlan.totalTime }}</div>
              <div class="stat-label">总耗时(分钟)</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🍽️</div>
            <div class="stat-content">
              <div class="stat-value">{{ dinnerPartyPlan.totalServings }}</div>
              <div class="stat-label">总份量</div>
            </div>
          </div>
        </div>

        <div v-if="dinnerPartyPlan.multiplier > 1" class="multiplier-tip">
          <el-alert
            :title="`食材已自动放大 ${dinnerPartyPlan.multiplier} 倍以满足 ${dinnerPartyPlan.people} 人需求`"
            type="info"
            show-icon
            :closable="false"
          />
        </div>
      </div>

      <div class="dishes-section">
        <h3 class="section-title">
          <el-icon><Menu /></el-icon>
          菜品搭配
        </h3>
        <div class="dish-categories">
          <div
            v-for="cat in dinnerPartyPlan.dishCategories"
            :key="cat.key"
            class="dish-category"
            v-show="cat.recipes.length > 0"
          >
            <div class="category-header">
              <span class="category-emoji">{{ cat.emoji }}</span>
              <span class="category-name">{{ cat.name }}</span>
              <el-tag size="small" type="info">{{ cat.recipes.length }}道</el-tag>
            </div>
            <div class="category-dishes">
              <div
                v-for="recipe in cat.recipes"
                :key="recipe.id"
                class="dish-card"
                @click="goToRecipe(recipe.id)"
              >
                <div class="dish-emoji" :style="{ backgroundColor: recipe.coverColor }">
                  {{ recipe.emoji }}
                </div>
                <div class="dish-info">
                  <div class="dish-name">{{ recipe.name }}</div>
                  <div class="dish-meta">
                    <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                      {{ recipe.difficulty }}
                    </el-tag>
                    <span class="dish-time">
                      <el-icon><Timer /></el-icon>
                      {{ recipe.prepTime + recipe.cookTime }}分钟
                    </span>
                    <span class="dish-servings">
                      <el-icon><UserFilled /></el-icon>
                      {{ recipe.servings }}人份
                    </span>
                  </div>
                </div>
                <el-icon class="dish-arrow"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ingredients-section">
        <h3 class="section-title">
          <el-icon><ShoppingCart /></el-icon>
          食材清单
        </h3>
        <div class="ingredients-groups">
          <div
            v-for="group in dinnerPartyPlan.groupedIngredients"
            :key="group.category"
            class="ingredient-group"
          >
            <div class="group-header">
              <span class="group-emoji">{{ group.emoji }}</span>
              <span class="group-name">{{ group.category }}</span>
              <el-tag size="small" type="info">{{ group.items.length }}项</el-tag>
            </div>
            <div class="group-items">
              <div
                v-for="item in group.items"
                :key="item.name"
                class="ingredient-item"
              >
                <span class="ing-name">{{ item.name }}</span>
                <span class="ing-amount">{{ item.displayAmount }}</span>
                <div v-if="item.notes.length > 0" class="ing-notes">
                  <el-tag
                    v-for="note in item.notes"
                    :key="note"
                    size="small"
                    type="info"
                    effect="plain"
                  >
                    {{ note }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="dinnerPartyHistory.length > 0" class="history-section">
      <h3 class="section-title">
        <el-icon><Clock /></el-icon>
        历史方案
      </h3>
      <div class="history-list">
        <div
          v-for="plan in dinnerPartyHistory"
          :key="plan.id"
          class="history-item"
          @click="loadHistoryPlan(plan)"
        >
          <div class="history-info">
            <div class="history-date">{{ formatDate(plan.savedAt) }}</div>
            <div class="history-meta">
              <el-tag size="small">{{ plan.people }}人</el-tag>
              <el-tag size="small" type="warning">{{ plan.tasteLabel }}</el-tag>
              <el-tag size="small" type="success">{{ plan.recipes.length }}道菜</el-tag>
            </div>
          </div>
          <div class="history-recipes">
            <span
              v-for="recipe in plan.recipes.slice(0, 4)"
              :key="recipe.id"
              class="history-recipe"
            >
              {{ recipe.emoji }} {{ recipe.name }}
            </span>
            <span v-if="plan.recipes.length > 4" class="history-more">
              +{{ plan.recipes.length - 4 }}
            </span>
          </div>
          <el-icon class="history-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
      <el-button type="danger" plain size="small" class="clear-history" @click="handleClearHistory">
        <el-icon><Delete /></el-icon>
        清空历史
      </el-button>
    </div>

    <el-dialog
      v-model="mealPlanDialogVisible"
      title="添加到备餐计划"
      width="400px"
    >
      <el-form label-width="80px">
        <el-form-item label="选择日期">
          <el-select v-model="selectedDate" placeholder="请选择日期">
            <el-option
              v-for="day in weekDates"
              :key="day.key"
              :label="`${day.label} ${day.date}`"
              :value="day.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择餐次">
          <el-select v-model="selectedMeal" placeholder="请选择餐次">
            <el-option label="早餐" value="breakfast" />
            <el-option label="午餐" value="lunch" />
            <el-option label="晚餐" value="dinner" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="mealPlanDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddToMealPlan">确定添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'

const store = useRecipeStore()
const router = useRouter()

const people = ref(store.dinnerPartyPeople)
const selectedTaste = ref(store.dinnerPartyTaste)
const mealPlanDialogVisible = ref(false)
const selectedDate = ref('')
const selectedMeal = ref('dinner')

const peopleOptions = [2, 4, 6, 8, 10, 12]

const sliderMarks = {
  2: '2',
  5: '5',
  10: '10',
  15: '15',
  20: '20'
}

const tastePreferences = computed(() => store.tastePreferences)
const dinnerPartyPlan = computed(() => store.dinnerPartyPlan)
const dinnerPartyHistory = computed(() => store.dinnerPartyHistory)
const weekDates = computed(() => store.weekDates)

function getDifficultyType(difficulty) {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[difficulty] || 'info'
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function handleGenerate() {
  store.setDinnerPartyPeople(people.value)
  store.setDinnerPartyTaste(selectedTaste.value)
  store.generateDinnerParty(people.value, selectedTaste.value)
  ElMessage.success('配菜方案已生成！')
}

function handleRegenerate() {
  store.regenerateDinnerParty()
  ElMessage.success('已为您重新生成配菜方案！')
}

function handleAddToShoppingList() {
  ElMessageBox.confirm(
    `确定要将 ${dinnerPartyPlan.value.recipes.length} 道菜的食材加入购物清单吗？`,
    '加入购物清单',
    {
      confirmButtonText: '加入并跳转',
      cancelButtonText: '仅加入',
      distinguishCancelAndClose: true,
      type: 'info'
    }
  ).then(() => {
    store.addDinnerPartyToShoppingList()
    store.addDinnerPartyToHistory()
    router.push('/shopping-list')
  }).catch(action => {
    if (action === 'cancel') {
      store.addDinnerPartyToShoppingList()
      store.addDinnerPartyToHistory()
      ElMessage.success('已加入购物清单！')
    }
  })
}

function handleAddToMealPlan() {
  if (weekDates.value.length > 0) {
    selectedDate.value = weekDates.value[0].key
  }
  mealPlanDialogVisible.value = true
}

function confirmAddToMealPlan() {
  if (!selectedDate.value) {
    ElMessage.warning('请选择日期')
    return
  }
  store.addDinnerPartyRecipesToMealPlan(selectedDate.value, selectedMeal.value)
  store.addDinnerPartyToHistory()
  mealPlanDialogVisible.value = false
  ElMessage.success(`已添加到备餐计划！`)
}

function handleClearHistory() {
  ElMessageBox.confirm('确定要清空所有历史方案吗？', '确认清空', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.clearDinnerPartyHistory()
    ElMessage.success('历史记录已清空')
  }).catch(() => {})
}

function loadHistoryPlan(plan) {
  store.dinnerPartyPlan = plan
  store.saveDinnerPartyPlan()
  ElMessage.success('已加载历史方案')
}

function goToRecipe(recipeId) {
  router.push(`/recipe/${recipeId}`)
}
</script>

<style scoped>
.dinner-party-page {
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

.header-actions {
  display: flex;
  gap: 12px;
}

.input-section {
  margin-bottom: 32px;
}

.input-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.input-group {
  margin-bottom: 28px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 16px;
}

.people-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.people-selector .el-button.active {
  background: #FF6B35;
  border-color: #FF6B35;
}

.people-slider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.slider-label {
  font-size: 13px;
  color: #757575;
  min-width: 30px;
}

.people-slider .el-slider {
  flex: 1;
}

.taste-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.taste-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: #FAFAFA;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.taste-item:hover {
  background: #FFF8F0;
}

.taste-item.active {
  background: linear-gradient(135deg, #FFF0E8, #FFE4D6);
  border-color: #FF6B35;
}

.taste-emoji {
  font-size: 28px;
}

.taste-label {
  font-size: 13px;
  font-weight: 500;
  color: #3D3D3D;
}

.generate-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #FF6B35, #FF8A80);
  border: none;
}

.generate-btn:hover {
  background: linear-gradient(135deg, #E55A2B, #FF6B35);
}

.result-section {
  margin-bottom: 32px;
}

.result-summary {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.summary-header h2 {
  font-size: 22px;
  color: #3D3D3D;
  margin: 0;
}

.summary-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.summary-meta .el-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #FFF8F0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card.highlight {
  background: linear-gradient(135deg, #FFF0E8, #FFE4D6);
}

.stat-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #FF6B35;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #757575;
}

.multiplier-tip {
  margin-top: 16px;
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

.dishes-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.dish-categories {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #F0F0F0;
}

.category-emoji {
  font-size: 20px;
}

.category-name {
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
}

.category-dishes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.dish-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #FFF8F0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.dish-card:hover {
  background: #FFF0E8;
  border-color: #FFE4D6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dish-emoji {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.dish-info {
  flex: 1;
  min-width: 0;
}

.dish-name {
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 6px;
}

.dish-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.dish-time,
.dish-servings {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: #757575;
}

.dish-arrow {
  color: #BDBDBD;
  flex-shrink: 0;
}

.ingredients-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.ingredients-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.ingredient-group {
  background: #FAFAFA;
  border-radius: 12px;
  padding: 16px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F0F0F0;
}

.group-emoji {
  font-size: 18px;
}

.group-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
}

.group-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ingredient-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
}

.ing-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: #3D3D3D;
}

.ing-amount {
  font-size: 13px;
  font-weight: 600;
  color: #FF6B35;
  white-space: nowrap;
}

.ing-notes {
  width: 100%;
  margin-top: 6px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.history-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.history-item:hover {
  background: #FFF8F0;
  border-color: #FFE4D6;
}

.history-info {
  flex-shrink: 0;
  width: 140px;
}

.history-date {
  font-size: 13px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 4px;
}

.history-meta {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.history-recipes {
  flex: 1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
}

.history-recipe {
  font-size: 12px;
  color: #757575;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.history-more {
  font-size: 12px;
  color: #FF6B35;
  font-weight: 600;
}

.history-arrow {
  color: #BDBDBD;
  flex-shrink: 0;
}

.clear-history {
  display: block;
  margin: 0 auto;
}

@media (max-width: 992px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-dishes {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .taste-selector {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-info {
    width: 100%;
  }

  .ingredients-groups {
    grid-template-columns: 1fr;
  }
}
</style>
