<template>
  <div class="leftover-detail-page">
    <div v-if="recipe" class="detail-container">
      <div class="back-btn" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        <span>返回列表</span>
      </div>

      <div class="recipe-header">
        <div class="recipe-cover" :style="{ backgroundColor: recipe.coverColor }">
          <span class="cover-emoji">{{ recipe.emoji }}</span>
        </div>
        <div class="recipe-intro">
          <h1 class="recipe-name">{{ recipe.name }}</h1>
          <RecipeStats
            :prep-time="recipe.prepTime"
            :cook-time="recipe.cookTime"
            :servings="recipe.servings"
            :difficulty="recipe.difficulty"
            class="recipe-meta-stats"
          />
          <p class="recipe-desc">{{ recipe.description }}</p>
          <div class="recipe-tags">
            <el-tag
              v-for="tag in recipe.tags"
              :key="tag"
              size="small"
              type="info"
              effect="light"
              round
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>

      <div class="transformation-section">
        <div class="section-header">
          <el-icon><MagicStick /></el-icon>
          <h2>创意要点</h2>
        </div>
        <div class="tip-card">
          <p>{{ recipe.transformationTip }}</p>
        </div>
      </div>

      <div v-if="recipe.sourceIngredients && recipe.sourceIngredients.length > 0" class="source-section">
        <div class="section-header">
          <el-icon><Refresh /></el-icon>
          <h2>使用的剩菜</h2>
        </div>
        <div class="source-tags">
          <el-tag
            v-for="ing in recipe.sourceIngredients"
            :key="ing"
            size="large"
            type="warning"
            effect="dark"
          >
            {{ getIngredientEmoji(ing) }} {{ ing }}
          </el-tag>
        </div>
      </div>

      <div class="content-grid">
        <div class="ingredients-section">
          <div class="section-header">
            <el-icon><List /></el-icon>
            <h2>食材清单</h2>
          </div>
          <div class="ingredients-list">
            <div
              v-for="(ing, index) in recipe.ingredients"
              :key="index"
              class="ingredient-item"
            >
              <span class="ingredient-name">{{ ing.name }}</span>
              <span class="ingredient-amount">{{ ing.amount }}</span>
              <span v-if="ing.note" class="ingredient-note">{{ ing.note }}</span>
            </div>
          </div>
        </div>

        <div class="steps-section">
          <div class="section-header">
            <el-icon><Collection /></el-icon>
            <h2>烹饪步骤</h2>
          </div>
          <div class="steps-list">
            <div
              v-for="step in recipe.steps"
              :key="step.order"
              class="step-item"
            >
              <div class="step-number">{{ step.order }}</div>
              <div class="step-content">
                <p class="step-description">{{ step.description }}</p>
                <div v-if="step.tip" class="step-tip">
                  <el-icon><InfoFilled /></el-icon>
                  <span>{{ step.tip }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-bar">
        <el-button type="primary" size="large" @click="startCooking">
          <el-icon><VideoPlay /></el-icon>
          开始烹饪
        </el-button>
        <el-button size="large" @click="addToFavorites">
          <el-icon><Star /></el-icon>
          {{ isFavorited ? '已收藏' : '收藏' }}
        </el-button>
        <el-button size="large" @click="addToMealPlan">
          <el-icon><Calendar /></el-icon>
          加入备餐
        </el-button>
        <el-button size="large" @click="addToShoppingList">
          <el-icon><ShoppingCart /></el-icon>
          加入购物清单
        </el-button>
      </div>
    </div>

    <div v-else class="empty-state">
      <el-empty description="未找到该菜谱" />
      <el-button type="primary" @click="goBack">返回列表</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'
import RecipeStats from '../components/RecipeStats.vue'
import {
  ArrowLeft,
  MagicStick,
  Refresh,
  List,
  Collection,
  InfoFilled,
  VideoPlay,
  Star,
  Calendar,
  ShoppingCart
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const store = useRecipeStore()

const recipeId = computed(() => route.params.id)
const recipe = computed(() => store.getLeftoverRecipeById(recipeId.value))
const isFavorited = ref(false)

const ingredientEmojiMap = {
  '红烧肉': '🥩',
  '炒鸡丁': '🍗',
  '煎牛排': '🥩',
  '炸鸡翅': '🍗',
  '回锅肉片': '🥓',
  '糖醋排骨': '🍖',
  '蒸鱼': '🐟',
  '炒虾仁': '🦐',
  '炒青菜': '🥬',
  '麻婆豆腐': '🫘',
  '番茄炒蛋': '🍳',
  '白米饭': '🍚',
  '炒面条': '🍜',
  '意大利面': '🍝',
  '白馒头': '🥟',
  '面包片': '🍞',
  '茶叶蛋': '🥚',
  '骨头汤': '🍲',
  '鸡汤': '🍲',
  '西兰花根': '🥦',
  '胡萝卜皮': '🥕',
  '芹菜叶': '🌿',
  '西瓜皮': '🍉',
  '豆腐渣': '🫘'
}

function getIngredientEmoji(name) {
  return ingredientEmojiMap[name] || '🍽️'
}

function goBack() {
  router.push('/leftover')
}

function startCooking() {
  if (recipe.value) {
    ElMessage.info('进入烹饪模式')
  }
}

function addToFavorites() {
  if (recipe.value) {
    isFavorited.value = !isFavorited.value
    ElMessage.success(isFavorited.value ? '已收藏' : '已取消收藏')
  }
}

function addToMealPlan() {
  ElMessage.info('请选择要添加到哪一天的备餐计划')
}

function addToShoppingList() {
  if (recipe.value) {
    ElMessage.success(`已将「${recipe.value.name}」的食材加入购物清单`)
  }
}
</script>

<style scoped>
.leftover-detail-page {
  padding: 20px 0 40px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #F5F5F5;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.back-btn:hover {
  background: #ECEFF1;
  color: #3D3D3D;
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
}

.recipe-header {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  align-items: center;
}

.recipe-cover {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-emoji {
  font-size: 96px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.recipe-name {
  font-size: 28px;
  font-weight: 700;
  color: #3D3D3D;
  margin: 0 0 16px 0;
}

.recipe-meta-stats {
  margin-bottom: 16px;
}

.recipe-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 16px;
}

.recipe-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.transformation-section,
.source-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin: 0;
}

.section-header .el-icon {
  color: #FF6B35;
  font-size: 20px;
}

.tip-card {
  background: linear-gradient(135deg, #FFF8E1, #FFECB3);
  border-left: 4px solid #FFC107;
  padding: 20px;
  border-radius: 12px;
}

.tip-card p {
  font-size: 15px;
  color: #5D4037;
  line-height: 1.8;
  margin: 0;
}

.source-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.source-tags .el-tag {
  font-size: 15px;
  padding: 8px 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.ingredients-section,
.steps-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 8px;
  flex-wrap: wrap;
}

.ingredient-name {
  flex: 1;
  font-weight: 500;
  color: #3D3D3D;
  min-width: 100px;
}

.ingredient-amount {
  color: #FF6B35;
  font-weight: 600;
  font-size: 14px;
}

.ingredient-note {
  width: 100%;
  font-size: 12px;
  color: #999;
  padding-top: 4px;
  border-top: 1px dashed #E0E0E0;
  margin-top: 4px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #FAFAFA;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.step-item:hover {
  background: #FFF8F0;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #FF8C42);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-description {
  font-size: 15px;
  color: #3D3D3D;
  line-height: 1.8;
  margin: 0 0 8px 0;
}

.step-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
  border-radius: 8px;
  font-size: 13px;
  color: #1565C0;
}

.step-tip .el-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.action-bar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.action-bar .el-button {
  flex: 1;
  min-width: 140px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 20px;
}

@media (max-width: 768px) {
  .recipe-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .recipe-cover {
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }

  .cover-emoji {
    font-size: 72px;
  }

  .recipe-meta-stats {
    max-width: 400px;
    margin: 0 auto 16px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .action-bar .el-button {
    width: 100%;
    flex: none;
  }
}
</style>
