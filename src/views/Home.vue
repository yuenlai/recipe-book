<template>
  <div class="home-page">
    <transition name="toast">
      <div v-if="showRestoreToast" class="restore-toast" :class="{ 'is-restoring': isRestoring }">
        <el-icon :class="{ 'spin': isRestoring }"><RefreshRight /></el-icon>
        <span>{{ restoreToastText }}</span>
      </div>
    </transition>

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
      <div v-if="searchSuggestions.hasSuggestions" class="search-suggestions">
        <div class="empty-header">
          <div class="empty-icon">🔍</div>
          <h3>没有找到「{{ searchSuggestions.query }}」相关的食谱</h3>
          <p class="empty-subtitle">别着急，试试这些推荐吧～</p>
        </div>

        <div v-if="searchSuggestions.sameIngredient.length > 0" class="suggestion-section">
          <div class="section-header">
            <el-icon class="section-icon"><Food /></el-icon>
            <span class="section-title">相同主食材</span>
            <el-tag v-if="searchSuggestions.detectedIngredients.length > 0" size="small" type="success" effect="light">
              {{ searchSuggestions.detectedIngredients.join('、') }}
            </el-tag>
          </div>
          <div class="suggestion-cards">
            <div
              v-for="recipe in searchSuggestions.sameIngredient"
              :key="recipe.id"
              class="suggestion-card"
              @click="goToSuggestionRecipe(recipe.id)"
            >
              <div class="card-emoji" :style="{ backgroundColor: recipe.coverColor }">
                {{ recipe.emoji }}
              </div>
              <div class="card-info">
                <div class="card-name">{{ recipe.name }}</div>
                <div class="card-meta">
                  <span class="meta-tag">{{ recipe.category }}</span>
                  <span class="meta-time"><el-icon><Timer /></el-icon>{{ recipe.cookTime }}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="searchSuggestions.similarCuisine.length > 0" class="suggestion-section">
          <div class="section-header">
            <el-icon class="section-icon"><Place /></el-icon>
            <span class="section-title">相近菜系</span>
            <el-tag v-if="searchSuggestions.detectedCuisine" size="small" type="warning" effect="light">
              {{ searchSuggestions.detectedCuisine }}
            </el-tag>
          </div>
          <div class="suggestion-cards">
            <div
              v-for="recipe in searchSuggestions.similarCuisine"
              :key="recipe.id"
              class="suggestion-card"
              @click="goToSuggestionRecipe(recipe.id)"
            >
              <div class="card-emoji" :style="{ backgroundColor: recipe.coverColor }">
                {{ recipe.emoji }}
              </div>
              <div class="card-info">
                <div class="card-name">{{ recipe.name }}</div>
                <div class="card-meta">
                  <span class="meta-tag">{{ recipe.difficulty }}</span>
                  <span class="meta-time"><el-icon><Timer /></el-icon>{{ recipe.cookTime }}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="searchSuggestions.favoriteSimilar.length > 0" class="suggestion-section">
          <div class="section-header">
            <el-icon class="section-icon"><StarFilled /></el-icon>
            <span class="section-title">收藏里的相似菜谱</span>
            <el-tag size="small" type="danger" effect="light">我的收藏</el-tag>
          </div>
          <div class="suggestion-cards">
            <div
              v-for="recipe in searchSuggestions.favoriteSimilar"
              :key="recipe.id"
              class="suggestion-card"
              @click="goToSuggestionRecipe(recipe.id)"
            >
              <div class="card-emoji" :style="{ backgroundColor: recipe.coverColor }">
                {{ recipe.emoji }}
              </div>
              <div class="card-info">
                <div class="card-name">{{ recipe.name }}</div>
                <div class="card-meta">
                  <span class="meta-tag">{{ recipe.category }}</span>
                  <span class="meta-time"><el-icon><Timer /></el-icon>{{ recipe.cookTime }}分钟</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-actions">
          <el-button type="primary" @click="clearSearch">
            <el-icon><RefreshRight /></el-icon>
            清除搜索
          </el-button>
          <el-button @click="goToFavorites">
            <el-icon><Star /></el-icon>
            浏览收藏
          </el-button>
        </div>
      </div>

      <el-empty v-else description="没有找到匹配的食谱" />
    </div>

    <div v-else>
      <div class="recipe-grid">
        <RecipeCard
          v-for="recipe in paginatedRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <div v-if="totalPages > 1" class="pagination-wrapper" ref="paginationWrapper">
        <el-pagination
          ref="paginationRef"
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
import { computed, ref, onActivated, onDeactivated, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { RefreshRight, Food, Place, StarFilled, Star, Timer } from '@element-plus/icons-vue'
import { useRecipeStore } from '../stores/recipe'
import CategoryFilter from '../components/CategoryFilter.vue'
import RecipeCard from '../components/RecipeCard.vue'

defineOptions({
  name: 'Home'
})

const store = useRecipeStore()
const router = useRouter()

const paginationRef = ref(null)
const paginationWrapper = ref(null)

const showRestoreToast = ref(false)
const isRestoring = ref(false)
const restoreToastText = ref('')
const highlightPage = ref(false)
let toastTimer = null
let highlightTimer = null

const filteredRecipes = computed(() => store.filteredRecipes)
const searchSuggestions = computed(() => store.searchSuggestions)
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

function goToSuggestionRecipe(id) {
  store.setSearch('')
  store.setScrollPosition(window.scrollY)
  router.push(`/recipe/${id}`)
}

function clearSearch() {
  store.setSearch('')
  store.setCategory('全部')
}

function goToFavorites() {
  router.push('/favorites')
}

function saveScrollPosition() {
  store.setScrollPosition(window.scrollY)
}

function buildRestoreText(scrollPos, isComplete) {
  const category = store.selectedCategory
  const search = store.searchQuery
  const page = store.currentPage
  const parts = []

  if (category && category !== '全部') {
    parts.push(`「${category}」`)
  }
  if (search && search.trim()) {
    parts.push(`搜索「${search}」`)
  }
  if (scrollPos > 100) {
    parts.push('保持滚动位置')
  }

  const baseText = parts.length > 0 ? parts.join(' · ') : '浏览位置'
  const pageText = page > 1 ? ` · 第${page}页` : ''

  if (isComplete) {
    return `✓ 已恢复${pageText} · ${baseText}`
  } else {
    return `正在恢复${pageText}...`
  }
}

function highlightCurrentPage() {
  if (highlightTimer) {
    clearTimeout(highlightTimer)
  }

  highlightPage.value = true

  nextTick(() => {
    if (paginationWrapper.value) {
      const activePageEl = paginationWrapper.value.querySelector('.el-pager .is-active')
      if (activePageEl) {
        activePageEl.classList.add('page-highlight')
        highlightTimer = setTimeout(() => {
          activePageEl.classList.remove('page-highlight')
          highlightPage.value = false
        }, 2500)
      }
    }
  })
}

function waitForDOMReady() {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve()
    }, 100)
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          clearTimeout(timeout)
          resolve()
        })
      })
    })
  })
}

