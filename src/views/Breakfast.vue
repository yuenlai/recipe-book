<template>
  <div class="breakfast-page">
    <div class="page-header">
      <h1>早餐专区 🌅</h1>
      <p>起床后还有多少时间？快速选一份早餐开始制作吧</p>
    </div>

    <div class="time-filter-section">
      <div class="filter-title">
        <el-icon><Timer /></el-icon>
        <span>起床后可用时间</span>
      </div>
      <div class="time-categories">
        <div
          v-for="cat in timeCategories"
          :key="cat.key"
          class="time-category-card"
          :class="{ active: selectedTime === cat.key }"
          @click="selectTimeCategory(cat.key)"
        >
          <div class="cat-emoji">{{ cat.emoji }}</div>
          <div class="cat-label">{{ cat.label }}</div>
          <div class="cat-desc">{{ cat.description }}</div>
          <div class="cat-count">{{ getRecipeCount(cat.key) }} 道菜</div>
        </div>
      </div>
    </div>

    <div v-if="selectedTime" class="recipes-section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-emoji">{{ getCategoryEmoji(selectedTime) }}</span>
          <span>{{ selectedTime }}分钟早餐</span>
          <el-tag size="small" type="primary" effect="light">
            共 {{ filteredRecipes.length }} 道菜
          </el-tag>
        </div>
        <div class="section-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>点击"开始计时"，将自动为每个步骤创建计时器</span>
        </div>
      </div>

      <div v-if="filteredRecipes.length === 0" class="empty-state">
        <el-empty description="暂无该分类的早餐食谱" />
      </div>

      <div v-else class="recipe-grid">
        <div
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          class="breakfast-recipe-card"
        >
          <div class="card-header" :style="{ backgroundColor: recipe.coverColor + '20' }">
            <div class="card-emoji" :style="{ backgroundColor: recipe.coverColor }">
              {{ recipe.emoji }}
            </div>
            <div class="card-badge-time">
              <el-icon><Timer /></el-icon>
              {{ recipe.totalTime }}分钟
            </div>
            <FavoriteButton :recipeId="recipe.id" class="card-favorite" @click.stop />
          </div>

          <div class="card-body">
            <h3 class="card-title">{{ recipe.name }}</h3>
            <p class="card-desc">{{ recipe.description }}</p>

            <div class="card-meta">
              <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                {{ recipe.difficulty }}
              </el-tag>
              <span class="meta-servings">
                <el-icon><User /></el-icon>
                {{ recipe.servings }}人份
              </span>
              <span class="meta-steps">
                <el-icon><List /></el-icon>
                {{ recipe.steps.length }}步
              </span>
            </div>

            <div class="card-tags">
              <el-tag
                v-for="tag in recipe.tags.slice(0, 3)"
                :key="tag"
                size="small"
                type="info"
                effect="light"
                round
              >
                {{ tag }}
              </el-tag>
            </div>

            <div class="card-ingredients-preview">
              <span class="ingredients-label">食材：</span>
              <span class="ingredients-list">
                {{ recipe.ingredients.slice(0, 4).map(i => i.name).join('、') }}
                <span v-if="recipe.ingredients.length > 4">等</span>
              </span>
            </div>

            <div class="card-actions">
              <el-button
                type="primary"
                size="small"
                @click="goToDetail(recipe.id)"
              >
                <el-icon><Reading /></el-icon>
                查看详情
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="startCooking(recipe)"
              >
                <el-icon><VideoPlay /></el-icon>
                开始计时
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="select-prompt">
      <div class="prompt-icon">👆</div>
      <div class="prompt-text">
        <h3>选择你起床后可用的时间</h3>
        <p>我们将为你推荐合适的早餐食谱</p>
      </div>
    </div>

    <el-dialog
      v-model="showStartConfirm"
      title="开始制作"
      width="420px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedRecipe" class="confirm-content">
        <div class="confirm-recipe">
          <div class="confirm-emoji" :style="{ backgroundColor: selectedRecipe.coverColor }">
            {{ selectedRecipe.emoji }}
          </div>
          <div class="confirm-info">
            <h4>{{ selectedRecipe.name }}</h4>
            <p>预计总时长：{{ selectedRecipe.totalTime }} 分钟</p>
            <p>共 {{ selectedRecipe.steps.length }} 个步骤</p>
          </div>
        </div>

        <div class="confirm-steps">
          <div class="steps-title">
            <el-icon><List /></el-icon>
            <span>将为以下步骤创建计时器：</span>
          </div>
          <div class="steps-list">
            <div
              v-for="(step, index) in selectedRecipe.steps"
              :key="step.order"
              class="step-item"
            >
              <span class="step-order">{{ step.order }}</span>
              <span class="step-desc">{{ step.description }}</span>
              <span class="step-time">
                <el-icon><Timer /></el-icon>
                {{ formatDuration(step.duration || extractDuration(step.description)) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showStartConfirm = false">取消</el-button>
        <el-button type="primary" @click="confirmStartCooking">
          <el-icon><VideoPlay /></el-icon>
          确认开始
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'
import FavoriteButton from '../components/FavoriteButton.vue'
import { Timer, InfoFilled, User, List, Reading, VideoPlay } from '@element-plus/icons-vue'
import {
  BREAKFAST_TIME_CATEGORIES,
  getBreakfastRecipesByTime,
  getBreakfastRecipeById,
  getAllBreakfastRecipes
} from '../data/breakfastRecipes'

const router = useRouter()
const store = useRecipeStore()

const selectedTime = ref(null)
const showStartConfirm = ref(false)
const selectedRecipe = ref(null)

const timeCategories = BREAKFAST_TIME_CATEGORIES

const filteredRecipes = computed(() => {
  if (!selectedTime.value) return []
  return getBreakfastRecipesByTime(selectedTime.value)
})

function getRecipeCount(timeCategory) {
  return getBreakfastRecipesByTime(timeCategory).length
}

function getCategoryEmoji(timeCategory) {
  const cat = timeCategories.find(c => c.key === timeCategory)
  return cat ? cat.emoji : '🍽️'
}

function getDifficultyType(difficulty) {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[difficulty] || 'info'
}

function extractDuration(description) {
  if (!description) return 180

  const hourMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:小时|钟头|h|H)/)
  if (hourMatch) {
    return Math.round(parseFloat(hourMatch[1]) * 3600)
  }

  const minuteRangeMatch = description.match(/(\d+(?:\.\d+)?)\s*[-~至]\s*(\d+(?:\.\d+)?)\s*(?:分钟|分|min|MIN)/)
  if (minuteRangeMatch) {
    const min = parseFloat(minuteRangeMatch[1])
    const max = parseFloat(minuteRangeMatch[2])
    return Math.round(((min + max) / 2) * 60)
  }

  const minuteMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:分钟|分|min|MIN)/)
  if (minuteMatch) {
    return Math.round(parseFloat(minuteMatch[1]) * 60)
  }

  const secondRangeMatch = description.match(/(\d+(?:\.\d+)?)\s*[-~至]\s*(\d+(?:\.\d+)?)\s*(?:秒|sec|SEC)/)
  if (secondRangeMatch) {
    const min = parseFloat(secondRangeMatch[1])
    const max = parseFloat(secondRangeMatch[2])
    return Math.round((min + max) / 2)
  }

  const secondMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:秒|sec|SEC)/)
  if (secondMatch) {
    return Math.round(parseFloat(secondMatch[1]))
  }

  if (/腌制|腌|静置|醒面|冷藏|浸泡|泡/.test(description)) {
    return 900
  }
  if (/炖煮|炖|煮|焖|蒸|煲/.test(description)) {
    return 1200
  }
  if (/翻炒|炒|煎|炸|爆/.test(description)) {
    return 180
  }
  if (/切|剁|准备|处理|洗|摘/.test(description)) {
    return 300
  }
  if (/调味|调料|汁|酱/.test(description)) {
    return 120
  }
  if (/勾芡|收汁|出锅|装盘|撒/.test(description)) {
    return 60
  }

  return 180
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins > 0 && secs > 0) {
    return `${mins}分${secs}秒`
  } else if (mins > 0) {
    return `${mins}分钟`
  } else {
    return `${secs}秒`
  }
}

