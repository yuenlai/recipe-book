<template>
  <div
    class="recipe-card"
    :class="{ 'in-compare': isInCompare(recipe.id) }"
    @click="goToDetail"
  >
    <div class="card-cover" :style="{ backgroundColor: recipe.coverColor }">
      <span class="card-emoji">{{ recipe.emoji }}</span>
      <FavoriteButton :recipeId="recipe.id" class="card-favorite" @click.stop />
      <el-button
        class="card-compare"
        circle
        size="small"
        :type="isInCompare(recipe.id) ? 'warning' : 'info'"
        :effect="isInCompare(recipe.id) ? 'dark' : 'light'"
        @click.stop="toggleCompare"
        :disabled="!isInCompare(recipe.id) && compareCount >= 6"
        :title="isInCompare(recipe.id) ? '点击从对比中移除' : '点击加入对比'"
      >
        <el-icon><DataLine /></el-icon>
      </el-button>
      <div v-if="isInCompare(recipe.id)" class="compare-indicator">
        <el-icon><Check /></el-icon>
        <span>对比中</span>
      </div>
      <div v-if="isInCompare(recipe.id)" class="compare-overlay">
        <span>已加入对比列表</span>
      </div>
      <div class="card-badges">
        <el-tag v-if="isQuickMeal" size="small" type="success" effect="dark" class="badge-item">
          ⚡ 快手
        </el-tag>
        <el-tag v-if="isVegetarian" size="small" type="success" effect="dark" class="badge-item">
          🥬 素食
        </el-tag>
        <el-tag v-if="isLowCalorie" size="small" type="warning" effect="dark" class="badge-item">
          💪 低脂
        </el-tag>
      </div>
    </div>

    <div class="card-body">
      <div class="card-header">
        <h3 class="card-title">{{ recipe.name }}</h3>
        <el-tag size="small" :type="difficultyType" effect="plain" class="difficulty-tag">
          {{ recipe.difficulty }}
        </el-tag>
      </div>

      <p class="card-highlight">{{ recipe.description }}</p>

      <div class="card-meta-row">
        <div class="meta-item">
          <el-icon><Timer /></el-icon>
          <span>{{ totalTime }}分钟</span>
        </div>
        <div class="meta-item">
          <el-icon><User /></el-icon>
          <span>{{ recipe.servings }}人份</span>
        </div>
        <div class="meta-item">
          <el-icon><Place /></el-icon>
          <span>{{ recipe.category }}</span>
        </div>
      </div>

      <div class="card-key-ingredients">
        <span class="ingredients-label">主料：</span>
        <span class="ingredients-list">{{ mainIngredients }}</span>
      </div>

      <div class="card-tags">
        <el-tag
          v-for="tag in recipe.tags"
          :key="tag"
          size="small"
          :type="getTagType(tag)"
          effect="light"
          round
          class="tag-item"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'
import FavoriteButton from './FavoriteButton.vue'
import { DataLine, Check, Timer, User, Place } from '@element-plus/icons-vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const store = useRecipeStore()

const totalTime = computed(() => props.recipe.prepTime + props.recipe.cookTime)
const compareCount = computed(() => store.compareCount)

const difficultyType = computed(() => {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[props.recipe.difficulty] || 'info'
})

const isQuickMeal = computed(() => totalTime.value <= 20)
const isVegetarian = computed(() => {
  const tags = props.recipe.tags || []
  return tags.includes('素食') || tags.includes('健康') || tags.includes('轻食')
})
const isLowCalorie = computed(() => {
  const tags = props.recipe.tags || []
  return tags.includes('低脂') || tags.includes('健康') || tags.includes('轻食')
})

const mainIngredients = computed(() => {
  const ingredients = props.recipe.ingredients || []
  return ingredients
    .slice(0, 3)
    .map(ing => ing.name)
    .join('、')
})

