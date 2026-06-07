<template>
  <nav class="navbar">
    <div class="navbar-content">
      <router-link to="/" class="navbar-brand">
        <span class="logo">🍳</span>
        <span class="brand-text">美食食谱</span>
      </router-link>

      <div class="navbar-links">
        <router-link to="/" class="nav-link" active-class="active">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>

        <router-link to="/meal-plan" class="nav-link" active-class="active">
          <el-badge :value="mealPlanCount" :hidden="mealPlanCount === 0" class="badge">
            <el-icon><Calendar /></el-icon>
          </el-badge>
          <span>备餐</span>
        </router-link>

        <router-link to="/dinner-party" class="nav-link" active-class="active">
          <el-icon><Food /></el-icon>
          <span>聚餐</span>
        </router-link>

        <router-link to="/shopping-list" class="nav-link" active-class="active">
          <el-badge :value="shoppingListCount" :hidden="shoppingListCount === 0" class="badge">
            <el-icon><ShoppingCart /></el-icon>
          </el-badge>
          <span>购物清单</span>
        </router-link>

        <router-link to="/favorites" class="nav-link" active-class="active">
          <el-badge :value="favoriteCount" :hidden="favoriteCount === 0" class="badge">
            <el-icon><StarFilled /></el-icon>
          </el-badge>
          <span>收藏</span>
        </router-link>

        <router-link to="/timers" class="nav-link" active-class="active">
          <el-badge :value="timerCount" :hidden="timerCount === 0" class="badge">
            <el-icon><Timer /></el-icon>
          </el-badge>
          <span>计时器</span>
        </router-link>
      </div>

      <div class="navbar-search">
        <SearchBar />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRecipeStore } from '../stores/recipe'
import SearchBar from './SearchBar.vue'

const store = useRecipeStore()

const favoriteCount = computed(() => store.favoriteCount)
const timerCount = computed(() => store.timers.length)
const mealPlanCount = computed(() => {
  return store.weekPlanSummary.reduce((sum, day) => sum + day.mealCount, 0)
})
const shoppingListCount = computed(() => {
  return store.shoppingListStats.totalItems > 0 ? store.shoppingListStats.totalItems : 0
})
</script>

<style scoped>
.navbar {
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 24px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo {
  font-size: 28px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: #FF6B35;
}

.navbar-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  color: #757575;
  font-size: 14px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: #FFF0E8;
  color: #FF6B35;
}

.nav-link.active {
  background: #FF6B35;
  color: white;
}

.navbar-search {
  flex: 1;
  max-width: 300px;
}

.badge {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .navbar-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .navbar-search {
    order: 3;
    max-width: 100%;
    width: 100%;
  }

  .brand-text {
    display: none;
  }
}
</style>
