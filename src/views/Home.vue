<template>
  <div class="home-page">
    <div class="page-header">
      <h1>探索美食 🍽️</h1>
      <p>发现美味，享受烹饪的乐趣</p>
    </div>

    <div class="quick-entry-section">
      <router-link to="/breakfast" class="quick-entry-card breakfast-card">
        <div class="entry-icon">🌅</div>
        <div class="entry-content">
          <h3>早餐专区</h3>
          <p>按起床后可用时间快速筛选</p>
          <div class="entry-tags">
            <el-tag size="small" type="success" effect="light">⏱️ 10分钟</el-tag>
            <el-tag size="small" type="warning" effect="light">⏰ 20分钟</el-tag>
            <el-tag size="small" type="danger" effect="light">👨‍🍳 30分钟</el-tag>
          </div>
        </div>
        <div class="entry-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </router-link>
    </div>

    <div v-if="hasMealsPlanned" class="week-plan-preview">
      <div class="preview-header">
        <div class="preview-title">
          <el-icon><Calendar /></el-icon>
          <span>本周备餐安排</span>
        </div>
        <router-link to="/meal-plan" class="view-all-link">
          查看详情
          <el-icon><ArrowRight /></el-icon>
        </router-link>
      </div>
      <div class="week-mini-cards">
        <div
          v-for="day in weekPlanSummary"
          :key="day.key"
          class="mini-day-card"
          :class="{ 'is-today': day.isToday, 'has-meals': day.mealCount > 0 }"
        >
          <div class="mini-day-label">{{ day.label }}</div>
          <div class="mini-day-date">{{ day.date }}</div>
          <div class="mini-meals-indicator">
            <span
              class="meal-dot"
              :class="{ active: day.breakfastCount > 0 }"
              title="早餐"
            >早</span>
            <span
              class="meal-dot"
              :class="{ active: day.lunchCount > 0 }"
              title="午餐"
            >午</span>
            <span
              class="meal-dot"
              :class="{ active: day.dinnerCount > 0 }"
              title="晚餐"
            >晚</span>
          </div>
          <div v-if="day.totalTime > 0" class="mini-time">
            <el-icon><Timer /></el-icon>
            {{ day.totalTime }}分钟
          </div>
          <div v-else class="mini-empty">未安排</div>
        </div>
      </div>
      <div class="preview-footer">
        <span class="total-meals">本周共安排 {{ totalMealsPlanned }} 道菜</span>
        <span class="total-time">总耗时 {{ totalWeekTime }} 分钟</span>
      </div>
    </div>

    <div v-else class="week-plan-empty" @click="goToMealPlan">
      <div class="empty-icon">📅</div>
      <div class="empty-text">
        <h4>还没有备餐计划</h4>
        <p>点击这里开始规划本周饮食</p>
      </div>
      <el-button type="primary" size="small">
        <el-icon><Plus /></el-icon>
        开始规划
      </el-button>
    </div>

    <div v-if="fridgeRecommendations.length > 0" class="fridge-recommend-section">
      <div class="section-header">
        <div class="section-title">
          <el-icon><Refrigerator /></el-icon>
          <span>冰箱智能推荐</span>
          <el-tag type="warning" size="small" effect="light">
            {{ fridgeExpiringCount }} 种食材快到期
          </el-tag>
        </div>
        <router-link to="/fridge" class="view-all-link">
          管理冰箱
          <el-icon><ArrowRight /></el-icon>
        </router-link>
      </div>
      <div class="fridge-recommend-grid">
        <div
          v-for="item in fridgeRecommendations"
          :key="item.recipe.id"
          class="fridge-recommend-card"
          @click="goToRecipe(item.recipe.id)"
        >
          <div class="card-badge">优先推荐</div>
          <div class="card-emoji" :style="{ backgroundColor: item.recipe.coverColor }">
            {{ item.recipe.emoji }}
          </div>
          <div class="card-content">
            <div class="card-name">{{ item.recipe.name }}</div>
            <div class="card-desc">{{ item.recipe.description }}</div>
            <div class="card-match-info">
              <div class="match-count">
                <el-icon><StarFilled /></el-icon>
                可消耗 {{ item.matchCount }} 种快到期食材
              </div>
              <div class="match-ingredients">
                <el-tag
                  v-for="ing in item.matchedItems"
                  :key="ing.id"
                  size="small"
                  type="warning"
                  effect="dark"
                >
                  {{ ing.name }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CategoryFilter />

    <div v-if="filteredRecipes.length === 0" class="empty-state">
      <el-empty description="没有找到匹配的食谱" />
    </div>

    <div v-else>
      <div class="recipe-grid">
        <RecipeCard
          v-for="recipe in paginatedRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <div v-if="totalPages > 1" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="9"
          :total="filteredRecipes.length"
          layout="prev, pager, next"
          background
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onActivated, onDeactivated, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import CategoryFilter from '../components/CategoryFilter.vue'
import RecipeCard from '../components/RecipeCard.vue'

defineOptions({
  name: 'Home'
})

const store = useRecipeStore()
const router = useRouter()

const filteredRecipes = computed(() => store.filteredRecipes)
const paginatedRecipes = computed(() => store.paginatedRecipes)
const totalPages = computed(() => store.totalPages)
const currentPage = computed({
  get: () => store.currentPage,
  set: () => {}
})

const weekPlanSummary = computed(() => store.weekPlanSummary)
const fridgeRecommendations = computed(() => store.recommendedRecipesForFridge)
const fridgeExpiringCount = computed(() => store.fridgeStats.expiring)

const hasMealsPlanned = computed(() => {
  return weekPlanSummary.value.some(day => day.mealCount > 0)
})

const totalMealsPlanned = computed(() => {
  return weekPlanSummary.value.reduce((sum, day) => sum + day.mealCount, 0)
})

const totalWeekTime = computed(() => {
  return weekPlanSummary.value.reduce((sum, day) => sum + day.totalTime, 0)
})

function handlePageChange(page) {
  store.setPage(page)
  store.setScrollPosition(0)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToMealPlan() {
  router.push('/meal-plan')
}

function goToRecipe(id) {
  store.setScrollPosition(window.scrollY)
  router.push(`/recipe/${id}`)
}

function saveScrollPosition() {
  store.setScrollPosition(window.scrollY)
}

function restoreScrollPosition() {
  nextTick(() => {
    const scrollPos = store.homeScrollPosition || 0
    window.scrollTo({ top: scrollPos, behavior: 'auto' })
  })
}

onActivated(() => {
  restoreScrollPosition()
})

onDeactivated(() => {
  saveScrollPosition()
})
</script>

<style scoped>
.home-page {
  padding-bottom: 40px;
}

.quick-entry-section {
  margin-bottom: 24px;
}

.quick-entry-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #FFF7E6 0%, #FFF0E8 100%);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
}

.quick-entry-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
  border-color: #FFE4D6;
}

