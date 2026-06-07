<template>
  <div class="leftover-page">
    <div class="page-header">
      <div class="header-left">
        <h1>剩菜再利用 🔄</h1>
        <p>选择家里已有的熟食或边角料，发现创意新菜做法，减少浪费</p>
      </div>
      <div class="header-actions">
        <el-button type="danger" plain @click="handleClearSelection" :disabled="selectedCount === 0">
          <el-icon><Refresh /></el-icon>
          清空选择
        </el-button>
      </div>
    </div>

    <div v-if="selectedCount > 0" class="selected-summary">
      <div class="summary-header">
        <el-icon><CircleCheckFilled /></el-icon>
        <span>已选择 <strong>{{ selectedCount }}</strong> 种食材</span>
      </div>
      <div class="selected-tags">
        <el-tag
          v-for="item in selectedIngredients"
          :key="item.id"
          class="selected-tag"
          closable
          @close="handleToggleIngredient(item.id)"
          :style="{ backgroundColor: getTagColor(item.category) + '20', borderColor: getTagColor(item.category), color: getTagColor(item.category) }"
        >
          <span class="tag-emoji">{{ item.emoji }}</span>
          {{ item.name }}
        </el-tag>
      </div>
    </div>

    <div class="main-content">
      <div class="ingredient-selector">
        <div class="section-card">
          <div class="section-title">
            <el-icon><List /></el-icon>
            <span>选择家里现有的剩菜</span>
          </div>

          <div class="category-tabs">
            <div
              :class="['category-tab', { active: selectedCategory === 'all' }]"
              @click="handleCategoryChange('all')"
            >
              <span class="tab-emoji">📦</span>
              <span class="tab-name">全部</span>
            </div>
            <div
              v-for="cat in categories"
              :key="cat.key"
              :class="['category-tab', { active: selectedCategory === cat.key }]"
              @click="handleCategoryChange(cat.key)"
            >
              <span class="tab-emoji">{{ cat.emoji }}</span>
              <span class="tab-name">{{ cat.name }}</span>
            </div>
          </div>

          <div class="ingredient-grid">
            <div
              v-for="item in ingredients"
              :key="item.id"
              :class="['ingredient-card', { selected: isSelected(item.id) }]"
              @click="handleToggleIngredient(item.id)"
            >
              <div class="card-emoji">{{ item.emoji }}</div>
              <div class="card-name">{{ item.name }}</div>
              <div class="card-note">{{ item.note }}</div>
              <div v-if="isSelected(item.id)" class="selected-indicator">
                <el-icon><Check /></el-icon>
              </div>
            </div>
          </div>

          <div v-if="ingredients.length === 0" class="empty-ingredients">
            <el-empty description="该分类下暂无食材" />
          </div>
        </div>
      </div>

      <div class="recommendation-section">
        <div class="section-card">
          <div class="section-title">
            <el-icon><Star /></el-icon>
            <span>
              创意推荐
              <el-tag v-if="recommendedRecipes.length > 0" type="success" size="small" effect="dark">
                找到 {{ recommendedRecipes.length }} 个做法
              </el-tag>
            </span>
          </div>

          <div v-if="selectedCount === 0" class="empty-recommend">
            <div class="empty-icon">👈</div>
            <div class="empty-text">
              <h4>请先选择家里现有的剩菜</h4>
              <p>选择后会为你推荐可继续加工的新菜做法</p>
            </div>
          </div>

          <div v-else-if="recommendedRecipes.length === 0" class="empty-recommend">
            <div class="empty-icon">🤔</div>
            <div class="empty-text">
              <h4>暂无匹配的做法</h4>
              <p>试试选择其他食材组合，或者查看全部创意菜谱</p>
              <el-button type="primary" size="small" @click="showAllRecipes = true">
                查看全部菜谱
              </el-button>
            </div>
          </div>

          <div v-else class="recipe-list">
            <div
              v-for="recipe in recommendedRecipes"
              :key="recipe.id"
              class="recipe-card"
              @click="goToDetail(recipe.id)"
            >
              <div class="recipe-header">
                <div class="recipe-emoji" :style="{ backgroundColor: recipe.coverColor }">
                  {{ recipe.emoji }}
                </div>
                <div class="recipe-info">
                  <h3 class="recipe-name">{{ recipe.name }}</h3>
                  <div class="recipe-meta">
                    <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                      {{ recipe.difficulty }}
                    </el-tag>
                    <span class="meta-time">
                      <el-icon><Timer /></el-icon>
                      {{ recipe.prepTime + recipe.cookTime }}分钟
                    </span>
                    <span class="meta-servings">
                      <el-icon><User /></el-icon>
                      {{ recipe.servings }}人份
                    </span>
                  </div>
                </div>
                <div v-if="recipe.matchedCount" class="match-badge">
                  匹配 {{ recipe.matchedCount }} 种
                </div>
              </div>

              <p class="recipe-desc">{{ recipe.description }}</p>

              <div class="transformation-tip">
                <el-icon><MagicStick /></el-icon>
                <span class="tip-label">创意要点：</span>
                <span class="tip-content">{{ recipe.transformationTip }}</span>
              </div>

              <div v-if="recipe.matchedIngredients && recipe.matchedIngredients.length > 0" class="matched-ingredients">
                <span class="matched-label">使用的剩菜：</span>
                <el-tag
                  v-for="ing in recipe.matchedIngredients"
                  :key="ing"
                  size="small"
                  type="warning"
                  effect="dark"
                >
                  {{ ing }}
                </el-tag>
              </div>

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

              <div class="recipe-footer">
                <span class="view-detail">查看详情</span>
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showAllRecipes"
      title="全部创意菜谱"
      width="900px"
    >
      <div class="all-recipes-grid">
        <div
          v-for="recipe in allRecipes"
          :key="recipe.id"
          class="recipe-mini-card"
          @click="goToDetailFromDialog(recipe.id)"
        >
          <div class="mini-emoji" :style="{ backgroundColor: recipe.coverColor }">
            {{ recipe.emoji }}
          </div>
          <div class="mini-info">
            <div class="mini-name">{{ recipe.name }}</div>
            <div class="mini-meta">
              <span class="mini-time">{{ recipe.prepTime + recipe.cookTime }}分钟</span>
              <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                {{ recipe.difficulty }}
              </el-tag>
            </div>
            <div class="mini-sources">
              <span>需要：</span>
              <span class="sources-text">{{ recipe.sourceIngredients.join('、') }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipe'
import {
  List,
  Star,
  Refresh,
  CircleCheckFilled,
  Check,
  Timer,
  User,
  MagicStick,
  ArrowRight
} from '@element-plus/icons-vue'

const store = useRecipeStore()
const router = useRouter()

const showAllRecipes = ref(false)

const categories = computed(() => store.leftoverCategories)
const ingredients = computed(() => store.leftoverIngredients)
const selectedCategory = computed(() => store.selectedLeftoverCategory)
const selectedIngredients = computed(() => store.selectedLeftoverIngredientObjects)
const selectedCount = computed(() => store.selectedLeftoverCount)
const recommendedRecipes = computed(() => store.recommendedLeftoverRecipes)
const allRecipes = computed(() => store.allLeftoverRecipes)

const categoryColors = {
  cooked_meat: '#E74C3C',
  cooked_fish: '#3498DB',
  cooked_veg: '#2ECC71',
  rice_noodle: '#F39C12',
  bread: '#E67E22',
  egg: '#9B59B6',
  soup_broth: '#1ABC9C',
  scraps: '#95A5A6'
}

function getTagColor(categoryKey) {
  return categoryColors[categoryKey] || '#909399'
}

function getDifficultyType(difficulty) {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[difficulty] || 'info'
}

function isSelected(ingredientId) {
  return store.isLeftoverSelected(ingredientId)
}

function handleCategoryChange(category) {
  store.setLeftoverCategory(category)
}

function handleToggleIngredient(ingredientId) {
  store.toggleLeftoverIngredient(ingredientId)
}

function handleClearSelection() {
  store.clearSelectedLeftovers()
}

function goToDetail(recipeId) {
  router.push(`/leftover/${recipeId}`)
}

function goToDetailFromDialog(recipeId) {
  showAllRecipes.value = false
  router.push(`/leftover/${recipeId}`)
}
</script>

<style scoped>
.leftover-page {
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-top: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left h1 {
  font-size: 28px;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.header-left p {
  color: #757575;
  font-size: 14px;
}

.selected-summary {
  background: linear-gradient(135deg, #E8F5E9, #F1F8E9);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #C8E6C9;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #2E7D32;
  margin-bottom: 12px;
}

.summary-header strong {
  color: #1B5E20;
  font-size: 18px;
  margin: 0 4px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  border-width: 2px;
  border-style: solid;
  font-weight: 500;
}

.tag-emoji {
  margin-right: 4px;
}

.main-content {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  align-items: flex-start;
}

.section-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 16px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #F0F0F0;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #F5F5F5;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  color: #757575;
}

.category-tab:hover {
  background: #ECEFF1;
  color: #3D3D3D;
}

.category-tab.active {
  background: #FF6B35;
  color: white;
}

.tab-emoji {
  font-size: 14px;
}

.ingredient-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.ingredient-card {
  position: relative;
  padding: 12px;
  border-radius: 12px;
  background: #FAFAFA;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.ingredient-card:hover {
  background: #FFF0E8;
  border-color: #FFE4D6;
}

.ingredient-card.selected {
  background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
  border-color: #FF6B35;
}

.ingredient-card .card-emoji {
  font-size: 28px;
  margin-bottom: 4px;
}

.ingredient-card .card-name {
  font-size: 13px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 2px;
}

.ingredient-card .card-note {
  font-size: 11px;
  color: #999;
  line-height: 1.3;
}

.selected-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FF6B35;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.empty-ingredients {
  padding: 40px 0;
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recipe-card {
  background: #FAFAFA;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.recipe-card:hover {
  background: white;
  border-color: #FF6B35;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
  transform: translateY(-2px);
}

.recipe-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.recipe-emoji {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.recipe-info {
  flex: 1;
  min-width: 0;
}

.recipe-name {
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin: 0 0 8px 0;
}

.recipe-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-time,
.meta-servings {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #757575;
}

.match-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #FF6B35, #FF8C42);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.recipe-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.transformation-tip {
  background: linear-gradient(135deg, #FFF8E1, #FFECB3);
  border-left: 4px solid #FFC107;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.6;
}

.transformation-tip .tip-label {
  font-weight: 600;
  color: #F57C00;
  margin-right: 4px;
}

.transformation-tip .tip-content {
  color: #5D4037;
}

.transformation-tip .el-icon {
  color: #FF9800;
  margin-right: 6px;
}

.matched-ingredients {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.matched-label {
  font-size: 13px;
  color: #757575;
}

.recipe-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.recipe-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 4px;
  color: #FF6B35;
  font-size: 13px;
  font-weight: 500;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.empty-recommend {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
  text-align: center;
  flex-direction: column;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text h4 {
  font-size: 16px;
  color: #3D3D3D;
  margin: 0 0 8px 0;
}

.empty-text p {
  font-size: 13px;
  color: #757575;
  margin: 0 0 12px 0;
}

.all-recipes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

.recipe-mini-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.recipe-mini-card:hover {
  background: #FFF0E8;
  border-color: #FFE4D6;
}

.mini-emoji {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.mini-info {
  flex: 1;
  min-width: 0;
}

.mini-name {
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 4px;
}

.mini-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.mini-time {
  font-size: 12px;
  color: #757575;
}

.mini-sources {
  font-size: 11px;
  color: #999;
}

.sources-text {
  color: #FF6B35;
  font-weight: 500;
}

@media (max-width: 992px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .ingredient-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .all-recipes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    width: 100%;
  }

  .ingredient-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .recipe-header {
    flex-direction: column;
  }

  .match-badge {
    top: 12px;
    right: 12px;
    font-size: 11px;
  }
}
</style>
