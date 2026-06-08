<template>
  <div v-if="recipe" class="recipe-detail">
    <div class="detail-header" :style="{ backgroundColor: recipe.coverColor }">
      <el-button class="back-btn" circle @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
      <span class="detail-emoji">{{ recipe.emoji }}</span>
      <FavoriteButton :recipeId="recipe.id" class="detail-favorite" />
    </div>

    <div class="detail-content">
      <div class="detail-title-row">
        <h1>{{ recipe.name }}</h1>
        <el-tag size="large" :type="difficultyType">{{ recipe.difficulty }}</el-tag>
      </div>

      <p class="detail-description">{{ recipe.description }}</p>

      <div class="detail-stats">
        <div class="stat-item">
          <el-icon><Timer /></el-icon>
          <div>
            <span class="stat-value">{{ recipe.prepTime }}</span>
            <span class="stat-label">准备(分钟)</span>
          </div>
        </div>
        <div class="stat-item">
          <el-icon><Dish /></el-icon>
          <div>
            <span class="stat-value">{{ recipe.cookTime }}</span>
            <span class="stat-label">烹饪(分钟)</span>
          </div>
        </div>
        <div class="stat-item servings-item">
          <el-icon><User /></el-icon>
          <div class="servings-control">
            <span class="stat-label">用餐人数</span>
            <div class="servings-adjuster">
              <el-button circle size="small" @click="decreaseServings" :disabled="currentServings <= 1">
                <el-icon><Minus /></el-icon>
              </el-button>
              <span class="servings-value">{{ currentServings }}</span>
              <el-button circle size="small" @click="increaseServings" :disabled="currentServings >= 20">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
            <span class="servings-original" v-if="currentServings !== recipe.servings">
              (原配方 {{ recipe.servings }} 人份)
            </span>
          </div>
        </div>
        <div class="stat-item">
          <el-icon><Clock /></el-icon>
          <div>
            <span class="stat-value">{{ totalTime }}</span>
            <span class="stat-label">总计(分钟)</span>
          </div>
        </div>
      </div>

      <div class="detail-tags">
        <el-tag
          v-for="tag in recipe.tags"
          :key="tag"
          effect="plain"
          round
        >
          {{ tag }}
        </el-tag>
      </div>

      <IngredientList :ingredients="recipe.ingredients" :scale-ratio="scaleRatio" :original-servings="recipe.servings" :current-servings="currentServings" />
      <StepList :steps="recipe.steps" />

      <div class="detail-extra-actions">
        <div class="compare-info-section" v-if="compareCount > 0">
          <div class="compare-info-header">
            <span class="compare-count-label">
              <el-icon><DataLine /></el-icon>
              已选 {{ compareCount }}/6 道菜进行对比
            </span>
          </div>
          <div class="compare-recipe-list">
            <div
              v-for="r in compareRecipeObjects"
              :key="r.id"
              class="compare-recipe-item"
              :class="{ 'is-current': r.id === recipe.id }"
            >
              <span
                class="recipe-avatar"
                :style="{ backgroundColor: r.coverColor }"
              >
                {{ r.emoji }}
              </span>
              <div class="recipe-info">
                <span class="recipe-name">{{ r.name }}</span>
                <span class="recipe-meta">
                  {{ r.difficulty }} · {{ r.prepTime + r.cookTime }}分钟
                </span>
              </div>
              <el-tag
                v-if="r.id === recipe.id"
                type="warning"
                size="small"
                effect="dark"
              >当前</el-tag>
              <el-button
                circle
                size="small"
                type="danger"
                plain
                @click.stop="removeFromCompare(r.id)"
                class="remove-single-btn"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        <div class="compare-info-empty" v-else>
          <span class="empty-hint">
            <el-icon><DataLine /></el-icon>
            还没有选择对比的食谱，点击下方按钮开始对比
          </span>
        </div>
        <div class="compare-buttons">
          <el-button
            :type="isInCompare(recipe.id) ? 'warning' : 'info'"
            size="large"
            @click="toggleCompare"
            :disabled="!isInCompare(recipe.id) && compareCount >= 6"
            class="compare-main-btn"
          >
            <el-icon><component :is="isInCompare(recipe.id) ? 'Check' : 'Plus'" /></el-icon>
            {{ isInCompare(recipe.id) ? '✓ 已加入对比' : '＋ 加入对比' }}
          </el-button>
          <el-button
            type="primary"
            size="large"
            @click="goToCompare"
            v-if="compareCount > 0"
            class="view-compare-btn"
          >
            <el-icon><DataLine /></el-icon>
            查看对比结果 ({{ compareCount }})
          </el-button>
        </div>
      </div>

      <div class="timer-action">
        <el-button type="success" size="large" @click="enterCookingMode">
          <el-icon><VideoPlay /></el-icon>
          进入做菜流程模式
        </el-button>
        <el-button type="primary" size="large" @click="startCookTimer" style="margin-left: 12px;">
          <el-icon><Timer /></el-icon>
          开始烹饪计时 ({{ recipe.cookTime }}分钟)
        </el-button>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <el-empty description="食谱不存在">
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'
import FavoriteButton from '../components/FavoriteButton.vue'
import IngredientList from '../components/IngredientList.vue'
import StepList from '../components/StepList.vue'
import { DataLine, Check, Plus, Close, Minus } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useRecipeStore()

