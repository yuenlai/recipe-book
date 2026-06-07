<template>
  <div class="fat-loss-plan-page">
    <div class="page-header">
      <div class="header-left">
        <h1>减脂饮食计划 🥗</h1>
        <p>7天低油低卡菜谱安排，科学搭配，健康减脂</p>
      </div>
      <div class="header-actions">
        <el-button type="success" @click="handleAddWeekToShoppingList">
          <el-icon><ShoppingCart /></el-icon>
          生成一周购物清单
        </el-button>
        <el-button type="danger" plain @click="handleResetProgress">
          <el-icon><RefreshRight /></el-icon>
          重置进度
        </el-button>
      </div>
    </div>

    <div class="overview-cards">
      <div class="overview-card calories-card">
        <div class="card-icon">🔥</div>
        <div class="card-content">
          <div class="card-label">每日目标热量</div>
          <div class="card-value">{{ nutrientGoals.dailyCalories }} <span class="unit">kcal</span></div>
          <div class="card-sub">周平均 {{ weekNutrition.average.calories }} kcal</div>
        </div>
      </div>

      <div class="overview-card protein-card">
        <div class="card-icon">💪</div>
        <div class="card-content">
          <div class="card-label">每日蛋白质</div>
          <div class="card-value">{{ nutrientGoals.protein }} <span class="unit">g</span></div>
          <div class="card-sub">周平均 {{ weekNutrition.average.protein }} g</div>
        </div>
      </div>

      <div class="overview-card carbs-card">
        <div class="card-icon">🌾</div>
        <div class="card-content">
          <div class="card-label">每日碳水</div>
          <div class="card-value">{{ nutrientGoals.carbs }} <span class="unit">g</span></div>
          <div class="card-sub">周平均 {{ weekNutrition.average.carbs }} g</div>
        </div>
      </div>

      <div class="overview-card fat-card">
        <div class="card-icon">🥑</div>
        <div class="card-content">
          <div class="card-label">每日脂肪</div>
          <div class="card-value">{{ nutrientGoals.fat }} <span class="unit">g</span></div>
          <div class="card-sub">周平均 {{ weekNutrition.average.fat }} g</div>
        </div>
      </div>

      <div class="overview-card progress-card">
        <div class="card-icon">📊</div>
        <div class="card-content">
          <div class="card-label">本周进度</div>
          <div class="card-value">{{ stats.progress }} <span class="unit">%</span></div>
          <div class="card-sub">已完成 {{ stats.completedDays }}/{{ stats.totalDays }} 天</div>
        </div>
        <el-progress 
          type="dashboard" 
          :percentage="stats.progress" 
          :width="80" 
          :stroke-width="10"
          color="#4CAF50"
        />
      </div>
    </div>

    <div class="tips-section">
      <div class="section-title">
        <el-icon><Tip /></el-icon>
        <span>减脂小贴士</span>
      </div>
      <div class="tips-grid">
        <div 
          v-for="(tip, index) in fatLossTips" 
          :key="index" 
          class="tip-item"
        >
          <span class="tip-number">{{ index + 1 }}</span>
          <span class="tip-text">{{ tip }}</span>
        </div>
      </div>
    </div>

    <div class="week-tabs">
      <el-tabs v-model="activeDay" class="day-tabs" stretch>
        <el-tab-pane 
          v-for="day in weekPlan" 
          :key="day.day" 
          :label="day.label" 
          :name="String(day.day)"
        >
          <template #label>
            <div class="tab-label" :class="{ 'is-completed': day.isCompleted }">
              <span class="tab-check" v-if="day.isCompleted">✓</span>
              <span>{{ day.label }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div v-if="currentDay" class="day-detail">
      <div class="day-header">
        <div class="day-info">
          <h2>
            {{ currentDay.label }} - {{ currentDay.theme }}
            <el-tag 
              v-if="currentDay.isCompleted" 
              type="success" 
              effect="light"
              size="small"
            >
              已完成
            </el-tag>
            <el-tag 
              v-else 
              type="warning" 
              effect="light"
              size="small"
            >
              进行中
            </el-tag>
          </h2>
          <p>{{ currentDay.description }}</p>
        </div>
        <div class="day-actions">
          <el-button 
            :type="currentDay.isCompleted ? 'info' : 'success'" 
            @click="toggleDayComplete(currentDay.day)"
          >
            <el-icon v-if="currentDay.isCompleted"><Close /></el-icon>
            <el-icon v-else><Check /></el-icon>
            {{ currentDay.isCompleted ? '取消完成' : '标记完成' }}
          </el-button>
          <el-button type="primary" @click="handleAddDayToShoppingList(currentDay)">
            <el-icon><ShoppingCart /></el-icon>
            加入购物清单
          </el-button>
        </div>
      </div>

      <div class="day-nutrition-summary">
        <div class="nutrition-card">
          <div class="nutrition-value">{{ currentDay.nutrition.calories }}</div>
          <div class="nutrition-label">总热量 (kcal)</div>
        </div>
        <div class="nutrition-card">
          <div class="nutrition-value">{{ currentDay.nutrition.protein }}g</div>
          <div class="nutrition-label">蛋白质</div>
        </div>
        <div class="nutrition-card">
          <div class="nutrition-value">{{ currentDay.nutrition.carbs }}g</div>
          <div class="nutrition-label">碳水化合物</div>
        </div>
        <div class="nutrition-card">
          <div class="nutrition-value">{{ currentDay.nutrition.fat }}g</div>
          <div class="nutrition-label">脂肪</div>
        </div>
        <div class="nutrition-card highlight">
          <div class="nutrition-value">{{ currentDay.nutrition.totalTime }}</div>
          <div class="nutrition-label">总耗时 (分钟)</div>
        </div>
        <div class="nutrition-card">
          <div class="nutrition-value">{{ currentDay.nutrition.recipeCount }}</div>
          <div class="nutrition-label">菜品数量</div>
        </div>
      </div>

      <div class="recommended-pairing">
        <el-icon><Star /></el-icon>
        <span class="pairing-title">今日推荐搭配：</span>
        <span class="pairing-text">{{ currentDay.recommendedPairing }}</span>
      </div>

      <div class="meal-sections">
        <div class="meal-section">
          <div class="meal-header breakfast">
            <el-icon><Sunrise /></el-icon>
            <h3>早餐</h3>
            <span class="meal-time">{{ calculateMealTime(currentDay.breakfastRecipes) }}分钟</span>
          </div>
          <div class="recipes-grid">
            <div 
              v-for="recipe in currentDay.breakfastRecipes" 
              :key="recipe.id" 
              class="recipe-card"
              @click="goToRecipe(recipe.id)"
            >
              <div class="recipe-emoji" :style="{ backgroundColor: recipe.coverColor + '20' }">
                {{ recipe.emoji }}
              </div>
              <div class="recipe-content">
                <div class="recipe-name">{{ recipe.name }}</div>
                <div class="recipe-meta">
                  <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                    {{ recipe.difficulty }}
                  </el-tag>
                  <span class="calories">{{ recipe.calories }} kcal</span>
                </div>
                <div class="recipe-nutrition">
                  <span>蛋白 {{ recipe.protein }}g</span>
                  <span>碳水 {{ recipe.carbs }}g</span>
                  <span>脂肪 {{ recipe.fat }}g</span>
                </div>
              </div>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <div class="meal-section">
          <div class="meal-header lunch">
            <el-icon><Sunny /></el-icon>
            <h3>午餐</h3>
            <span class="meal-time">{{ calculateMealTime(currentDay.lunchRecipes) }}分钟</span>
          </div>
          <div class="recipes-grid">
            <div 
              v-for="recipe in currentDay.lunchRecipes" 
              :key="recipe.id" 
              class="recipe-card"
              @click="goToRecipe(recipe.id)"
            >
              <div class="recipe-emoji" :style="{ backgroundColor: recipe.coverColor + '20' }">
                {{ recipe.emoji }}
              </div>
              <div class="recipe-content">
                <div class="recipe-name">{{ recipe.name }}</div>
                <div class="recipe-meta">
                  <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                    {{ recipe.difficulty }}
                  </el-tag>
                  <span class="calories">{{ recipe.calories }} kcal</span>
                </div>
                <div class="recipe-nutrition">
                  <span>蛋白 {{ recipe.protein }}g</span>
                  <span>碳水 {{ recipe.carbs }}g</span>
                  <span>脂肪 {{ recipe.fat }}g</span>
                </div>
              </div>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <div class="meal-section">
          <div class="meal-header dinner">
            <el-icon><Moon /></el-icon>
            <h3>晚餐</h3>
            <span class="meal-time">{{ calculateMealTime(currentDay.dinnerRecipes) }}分钟</span>
          </div>
          <div class="recipes-grid">
            <div 
              v-for="recipe in currentDay.dinnerRecipes" 
              :key="recipe.id" 
              class="recipe-card"
              @click="goToRecipe(recipe.id)"
            >
              <div class="recipe-emoji" :style="{ backgroundColor: recipe.coverColor + '20' }">
                {{ recipe.emoji }}
              </div>
              <div class="recipe-content">
                <div class="recipe-name">{{ recipe.name }}</div>
                <div class="recipe-meta">
                  <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                    {{ recipe.difficulty }}
                  </el-tag>
                  <span class="calories">{{ recipe.calories }} kcal</span>
                </div>
                <div class="recipe-nutrition">
                  <span>蛋白 {{ recipe.protein }}g</span>
                  <span>碳水 {{ recipe.carbs }}g</span>
                  <span>脂肪 {{ recipe.fat }}g</span>
                </div>
              </div>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <div class="meal-section">
          <div class="meal-header snack">
            <el-icon><Apple /></el-icon>
            <h3>加餐</h3>
            <span class="meal-time">{{ calculateMealTime(currentDay.snackRecipes) }}分钟</span>
          </div>
          <div class="recipes-grid">
            <div 
              v-for="recipe in currentDay.snackRecipes" 
              :key="recipe.id" 
              class="recipe-card"
              @click="goToRecipe(recipe.id)"
            >
              <div class="recipe-emoji" :style="{ backgroundColor: recipe.coverColor + '20' }">
                {{ recipe.emoji }}
              </div>
              <div class="recipe-content">
                <div class="recipe-name">{{ recipe.name }}</div>
                <div class="recipe-meta">
                  <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                    {{ recipe.difficulty }}
                  </el-tag>
                  <span class="calories">{{ recipe.calories }} kcal</span>
                </div>
                <div class="recipe-nutrition">
                  <span>蛋白 {{ recipe.protein }}g</span>
                  <span>碳水 {{ recipe.carbs }}g</span>
                  <span>脂肪 {{ recipe.fat }}g</span>
                </div>
              </div>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="day-tips">
        <div class="section-title">
          <el-icon><Bulb /></el-icon>
          <span>今日小贴士</span>
        </div>
        <div class="tips-list">
          <div v-for="(tip, index) in currentDay.tips" :key="index" class="tip-row">
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ tip }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-dialog 
      v-model="showResetDialog" 
      title="重置减脂进度" 
      width="400px"
    >
      <p>确定要重置所有减脂进度吗？此操作不可恢复。</p>
      <template #footer>
        <el-button @click="showResetDialog = false">取消</el-button>
        <el-button type="danger" @click="confirmReset">确定重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useRecipeStore()
