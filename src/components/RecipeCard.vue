<template>
  <div class="recipe-card" @click="goToDetail">
    <div class="card-cover" :style="{ backgroundColor: recipe.coverColor }">
      <span class="card-emoji">{{ recipe.emoji }}</span>
      <FavoriteButton :recipeId="recipe.id" class="card-favorite" @click.stop />
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
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const totalTime = computed(() => props.recipe.prepTime + props.recipe.cookTime)

const difficultyType = computed(() => {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[props.recipe.difficulty] || 'info'
})

function goToDetail() {
  router.push(`/recipe/${props.recipe.id}`)
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
}

.recipe-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
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
