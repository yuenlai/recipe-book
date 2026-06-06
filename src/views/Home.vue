<template>
  <div class="home-page">
    <div class="page-header">
      <h1>探索美食 🍽️</h1>
      <p>发现美味，享受烹饪的乐趣</p>
    </div>

    <CategoryFilter />

    <div v-if="filteredRecipes.length === 0" class="empty-state">
      <el-empty description="没有找到匹配的食谱" />
    </div>

    <div v-else>
      <div class="recipe-grid">
        <RecipeCard
          v-for="recipe in paginatedRecipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <div v-if="totalPages > 1" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="9"
          :total="filteredRecipes.length"
          layout="prev, pager, next"
          background
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRecipeStore } from '../stores/recipe'
import CategoryFilter from '../components/CategoryFilter.vue'
import RecipeCard from '../components/RecipeCard.vue'

const store = useRecipeStore()

const filteredRecipes = computed(() => store.filteredRecipes)
const paginatedRecipes = computed(() => store.paginatedRecipes)
const totalPages = computed(() => store.totalPages)
const currentPage = computed({
  get: () => store.currentPage,
  set: () => {}
})

function handlePageChange(page) {
  store.setPage(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.home-page {
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
  margin-bottom: 32px;
}

.empty-state {
  padding: 60px 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
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