async function restoreScrollPosition() {
  const scrollPos = store.homeScrollPosition || 0
  const hasCategory = store.selectedCategory && store.selectedCategory !== '全部'
  const hasSearch = store.searchQuery && store.searchQuery.trim()
  const hasPage = store.currentPage > 1
  const hasScroll = scrollPos > 50
  const needsRestore = hasCategory || hasSearch || hasPage || hasScroll

  if (!needsRestore) {
    return
  }

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  isRestoring.value = true
  restoreToastText.value = buildRestoreText(scrollPos, false)
  showRestoreToast.value = true

  await waitForDOMReady()

  const actualScrollPos = scrollPos
  const useSmooth = actualScrollPos > 50

  window.scrollTo({
    top: actualScrollPos,
    behavior: useSmooth ? 'smooth' : 'auto'
  })

  if (useSmooth) {
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  await waitForDOMReady()

  isRestoring.value = false
  restoreToastText.value = buildRestoreText(actualScrollPos, true)

  highlightCurrentPage()

  toastTimer = setTimeout(() => {
    showRestoreToast.value = false
  }, 4000)
}

onMounted(() => {
  nextTick(() => {
    restoreScrollPosition()
  })
})

onActivated(() => {
  nextTick(() => {
    restoreScrollPosition()
  })
})

onDeactivated(() => {
  saveScrollPosition()
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  if (highlightTimer) {
    clearTimeout(highlightTimer)
  }
})
</script>

<style scoped>
.home-page {
  padding-bottom: 40px;
  position: relative;
}

.restore-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #67C23A, #85CE61);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(103, 194, 58, 0.4);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.restore-toast.is-restoring {
  background: linear-gradient(135deg, #E6A23C, #EEBE77);
  box-shadow: 0 4px 20px rgba(230, 162, 60, 0.4);
}

.restore-toast .el-icon {
  font-size: 18px;
}

.restore-toast .el-icon.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

:deep(.el-pager .is-active.page-highlight) {
  animation: pagePulse 0.6s ease-in-out 3;
  background: linear-gradient(135deg, #FF6B35, #FF8C42) !important;
  color: white !important;
  transform: scale(1.15);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.5);
}

@keyframes pagePulse {
  0%, 100% {
    transform: scale(1.15);
  }
  50% {
    transform: scale(1.25);
  }
}

.pagination-wrapper {
  position: relative;
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

.search-suggestions {
  padding: 20px 0;
}

.empty-header {
  text-align: center;
  margin-bottom: 32px;
}

.empty-header .empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-header h3 {
  font-size: 20px;
  color: #3D3D3D;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.empty-header .empty-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.suggestion-section {
  margin-bottom: 32px;
}

.suggestion-section .section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.suggestion-section .section-icon {
  font-size: 20px;
  color: #FF6B35;
}

.suggestion-section .section-title {
  font-size: 16px;
  font-weight: 600;
  color: #3D3D3D;
}

.suggestion-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.suggestion-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 12px;
}

.suggestion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
  border-color: #FF6B35;
}

.suggestion-card .card-emoji {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.suggestion-card .card-info {
  flex: 1;
  min-width: 0;
}

.suggestion-card .card-name {
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-card .card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #999;
}

.suggestion-card .meta-tag {
  background: #F5F5F5;
  padding: 2px 6px;
  border-radius: 4px;
}

.suggestion-card .meta-time {
  display: flex;
  align-items: center;
  gap: 2px;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

@media (max-width: 992px) {
  .suggestion-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .suggestion-cards {
    grid-template-columns: 1fr;
  }

  .empty-header h3 {
    font-size: 16px;
  }

  .empty-actions {
    flex-direction: column;
  }

  .empty-actions .el-button {
    width: 100%;
  }
}
</style>
