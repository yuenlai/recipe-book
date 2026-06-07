<template>
  <div class="compare-page">
    <div class="page-header">
      <h1>食谱对比中心 📊</h1>
      <p v-if="compareRecipeObjects.length > 0">正在对比 {{ compareRecipeObjects.length }} 个食谱（最多6个）</p>
      <p v-else>添加食谱开始对比，帮你快速决定今晚做什么</p>
    </div>

    <div v-if="compareRecipeObjects.length === 0" class="empty-state">
      <el-empty description="还没有添加对比的食谱">
        <el-button type="primary" @click="goHome">去浏览食谱</el-button>
      </el-empty>
    </div>

    <div v-else class="compare-content">
      <div class="compare-actions">
        <el-button @click="clearCompare" type="danger" plain>
          <el-icon><Delete /></el-icon>
          清空对比
        </el-button>
        <el-button type="primary" @click="goHome">
          <el-icon><Plus /></el-icon>
          继续添加
        </el-button>
      </div>

      <div class="compare-table-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="compare-label-col">对比项</th>
              <th v-for="recipe in compareRecipeObjects" :key="recipe.id" class="compare-recipe-col">
                <div class="recipe-header" :style="{ backgroundColor: recipe.coverColor }">
                  <span class="recipe-emoji">{{ recipe.emoji }}</span>
                  <span class="recipe-name">{{ recipe.name }}</span>
                  <el-button
                    class="remove-btn"
                    circle
                    size="small"
                    @click="removeRecipe(recipe.id)"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="compare-row">
              <td class="compare-label">
                <el-icon><Timer /></el-icon>
                准备时间
              </td>
              <td v-for="recipe in compareRecipeObjects" :key="recipe.id" class="compare-value">
                <span class="value-number">{{ recipe.prepTime }}</span>
                <span class="value-unit">分钟</span>
              </td>
            </tr>

            <tr class="compare-row">
              <td class="compare-label">
                <el-icon><Dish /></el-icon>
                烹饪时间
              </td>
              <td v-for="recipe in compareRecipeObjects" :key="recipe.id" class="compare-value">
                <span class="value-number">{{ recipe.cookTime }}</span>
                <span class="value-unit">分钟</span>
              </td>
            </tr>

            <tr class="compare-row highlight">
              <td class="compare-label">
                <el-icon><Clock /></el-icon>
                总时间
              </td>
              <td v-for="recipe in compareRecipeObjects" :key="recipe.id" class="compare-value">
                <span class="value-number highlight-value">{{ getTotalTime(recipe) }}</span>
                <span class="value-unit">分钟</span>
                <el-tag
                  v-if="isFastest(recipe)"
                  type="success"
                  size="small"
                  class="badge"
                >最快</el-tag>
              </td>
            </tr>

            <tr class="compare-row">
              <td class="compare-label">
                <el-icon><StarFilled /></el-icon>
                难度
              </td>
              <td v-for="recipe in compareRecipeObjects" :key="recipe.id" class="compare-value">
                <el-tag
                  :type="getDifficultyType(recipe.difficulty)"
                  effect="light"
                  size="large"
                >
                  {{ recipe.difficulty }}
                </el-tag>
                <el-tag
                  v-if="isEasiest(recipe)"
                  type="success"
                  size="small"
                  class="badge"
                >最简单</el-tag>
              </td>
            </tr>

            <tr class="compare-row">
              <td class="compare-label">
                <el-icon><User /></el-icon>
                份量
              </td>
              <td v-for="recipe in compareRecipeObjects" :key="recipe.id" class="compare-value">
                <span class="value-number">{{ recipe.servings }}</span>
                <span class="value-unit">人份</span>
              </td>
            </tr>

            <tr class="compare-row">
              <td class="compare-label">
                <el-icon><ShoppingCart /></el-icon>
                口味标签
              </td>
              <td v-for="recipe in compareRecipeObjects" :key="recipe.id" class="compare-value">
                <div class="tags-container">
                  <el-tag
                    v-for="tag in recipe.tags"
                    :key="tag"
                    effect="plain"
                    round
                    size="small"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </td>
            </tr>

            <tr class="compare-row ingredients-row">
              <td class="compare-label">
                <el-icon><Bowl /></el-icon>
                主要食材
              </td>
              <td v-for="recipe in compareRecipeObjects" :key="recipe.id" class="compare-value">
                <div class="ingredients-list">
                  <div
                    v-for="ing in recipe.ingredients.slice(0, 5)"
                    :key="ing.name"
                    class="ingredient-item"
                  >
                    <span class="ingredient-name">{{ ing.name }}</span>
                    <span class="ingredient-amount">{{ ing.amount }}</span>
                  </div>
                  <div v-if="recipe.ingredients.length > 5" class="more-ingredients">
                    等 {{ recipe.ingredients.length }} 种食材
                  </div>
                </div>
              </td>
            </tr>

            <tr class="compare-row">
              <td class="compare-label">操作</td>
              <td v-for="recipe in compareRecipeObjects" :key="recipe.id" class="compare-value">
                <div class="action-buttons">
                  <el-button
                    type="primary"
                    size="small"
                    @click="viewRecipe(recipe.id)"
                  >
                    查看详情
                  </el-button>
                  <el-button
                    type="success"
                    size="small"
                    @click="startCooking(recipe.id)"
                  >
                    开始烹饪
                  </el-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="comparison-summary">
        <h3>💡 对比小结</h3>
        <div class="summary-content">
          <div class="summary-item" v-if="fastestRecipe">
            <span class="summary-icon">⚡</span>
            <span class="summary-text">
              <strong>{{ fastestRecipe.name }}</strong> 最快完成，仅需 {{ getTotalTime(fastestRecipe) }} 分钟
            </span>
          </div>
          <div class="summary-item" v-if="easiestRecipe">
            <span class="summary-icon">✨</span>
            <span class="summary-text">
              <strong>{{ easiestRecipe.name }}</strong> 难度最低，适合新手
            </span>
          </div>
          <div class="summary-item" v-if="mostServingsRecipe">
            <span class="summary-icon">👨‍👩‍👧‍👦</span>
            <span class="summary-text">
              <strong>{{ mostServingsRecipe.name }}</strong> 份量最多，可做 {{ mostServingsRecipe.servings }} 人份
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import { Timer, Dish, Clock, StarFilled, User, ShoppingCart, Bowl, Delete, Plus, Close } from '@element-plus/icons-vue'

