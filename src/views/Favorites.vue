<template>
  <div class="favorites-page">
    <div class="page-header">
      <h1>我的收藏 ⭐</h1>
      <p v-if="favoriteRecipes.length > 0">共收藏了 {{ favoriteRecipes.length }} 个食谱</p>
    </div>

    <div v-if="favoriteRecipes.length === 0" class="empty-state">
      <el-empty description="还没有收藏的食谱">
        <el-button type="primary" @click="goHome">去发现美食</el-button>
      </el-empty>
    </div>

    <div v-else>
      <div class="filter-section">
        <div class="filter-row">
          <div class="quick-filter">
            <el-button
              :type="todayOnly ? 'warning' : 'default'"
              :effect="todayOnly ? 'dark' : 'light'"
              @click="toggleTodayOnly"
              class="today-btn"
            >
              <el-icon><Sunny /></el-icon>
              {{ todayOnly ? '显示全部' : '今天做什么？' }}
            </el-button>
            <el-button
              v-if="hasActiveFilters"
              text
              @click="clearAllFilters"
              class="clear-btn"
            >
              清除筛选
            </el-button>
          </div>
        </div>

        <div class="filter-groups">
          <div class="filter-group">
            <span class="filter-label">
              <el-icon><Food /></el-icon>
              菜系
            </span>
            <div class="filter-options">
              <button
                v-for="cat in categoryOptions"
                :key="cat.value"
                :class="['filter-chip', { active: selectedCategory === cat.value }]"
                @click="selectedCategory = cat.value"
              >
                <span v-if="cat.emoji">{{ cat.emoji }}</span>
                {{ cat.label }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <span class="filter-label">
              <el-icon><TrendCharts /></el-icon>
              难度
            </span>
            <div class="filter-options">
              <button
                v-for="diff in difficultyOptions"
                :key="diff.value"
                :class="['filter-chip', { active: selectedDifficulty === diff.value }]"
                @click="selectedDifficulty = diff.value"
              >
                {{ diff.label }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <span class="filter-label">
              <el-icon><Timer /></el-icon>
              总耗时
            </span>
            <div class="filter-options">
              <button
                v-for="time in timeOptions"
                :key="time.value"
                :class="['filter-chip', { active: selectedTime === time.value }]"
                @click="selectedTime = time.value"
              >
                {{ time.label }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredRecipes.length > 0" class="result-info">
          为你找到 <strong>{{ filteredRecipes.length }}</strong> 个符合条件的食谱
          <span v-if="todayOnly" class="today-hint">（今天做推荐：简单 + 30分钟内搞定）</span>
        </div>
      </div>

      <div v-if="filteredRecipes.length === 0" class="empty-state">
        <el-empty description="没有符合筛选条件的食谱">
          <el-button type="primary" @click="clearAllFilters">清除筛选条件</el-button>
        </el-empty>
      </div>

      <div v-else class="recipe-grid">
        <RecipeCard
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import RecipeCard from '../components/RecipeCard.vue'
import { Sunny, Food, TrendCharts, Timer } from '@element-plus/icons-vue'

const router = useRouter()
const store = useRecipeStore()

const favoriteRecipes = computed(() => store.favoriteRecipes)

const selectedCategory = ref('all')
const selectedDifficulty = ref('all')
const selectedTime = ref('all')
const todayOnly = ref(false)

const categoryOptions = [
  { value: 'all', label: '全部', emoji: '🍽️' },
  { value: '中餐', label: '中餐', emoji: '🥢' },
  { value: '西餐', label: '西餐', emoji: '🍝' },
  { value: '甜点', label: '甜点', emoji: '🍰' },
  { value: '饮品', label: '饮品', emoji: '🥤' },
  { value: '小吃', label: '小吃', emoji: '🥟' }
]

const difficultyOptions = [
  { value: 'all', label: '全部' },
  { value: '简单', label: '简单' },
  { value: '中等', label: '中等' },
  { value: '困难', label: '困难' }
]

const timeOptions = [
  { value: 'all', label: '全部' },
  { value: 'fast', label: '快速 <30min' },
  { value: 'medium', label: '适中 30-60min' },
  { value: 'slow', label: '慢工 >60min' }
]

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== 'all' ||
         selectedDifficulty.value !== 'all' ||
         selectedTime.value !== 'all' ||
         todayOnly.value
})

const filteredRecipes = computed(() => {
  let result = favoriteRecipes.value

  if (todayOnly.value) {
    result = result.filter(r => {
      const totalTime = r.prepTime + r.cookTime
      return r.difficulty === '简单' && totalTime <= 30
    })
  } else {
    if (selectedCategory.value !== 'all') {
      result = result.filter(r => r.category === selectedCategory.value)
    }

    if (selectedDifficulty.value !== 'all') {
      result = result.filter(r => r.difficulty === selectedDifficulty.value)
    }

    if (selectedTime.value !== 'all') {
      result = result.filter(r => {
        const totalTime = r.prepTime + r.cookTime
        switch (selectedTime.value) {
          case 'fast': return totalTime < 30
          case 'medium': return totalTime >= 30 && totalTime <= 60
          case 'slow': return totalTime > 60
          default: return true
        }
      })
    }
  }

  return result
})

function toggleTodayOnly() {
  todayOnly.value = !todayOnly.value
  if (todayOnly.value) {
    selectedCategory.value = 'all'
    selectedDifficulty.value = 'all'
    selectedTime.value = 'all'
  }
}

function clearAllFilters() {
  selectedCategory.value = 'all'
  selectedDifficulty.value = 'all'
  selectedTime.value = 'all'
  todayOnly.value = false
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.favorites-page {
  padding-bottom: 40px;
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

.filter-section {
  background: linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.quick-filter {
  display: flex;
  align-items: center;
  gap: 12px;
}

.today-btn {
  height: 44px;
  padding: 0 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 22px;
}

.today-btn .el-icon {
  margin-right: 6px;
}

.clear-btn {
  font-size: 14px;
  color: #909399;
}

.filter-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  min-width: 70px;
}

.filter-label .el-icon {
  color: #FF6B35;
}

.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border: 2px solid #E8E8E8;
  border-radius: 20px;
  background: white;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.filter-chip:hover {
  border-color: #FFB088;
  color: #FF6B35;
  background: #FFF5EE;
  transform: translateY(-1px);
}

.filter-chip.active {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
  border-color: #FF6B35;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.35);
  transform: translateY(-1px);
}

.result-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #FFD7C2;
  font-size: 14px;
  color: #606266;
}

.result-info strong {
  color: #FF6B35;
  font-size: 16px;
  margin: 0 4px;
}

.today-hint {
  color: #E6A23C;
  font-size: 13px;
  margin-left: 8px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.empty-state {
  padding: 80px 0;
}

@media (max-width: 992px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .filter-section {
    padding: 16px;
  }

  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .quick-filter {
    width: 100%;
  }

  .today-btn {
    flex: 1;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-label {
    min-width: auto;
  }
}

@media (max-width: 600px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 24px;
  }
}
</style>