const router = useRouter()

const activeDay = ref('1')
const showResetDialog = ref(false)

const {
  fatLossWeekPlan,
  fatLossWeekNutrition,
  fatLossStats,
  fatLossTips,
  fatLossNutrientGoals
} = storeToRefs(store)

const weekPlan = computed(() => fatLossWeekPlan.value)
const weekNutrition = computed(() => fatLossWeekNutrition.value)
const stats = computed(() => fatLossStats.value)
const nutrientGoals = computed(() => fatLossNutrientGoals.value)

const currentDay = computed(() => {
  const dayNum = Number(activeDay.value)
  return weekPlan.value.find(d => d.day === dayNum)
})

function getDifficultyType(difficulty) {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[difficulty] || 'info'
}

function calculateMealTime(recipes) {
  return recipes.reduce((sum, r) => sum + (r.prepTime || 0) + (r.cookTime || 0), 0)
}

function goToRecipe(recipeId) {
  router.push(`/recipe/${recipeId}`)
}

function toggleDayComplete(dayNumber) {
  store.toggleFatLossDayComplete(dayNumber)
  const day = weekPlan.value.find(d => d.day === dayNumber)
  if (day?.isCompleted) {
    ElMessage.success(`🎉 恭喜完成${day.label}的减脂计划！`)
  } else {
    ElMessage.info('已取消完成标记')
  }
}