function selectTimeCategory(time) {
  selectedTime.value = time
  window.scrollTo({ top: 400, behavior: 'smooth' })
}

function goToDetail(recipeId) {
  const recipe = getBreakfastRecipeById(recipeId)
  if (recipe) {
    router.push({
      path: `/recipe/${recipeId}`,
      query: { from: 'breakfast' }
    })
  }
}

function startCooking(recipe) {
  selectedRecipe.value = recipe
  showStartConfirm.value = true
}

function confirmStartCooking() {
  if (!selectedRecipe.value) return

  const recipe = selectedRecipe.value

  recipe.steps.forEach((step, index) => {
    const duration = step.duration || extractDuration(step.description + ' ' + (step.tip || ''))
    store.addTimer({
      label: `步骤${step.order}：${step.description.slice(0, 15)}${step.description.length > 15 ? '...' : ''}`,
      duration: duration,
      remaining: duration,
      recipeId: recipe.id,
      recipeName: recipe.name,
      stepOrder: step.order
    })
  })

  showStartConfirm.value = false
  selectedRecipe.value = null

  ElMessage.success(`已为"${recipe.name}"创建 ${recipe.steps.length} 个计时器`)

  router.push('/timers')
}
</script>

<style scoped>
.breakfast-page {
  padding-bottom: 60px;
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

.time-filter-section {
  background: linear-gradient(135deg, #FFF7E6, #FFF0E8);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #FFE4D6;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 20px;
}

.time-categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.time-category-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.time-category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
}

.time-category-card.active {
  border-color: #FF6B35;
  background: linear-gradient(135deg, #FFFBF8, #FFE4D6);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.2);
}

.cat-emoji {
  font-size: 48px;
  margin-bottom: 12px;
}

.cat-label {
  font-size: 24px;
  font-weight: 700;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.cat-desc {
  font-size: 13px;
  color: #757575;
  margin-bottom: 12px;
}

.cat-count {
  display: inline-block;
  background: #FF6B35;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}

.recipes-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #3D3D3D;
}

.title-emoji {
  font-size: 24px;
}

.section-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #67C23A;
  background: #F0F9EB;
  padding: 6px 12px;
  border-radius: 8px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.breakfast-recipe-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.breakfast-recipe-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: #FFE4D6;
}

.card-header {
  padding: 20px;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-emoji {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.card-badge-time {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #FF6B35;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
}

.card-favorite {
  position: absolute;
  top: 10px;
  right: 10px;
}

.card-body {
  padding: 16px 20px 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 13px;
  color: #757575;
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-servings,
.meta-steps {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #757575;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.card-ingredients-preview {
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
  padding-top: 12px;
  border-top: 1px dashed #F0F0F0;
}

.ingredients-label {
  color: #757575;
  font-weight: 500;
}

.ingredients-list {
  color: #999;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-actions .el-button {
  flex: 1;
}

.select-prompt {
  background: white;
  border-radius: 16px;
  padding: 60px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.prompt-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.prompt-text h3 {
  font-size: 18px;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.prompt-text p {
  font-size: 14px;
  color: #757575;
}

.empty-state {
  padding: 60px 0;
}

.confirm-content {
  max-height: 400px;
  overflow-y: auto;
}

.confirm-recipe {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 12px;
  margin-bottom: 20px;
}

.confirm-emoji {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.confirm-info h4 {
  font-size: 16px;
  color: #3D3D3D;
  margin-bottom: 4px;
}

.confirm-info p {
  font-size: 13px;
  color: #757575;
  margin: 0;
}

.steps-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 12px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #F5F5F5;
  border-radius: 8px;
  font-size: 13px;
}

.step-order {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #FF6B35;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-desc {
  flex: 1;
  color: #3D3D3D;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.step-time {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #FF6B35;
  font-weight: 500;
  flex-shrink: 0;
}

@media (max-width: 992px) {
  .time-categories {
    grid-template-columns: 1fr;
  }

  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 24px;
  }

  .time-categories {
    grid-template-columns: 1fr;
  }

  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cat-emoji {
    font-size: 36px;
  }

  .cat-label {
    font-size: 20px;
  }
}
</style>
