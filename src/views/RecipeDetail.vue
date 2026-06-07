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
        <div class="stat-item">
          <el-icon><User /></el-icon>
          <div>
            <span class="stat-value">{{ recipe.servings }}</span>
            <span class="stat-label">份量(人)</span>
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

      <IngredientList :ingredients="recipe.ingredients" />
      <StepList :steps="recipe.steps" />

      <div class="detail-extra-actions">
        <el-button
          :type="isInCompare(recipe.id) ? 'warning' : 'info'"
          size="large"
          @click="toggleCompare"
          :disabled="!isInCompare(recipe.id) && compareCount >= 6"
        >
          <el-icon><DataLine /></el-icon>
          {{ isInCompare(recipe.id) ? '已加入对比' : '加入对比' }}
          <span v-if="compareCount > 0" class="compare-badge">{{ compareCount }}/6</span>
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click="goToCompare"
          v-if="compareCount > 0"
        >
          <el-icon><DataLine /></el-icon>
          查看对比
        </el-button>
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'
import FavoriteButton from '../components/FavoriteButton.vue'
import IngredientList from '../components/IngredientList.vue'
import StepList from '../components/StepList.vue'
import { DataLine } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useRecipeStore()

const recipe = computed(() => store.getRecipeById(route.params.id))

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

.detail-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.detail-extra-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 20px 0;
  border-top: 1px solid #F0F0F0;
  margin-top: 24px;
  flex-wrap: wrap;
}

.compare-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  margin-left: 6px;
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