function handleAddDayToShoppingList(dayPlan) {
  const recipeCount = dayPlan.breakfast.length + dayPlan.lunch.length + dayPlan.dinner.length + dayPlan.snack.length
  
  ElMessageBox.confirm(
    `检测到${dayPlan.label}有 ${recipeCount} 道菜，是否添加到购物清单？`,
    '添加到购物清单',
    {
      confirmButtonText: '添加并跳转',
      cancelButtonText: '仅添加',
      distinguishCancelAndClose: true,
      type: 'info'
    }
  ).then(() => {
    store.addFatLossDayToShoppingList(dayPlan)
    router.push('/shopping-list')
  }).catch(action => {
    if (action === 'cancel') {
      store.addFatLossDayToShoppingList(dayPlan)
      ElMessage.success(`已添加 ${recipeCount} 道菜到购物清单`)
    }
  })
}

function handleAddWeekToShoppingList() {
  const totalRecipes = weekPlan.value.reduce((sum, day) => 
    sum + day.breakfast.length + day.lunch.length + day.dinner.length + day.snack.length, 0
  )
  
  ElMessageBox.confirm(
    `检测到一周共有 ${totalRecipes} 道菜，是否全部添加到购物清单？`,
    '生成一周购物清单',
    {
      confirmButtonText: '添加并跳转',
      cancelButtonText: '仅添加',
      distinguishCancelAndClose: true,
      type: 'info'
    }
  ).then(() => {
    store.addFatLossWeekToShoppingList()
    router.push('/shopping-list')
  }).catch(action => {
    if (action === 'cancel') {
      store.addFatLossWeekToShoppingList()
      ElMessage.success(`已添加 ${totalRecipes} 道菜到购物清单`)
    }
  })
}