.breakfast-card {
  background: linear-gradient(135deg, #FFF7E6 0%, #FFE4D6 50%, #FFF0E8 100%);
}

.entry-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.entry-content {
  flex: 1;
}

.entry-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #3D3D3D;
  margin: 0 0 6px 0;
}

.entry-content p {
  font-size: 14px;
  color: #757575;
  margin: 0 0 12px 0;
}

.entry-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.entry-arrow {
  font-size: 24px;
  color: #FF6B35;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.quick-entry-card:hover .entry-arrow {
  transform: translateX(4px);
}

@media (max-width: 600px) {
  .quick-entry-card {
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
  }

  .entry-icon {
    font-size: 36px;
  }

  .entry-content h3 {
    font-size: 18px;
  }

  .entry-arrow {
    width: 100%;
    text-align: center;
  }
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  padding-top: 20px;
}

.page-header h1 {
  font-size: 32px;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.page-header p {
  color: #757575;
  font-size: 16px;
}

.week-plan-preview {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #3D3D3D;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #FF6B35;
  text-decoration: none;
  transition: all 0.2s ease;
}

.view-all-link:hover {
  color: #E55A2B;
}

.week-mini-cards {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.mini-day-card {
  text-align: center;
  padding: 12px 8px;
  border-radius: 10px;
  background: #FAFAFA;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.mini-day-card.has-meals {
  background: linear-gradient(135deg, #FFFBF8, #FFF0E8);
  border-color: #FFE4D6;
}

.mini-day-card.is-today {
  border-color: #FF6B35;
  background: linear-gradient(135deg, #FFFBF8, #FFE4D6);
}

.mini-day-label {
  font-size: 13px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 2px;
}

.mini-day-date {
  font-size: 11px;
  color: #757575;
  margin-bottom: 8px;
}

.mini-meals-indicator {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 6px;
}

.meal-dot {
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 4px;
  background: #F0F0F0;
  color: #BDBDBD;
  font-weight: 500;
}

.meal-dot.active {
  background: #FF6B35;
  color: white;
}

.mini-time {
  font-size: 11px;
  color: #FF6B35;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-weight: 600;
}

.mini-empty {
  font-size: 11px;
  color: #BDBDBD;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
  font-size: 13px;
  color: #757575;
}

.total-meals, .total-time {
  font-weight: 500;
}

.total-time {
  color: #FF6B35;
}

.week-plan-empty {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px dashed transparent;
}

.week-plan-empty:hover {
  border-color: #FF6B35;
  background: #FFFBF8;
}

.empty-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.empty-text {
  flex: 1;
}

.empty-text h4 {
  font-size: 16px;
  color: #3D3D3D;
  margin: 0 0 4px 0;
}

.empty-text p {
  font-size: 13px;
  color: #757575;
  margin: 0;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.empty-state {
  padding: 60px 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

@media (max-width: 992px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .week-mini-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 600px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .week-mini-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .week-plan-empty {
    flex-direction: column;
    text-align: center;
  }

  .preview-footer {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .fridge-recommend-grid {
    grid-template-columns: 1fr;
  }
}

.fridge-recommend-section {
  background: linear-gradient(135deg, #FFF7E6, #FFF0E8);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #FFE4D6;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #3D3D3D;
}

.fridge-recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.fridge-recommend-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
}

.fridge-recommend-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
  border-color: #FF6B35;
}

.card-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #FF6B35, #FF8C42);
  color: white;
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 0 12px 0 12px;
  font-weight: 600;
}

.fridge-recommend-card .card-emoji {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 12px;
}

.fridge-recommend-card .card-name {
  font-size: 16px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 6px;
}

.fridge-recommend-card .card-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-match-info {
  border-top: 1px dashed #F0F0F0;
  padding-top: 12px;
}

.match-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #E6A23C;
  font-weight: 500;
  margin-bottom: 8px;
}

.match-ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

@media (max-width: 992px) {
  .fridge-recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .fridge-recommend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