const router = useRouter()
const store = useRecipeStore()

const compareRecipeObjects = computed(() => store.compareRecipeObjects)

const fastestRecipe = computed(() => {
  if (compareRecipeObjects.value.length === 0) return null
  return compareRecipeObjects.value.reduce((fastest, recipe) => {
    return getTotalTime(recipe) < getTotalTime(fastest) ? recipe : fastest
  })
})

const easiestRecipe = computed(() => {
  if (compareRecipeObjects.value.length === 0) return null
  const difficultyOrder = { '简单': 0, '中等': 1, '困难': 2 }
  return compareRecipeObjects.value.reduce((easiest, recipe) => {
    return difficultyOrder[recipe.difficulty] < difficultyOrder[easiest.difficulty] ? recipe : easiest
  })
})

const mostServingsRecipe = computed(() => {
  if (compareRecipeObjects.value.length === 0) return null
  return compareRecipeObjects.value.reduce((most, recipe) => {
    return recipe.servings > most.servings ? recipe : most
  })
})

function getTotalTime(recipe) {
  return recipe.prepTime + recipe.cookTime
}

function getDifficultyType(difficulty) {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[difficulty] || 'info'
}

function isFastest(recipe) {
  if (!fastestRecipe.value) return false
  return recipe.id === fastestRecipe.value.id && compareRecipeObjects.value.length > 1
}

function isEasiest(recipe) {
  if (!easiestRecipe.value) return false
  return recipe.id === easiestRecipe.value.id && compareRecipeObjects.value.length > 1
}

function removeRecipe(recipeId) {
  store.removeFromCompare(recipeId)
}

function clearCompare() {
  store.clearCompare()
}

function goHome() {
  router.push('/')
}

function viewRecipe(recipeId) {
  router.push(`/recipe/${recipeId}`)
}

function startCooking(recipeId) {
  router.push(`/recipe/${recipeId}/cooking`)
}
</script>

<style scoped>
.compare-page {
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

.empty-state {
  padding: 80px 0;
}

.compare-content {
  max-width: 1400px;
  margin: 0 auto;
}

.compare-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 20px;
}

.compare-table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 0;
}

.compare-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 800px;
}

.compare-table th,
.compare-table td {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.compare-table thead th {
  background: #fafafa;
  font-weight: 600;
  color: #3D3D3D;
}

.compare-label-col {
  width: 140px;
  position: sticky;
  left: 0;
  background: #fafafa;
  z-index: 1;
}

.compare-recipe-col {
  min-width: 200px;
}

.recipe-header {
  border-radius: 12px;
  padding: 16px;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.recipe-emoji {
  font-size: 48px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.recipe-name {
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #F56C6C;
}

.compare-row:nth-child(even) td:not(.compare-label-col) {
  background: #fefcf9;
}

.compare-row.highlight td:not(.compare-label-col) {
  background: #f0f9eb;
}

.compare-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.compare-label .el-icon {
  color: #FF6B35;
}

.value-number {
  font-size: 28px;
  font-weight: 700;
  color: #3D3D3D;
}

.value-number.highlight-value {
  color: #67C23A;
}

.value-unit {
  font-size: 14px;
  color: #999;
  margin-left: 4px;
}

.badge {
  margin-left: 8px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.ingredients-list {
  text-align: left;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 12px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 6px;
}

.ingredient-name {
  color: #3D3D3D;
  font-weight: 500;
}

.ingredient-amount {
  color: #999;
  font-size: 13px;
}

.more-ingredients {
  color: #FF6B35;
  font-size: 13px;
  text-align: center;
  padding: 4px;
}

.ingredients-row td {
  vertical-align: top;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comparison-summary {
  margin-top: 32px;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFE8D6 100%);
  border-radius: 16px;
  padding: 24px;
}

.comparison-summary h3 {
  font-size: 20px;
  color: #3D3D3D;
  margin-bottom: 16px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 10px;
}

.summary-icon {
  font-size: 24px;
}

.summary-text {
  color: #666;
}

.summary-text strong {
  color: #FF6B35;
}

@media (max-width: 600px) {
  .page-header h1 {
    font-size: 24px;
  }

  .compare-label-col {
    width: 100px;
  }

  .compare-table th,
  .compare-table td {
    padding: 12px 8px;
  }

  .value-number {
    font-size: 22px;
  }

  .recipe-emoji {
    font-size: 36px;
  }

  .recipe-name {
    font-size: 14px;
  }
}
</style>
