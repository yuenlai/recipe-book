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
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ recipe.name }}</h3>

      <div class="card-meta">
        <el-tag size="small" :type="difficultyType" effect="plain">
          {{ recipe.difficulty }}
        </el-tag>
        <span class="meta-time">
          <el-icon><Timer /></el-icon>
          {{ totalTime }}分钟
        </span>
      </div>

      <div class="card-tags">
        <el-tag
          v-for="tag in recipe.tags.slice(0, 2)"
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
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'
import FavoriteButton from './FavoriteButton.vue'
import { DataLine, Check } from '@element-plus/icons-vue'

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
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-emoji {
  font-size: 64px;
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

.compare-indicator {
  position: absolute;
  bottom: 8px;
  left: 8px;
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
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #3D3D3D;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.meta-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #757575;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
