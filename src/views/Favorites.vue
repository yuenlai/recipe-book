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

    <div v-else class="recipe-grid">
      <RecipeCard
        v-for="recipe in favoriteRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import RecipeCard from '../components/RecipeCard.vue'

const router = useRouter()
const store = useRecipeStore()

const favoriteRecipes = computed(() => store.favoriteRecipes)

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

@media (max-width: 600px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 24px;
  }
}
</style>