function handleResetProgress() {
  showResetDialog.value = true
}

function confirmReset() {
  store.resetFatLossProgress()
  showResetDialog.value = false
  ElMessage.success('减脂进度已重置')
}
</script>

<style scoped>
.fat-loss-plan-page {
  padding-bottom: 60px;
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

.overview-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.overview-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.overview-card.progress-card {
  justify-content: space-between;
}

.card-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 12px;
  color: #757575;
  margin-bottom: 4px;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #3D3D3D;
}

.card-value .unit {
  font-size: 14px;
  font-weight: 500;
  color: #757575;
}

.card-sub {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.calories-card {
  background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
}

.protein-card {
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
}

.carbs-card {
  background: linear-gradient(135deg, #F3E5F5, #E1BEE7);
}

.fat-card {
  background: linear-gradient(135deg, #FFFDE7, #FFF9C4);
}

.progress-card {
  background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
}

.tips-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 16px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #F5F5F5;
  border-radius: 12px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.tip-number {
  width: 20px;
  height: 20px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.week-tabs {
  background: white;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.day-tabs {
  padding: 0 20px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-label.is-completed {
  color: #4CAF50;
}

.tab-check {
  font-size: 12px;
}

.day-detail {
  background: white;
  border-radius: 0 0 16px 16px;
  padding: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #F0F0F0;
}

.day-info h2 {
  font-size: 22px;
  color: #3D3D3D;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.day-info p {
  color: #757575;
  font-size: 14px;
  margin: 0;
}

.day-actions {
  display: flex;
  gap: 12px;
}

.day-nutrition-summary {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.nutrition-card {
  text-align: center;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 12px;
}

.nutrition-card.highlight {
  background: linear-gradient(135deg, #FFF0E8, #FFE4D6);
}

.nutrition-value {
  font-size: 24px;
  font-weight: 700;
  color: #FF6B35;
  margin-bottom: 4px;
}

.nutrition-label {
  font-size: 12px;
  color: #757575;
}

.recommended-pairing {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #FFF8E1, #FFECB3);
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
}

.pairing-title {
  font-weight: 600;
  color: #F57C00;
}

.pairing-text {
  color: #E65100;
}

.meal-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.meal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid;
}

.meal-header.breakfast {
  border-color: #FF9800;
  color: #E65100;
}

.meal-header.lunch {
  border-color: #FF5722;
  color: #D84315;
}

.meal-header.dinner {
  border-color: #5C6BC0;
  color: #3949AB;
}

.meal-header.snack {
  border-color: #66BB6A;
  color: #388E3C;
}

.meal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.meal-time {
  margin-left: auto;
  font-size: 13px;
  font-weight: 500;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.recipe-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.recipe-card:hover {
  background: #F5F5F5;
  border-color: #FF6B35;
  transform: translateY(-2px);
}

.recipe-emoji {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.recipe-content {
  flex: 1;
  min-width: 0;
}

.recipe-name {
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 6px;
}

.recipe-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.calories {
  font-size: 12px;
  color: #FF6B35;
  font-weight: 500;
}

.recipe-nutrition {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: #999;
}

.arrow-icon {
  color: #BDBDBD;
  flex-shrink: 0;
}

.day-tips {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #F0F0F0;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F5F5F5;
  border-radius: 12px;
  font-size: 14px;
  color: #666;
}

.tip-row .el-icon {
  color: #4CAF50;
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .overview-cards {
    grid-template-columns: repeat(3, 1fr);
  }

  .tips-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .day-nutrition-summary {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .tips-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .day-nutrition-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .day-header {
    flex-direction: column;
    gap: 16px;
  }

  .day-actions {
    width: 100%;
  }

  .day-actions .el-button {
    flex: 1;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