const recipe = computed(() => store.getRecipeById(route.params.id))

const currentServings = ref(2)

watch(recipe, (newRecipe) => {
  if (newRecipe) {
    currentServings.value = newRecipe.servings
  }
}, { immediate: true })

const scaleRatio = computed(() => {
  if (!recipe.value) return 1
  return currentServings.value / recipe.value.servings
})

function increaseServings() {
  if (currentServings.value < 20) {
    currentServings.value++
  }
}

function decreaseServings() {
  if (currentServings.value > 1) {
    currentServings.value--
  }
}

const totalTime = computed(() => {
  if (!recipe.value) return 0
  return recipe.value.prepTime + recipe.value.cookTime
})

const difficultyType = computed(() => {
  if (!recipe.value) return 'info'
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[recipe.value.difficulty] || 'info'
})

function goBack() {
  router.push('/')
}

function startCookTimer() {
  if (!recipe.value || recipe.value.cookTime === 0) return
  store.addTimer({
    label: `${recipe.value.name} - 烹饪`,
    duration: recipe.value.cookTime * 60,
    recipeId: recipe.value.id
  })
  router.push('/timers')
}

function enterCookingMode() {
  if (!recipe.value) return
  router.push(`/recipe/${recipe.value.id}/cooking`)
}

const compareCount = computed(() => store.compareCount)
const compareRecipeObjects = computed(() => store.compareRecipeObjects)

function isInCompare(recipeId) {
  return store.isInCompare(recipeId)
}

function toggleCompare() {
  if (!recipe.value) return
  if (store.isInCompare(recipe.value.id)) {
    store.removeFromCompare(recipe.value.id)
    ElMessage.success('已从对比中移除')
  } else {
    if (store.compareCount >= 6) {
      ElMessage.warning('最多只能对比6个食谱')
      return
    }
    store.addToCompare(recipe.value.id)
    ElMessage.success('已加入对比')
  }
}

function goToCompare() {
  router.push('/compare')
}

function removeFromCompare(recipeId) {
  store.removeFromCompare(recipeId)
  ElMessage.success('已从对比中移除')
}
</script>

<style scoped>
.recipe-detail {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.detail-header {
  height: 240px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: -20px -20px 0;
  margin-bottom: 24px;
}

.detail-emoji {
  font-size: 100px;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
}

.back-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.9);
}

.detail-favorite {
  position: absolute;
  top: 16px;
  right: 16px;
}

.detail-content {
  padding: 0 8px;
}

.detail-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-title-row h1 {
  font-size: 28px;
  color: #3D3D3D;
}

.detail-description {
  font-size: 16px;
  color: #757575;
  line-height: 1.6;
  margin-bottom: 20px;
}

.detail-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-item {
  background: #FFF8F0;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-item .el-icon {
  font-size: 24px;
  color: #FF6B35;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #3D3D3D;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #999;
}

.servings-item {
  min-width: 0;
}

.servings-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.servings-control .stat-label {
  margin-bottom: 2px;
}

.servings-adjuster {
  display: flex;
  align-items: center;
  gap: 8px;
}

.servings-value {
  font-size: 20px;
  font-weight: 700;
  color: #3D3D3D;
  min-width: 30px;
  text-align: center;
}

.servings-original {
  font-size: 10px;
  color: #999;
  white-space: nowrap;
}

.detail-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.detail-extra-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  padding: 24px;
  border-top: 1px solid #F0F0F0;
  margin-top: 24px;
  background: linear-gradient(180deg, #FFFDFB 0%, #FFFFFF 100%);
  border-radius: 16px;
}

.compare-info-section {
  width: 100%;
}

.compare-info-header {
  text-align: center;
  margin-bottom: 16px;
}

.compare-count-label {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.compare-count-label .el-icon {
  color: #FF6B35;
}

.compare-recipe-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #FAFAFA;
  border-radius: 12px;
  padding: 12px;
}

.compare-recipe-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: white;
  border-radius: 10px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.compare-recipe-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.compare-recipe-item.is-current {
  border-color: #E6A23C;
  background: linear-gradient(135deg, #FFF8E7 0%, #FFFFFF 100%);
}

.recipe-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipe-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.recipe-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recipe-meta {
  font-size: 12px;
  color: #999;
}

.remove-single-btn {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.compare-recipe-item:hover .remove-single-btn {
  opacity: 1;
}

.compare-info-empty {
  text-align: center;
  padding: 16px;
  background: #F5F5F5;
  border-radius: 12px;
}

.empty-hint {
  color: #999;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.empty-hint .el-icon {
  color: #ccc;
}

.compare-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.compare-main-btn {
  min-width: 180px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.compare-main-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.compare-main-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.view-compare-btn {
  min-width: 200px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-compare-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.timer-action {
  text-align: center;
  padding: 24px 0;
  border-top: 1px solid #F0F0F0;
  margin-top: 0;
}

.not-found {
  padding: 80px 0;
}

@media (max-width: 600px) {
  .detail-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .detail-title-row h1 {
    font-size: 22px;
  }

  .detail-emoji {
    font-size: 72px;
  }
}
</style>