function getTagType(tag) {
  const typeMap = {
    '川菜': 'danger',
    '家常菜': 'warning',
    '快手': 'success',
    '下饭': 'warning',
    '家常': 'warning',
    '经典': 'primary',
    '素食': 'success',
    '健康': 'success',
    '西餐': 'info',
    '主食': 'warning',
    '高级': 'danger',
    '约会': 'danger',
    '轻食': 'success',
    '汤品': 'info',
    '暖胃': 'warning',
    '甜点': 'warning',
    '免烤': 'success',
    '意式': 'info',
    '清凉': 'success',
    '夏日': 'success',
    '烘焙': 'warning',
    '巧克力': 'danger',
    '广式': 'info',
    '传统': 'info',
    '饮品': 'success',
    '港式': 'info',
    '台式': 'info',
    '人气': 'danger',
    '咖啡': 'info',
    '提神': 'success',
    '小吃': 'warning',
    '面食': 'warning',
    '炸物': 'danger',
    '聚会': 'warning',
    '宴客': 'danger',
    '酸甜': 'warning',
    '硬菜': 'danger'
  }
  return typeMap[tag] || 'info'
}

function goToDetail() {
  store.setScrollPosition(window.scrollY)
  router.push(`/recipe/${props.recipe.id}`)
}

function isInCompare(recipeId) {
  return store.isInCompare(recipeId)
}

function toggleCompare() {
  if (store.isInCompare(props.recipe.id)) {
    store.removeFromCompare(props.recipe.id)
    ElMessage.success('已从对比中移除')
  } else {
    if (store.compareCount >= 6) {
      ElMessage.warning('最多只能对比6个食谱')
      return
    }
    store.addToCompare(props.recipe.id)
    ElMessage.success('已加入对比')
  }
}
</script>

<style scoped>
.recipe-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 3px solid transparent;
  display: flex;
  flex-direction: column;
}

.recipe-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.recipe-card.in-compare {
  border-color: #E6A23C;
  box-shadow: 0 4px 20px rgba(230, 162, 60, 0.3);
}

.recipe-card.in-compare:hover {
  box-shadow: 0 8px 30px rgba(230, 162, 60, 0.4);
  transform: translateY(-6px) scale(1.02);
}

.card-cover {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-emoji {
  font-size: 56px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.card-favorite {
  position: absolute;
  top: 10px;
  right: 10px;
}

.card-compare {
  position: absolute;
  top: 10px;
  right: 50px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.card-compare:hover:not(:disabled) {
  transform: scale(1.1);
}

.card-compare:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-badges {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  max-width: calc(100% - 16px);
}

.badge-item {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.compare-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: linear-gradient(135deg, #E6A23C 0%, #F56C6C 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: pulse 2s infinite;
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.5);
  z-index: 2;
}

.compare-indicator .el-icon {
  font-size: 14px;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(230, 162, 60, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(230, 162, 60, 0.7);
  }
}

.compare-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(230, 162, 60, 0.1) 0%,
    rgba(245, 108, 108, 0.1) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

.compare-overlay span {
  background: rgba(230, 162, 60, 0.9);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  transform: rotate(-15deg);
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-body {
  padding: 14px 16px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #3D3D3D;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.difficulty-tag {
  flex-shrink: 0;
}

.card-highlight {
  font-size: 12px;
  color: #757575;
  line-height: 1.5;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 36px;
}

.card-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #F0F0F0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #757575;
  white-space: nowrap;
}

.meta-item .el-icon {
  font-size: 14px;
  color: #FF6B35;
}

.card-key-ingredients {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ingredients-label {
  color: #FF6B35;
  font-weight: 500;
}

.ingredients-list {
  color: #666;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
}

.tag-item {
  font-size: 11px;
}

@media (max-width: 992px) {
  .card-meta-row {
    gap: 8px;
    flex-wrap: wrap;
  }

  .meta-item {
    font-size: 11px;
  }
}

@media (max-width: 600px) {
  .card-cover {
    height: 120px;
  }

  .card-emoji {
    font-size: 48px;
  }

  .card-highlight {
    -webkit-line-clamp: 1;
    min-height: 18px;
  }

  .card-meta-row {
    gap: 10px;
  }
}
</style>
