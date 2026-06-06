<template>
  <div class="shopping-list-page">
    <div class="page-header">
      <div class="header-left">
        <h1>智能购物清单 🛒</h1>
        <p>选择多道食谱，一键合并食材，智能去重累加，轻松采购</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleImportFromMealPlan">
          <el-icon><Calendar /></el-icon>
          从备餐计划导入
        </el-button>
        <el-button type="danger" plain @click="handleClearAll">
          <el-icon><Delete /></el-icon>
          清空清单
        </el-button>
      </div>
    </div>

    <div v-if="stats.totalRecipes > 0" class="progress-bar-section">
      <div class="progress-info">
        <span class="progress-text">
          <el-icon><Check /></el-icon>
          采购进度：{{ stats.checkedItems }}/{{ stats.totalItems }} 项
        </span>
        <span class="progress-percent">{{ stats.progress }}%</span>
      </div>
      <el-progress 
        :percentage="stats.progress" 
        :stroke-width="12"
        :color="progressColor"
        show-text="false"
      />
      <div class="progress-actions">
        <el-button size="small" @click="handleCheckAll">
          <el-icon><Select /></el-icon>
          全部已购
        </el-button>
        <el-button size="small" @click="handleUncheckAll">
          <el-icon><Close /></el-icon>
          重置进度
        </el-button>
      </div>
    </div>

    <div class="shopping-list-container">
      <div class="recipe-selector-panel">
        <div class="panel-header">
          <h3>
            <el-icon><Dish /></el-icon>
            选择食谱
          </h3>
          <div class="selector-filter">
            <el-select v-model="filterCategory" size="small" placeholder="分类筛选" clearable style="width: 120px">
              <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
            </el-select>
          </div>
        </div>

        <div v-if="selectedRecipes.length > 0" class="selected-recipes">
          <div class="selected-title">
            已选 {{ selectedRecipes.length }} 道菜
          </div>
          <div class="selected-list">
            <div 
              v-for="recipe in selectedRecipes" 
              :key="recipe.id"
              class="selected-recipe-tag"
            >
              <span class="tag-emoji">{{ recipe.emoji }}</span>
              <span class="tag-name">{{ recipe.name }}</span>
              <el-button 
                type="text" 
                size="small" 
                class="remove-tag"
                @click="toggleRecipe(recipe.id)"
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <div class="recipe-grid">
          <div
            v-for="recipe in filteredRecipesList"
            :key="recipe.id"
            :class="['recipe-select-card', { selected: isSelected(recipe.id) }]"
            @click="toggleRecipe(recipe.id)"
          >
            <div class="card-emoji" :style="{ backgroundColor: recipe.coverColor }">
              {{ recipe.emoji }}
            </div>
            <div class="card-info">
              <div class="card-name">{{ recipe.name }}</div>
              <div class="card-meta">
                <span>{{ recipe.ingredients.length }}种食材</span>
                <span>·</span>
                <span>{{ recipe.prepTime + recipe.cookTime }}分钟</span>
              </div>
            </div>
            <div class="card-checkbox">
              <el-checkbox :model-value="isSelected(recipe.id)" />
            </div>
          </div>
        </div>

        <div v-if="filteredRecipesList.length === 0" class="empty-recipes">
          <el-empty description="没有匹配的食谱" />
        </div>
      </div>

      <div class="shopping-list-panel">
        <div class="panel-header">
          <h3>
            <el-icon><List /></el-icon>
            合并购物清单
          </h3>
          <div v-if="groupedIngredients.length > 0" class="list-stats">
            共 {{ stats.totalItems }} 种食材
          </div>
        </div>

        <div v-if="groupedIngredients.length === 0" class="empty-list">
          <div class="empty-icon">🛒</div>
          <div class="empty-text">请从左侧选择食谱，自动生成购物清单</div>
          <div class="empty-hint">
            <el-icon><InfoFilled /></el-icon>
            智能提示：相同食材会自动合并用量，按品类分组方便采购
          </div>
        </div>

        <div v-else class="ingredient-groups">
          <div 
            v-for="group in groupedIngredients" 
            :key="group.category"
            class="ingredient-group"
          >
            <div class="group-header">
              <span class="group-emoji">{{ group.emoji }}</span>
              <span class="group-name">{{ group.category }}</span>
              <span class="group-count">{{ group.items.length }}项</span>
            </div>
            <div class="group-items">
              <div
                v-for="item in group.items"
                :key="item.name"
                :class="['ingredient-row', { checked: isChecked(item.name) }]"
                @click="toggleChecked(item.name)"
              >
                <div class="row-checkbox">
                  <el-checkbox :model-value="isChecked(item.name)" />
                </div>
                <div class="row-info">
                  <div class="row-name">{{ item.name }}</div>
                  <div class="row-amount">{{ item.displayAmount }}</div>
                </div>
                <div class="row-meta">
                  <div v-if="item.notes.length > 0" class="row-notes">
                    <el-tag 
                      v-for="note in item.notes" 
                      :key="note" 
                      size="small" 
                      effect="plain"
                      class="note-tag"
                    >
                      {{ note }}
                    </el-tag>
                  </div>
                  <div class="row-from">
                    来自：{{ item.fromRecipes.join('、') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRecipeStore } from '../stores/recipe'
import { categories } from '../data/recipes'

const store = useRecipeStore()

const filterCategory = ref('全部')

const filteredRecipesList = computed(() => {
  if (filterCategory.value === '全部') {
    return store.recipes
  }
  return store.recipes.filter(r => r.category === filterCategory.value)
})

const selectedRecipes = computed(() => store.shoppingListSelectedRecipeObjects)
const groupedIngredients = computed(() => store.groupedIngredients)
const stats = computed(() => store.shoppingListStats)

const progressColor = computed(() => {
  if (stats.value.progress === 100) return '#67C23A'
  if (stats.value.progress >= 60) return '#E6A23C'
  return '#FF6B35'
})

function isSelected(recipeId) {
  return store.isRecipeSelectedForShopping(recipeId)
}

function isChecked(ingredientName) {
  return store.isIngredientChecked(ingredientName)
}

function toggleRecipe(recipeId) {
  store.toggleRecipeForShoppingList(recipeId)
}

function toggleChecked(ingredientName) {
  store.toggleIngredientChecked(ingredientName)
}

function handleCheckAll() {
  store.checkAllIngredients()
}

function handleUncheckAll() {
  store.uncheckAllIngredients()
}

function handleClearAll() {
  ElMessageBox.confirm('确定要清空购物清单吗？所有已选食谱和采购进度将被清除。', '确认清空', {
    confirmButtonText: '确定清空',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.clearShoppingListRecipes()
  }).catch(() => {})
}

function handleImportFromMealPlan() {
  ElMessageBox.confirm('要将本周备餐计划中的所有食谱导入购物清单吗？', '导入备餐计划', {
    confirmButtonText: '导入全部',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    store.addMealPlanToShoppingList()
  }).catch(() => {})
}
</script>

<style scoped>
.shopping-list-page {
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

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.progress-bar-section {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #3D3D3D;
  font-weight: 500;
}

.progress-percent {
  font-size: 18px;
  font-weight: 700;
  color: #FF6B35;
}

.progress-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-end;
}

.shopping-list-container {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
}

.recipe-selector-panel,
.shopping-list-panel {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
}

.panel-header h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  color: #3D3D3D;
  margin: 0;
}

.list-stats {
  font-size: 13px;
  color: #757575;
}

.selected-recipes {
  margin-bottom: 16px;
  padding: 12px;
  background: #FFF8F0;
  border-radius: 12px;
}

.selected-title {
  font-size: 13px;
  font-weight: 600;
  color: #FF6B35;
  margin-bottom: 8px;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.selected-recipe-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px 4px 4px;
  background: white;
  border-radius: 16px;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.tag-emoji {
  font-size: 14px;
}

.tag-name {
  color: #3D3D3D;
}

.remove-tag {
  padding: 0;
  margin-left: 2px;
  color: #BDBDBD;
}

.remove-tag:hover {
  color: #F56C6C;
}

.recipe-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 4px;
}

.recipe-select-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #FAFAFA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.recipe-select-card:hover {
  background: #FFF0E8;
  border-color: #FFE4D6;
}

.recipe-select-card.selected {
  background: #FFF0E8;
  border-color: #FF6B35;
}

.card-emoji {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
}

.card-checkbox {
  flex-shrink: 0;
}

.empty-recipes {
  padding: 40px 0;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: #757575;
  margin-bottom: 8px;
}

.empty-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #FF6B35;
  background: #FFF8F0;
  padding: 8px 16px;
  border-radius: 20px;
}

.ingredient-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ingredient-group {
  background: #FAFAFA;
  border-radius: 12px;
  overflow: hidden;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #FFF8F0, #FFF0E8);
  font-weight: 600;
}

.group-emoji {
  font-size: 18px;
}

.group-name {
  flex: 1;
  color: #3D3D3D;
  font-size: 14px;
}

.group-count {
  font-size: 12px;
  color: #FF6B35;
  background: white;
  padding: 2px 8px;
  border-radius: 10px;
}

.group-items {
  padding: 8px;
}

.ingredient-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.ingredient-row:last-child {
  margin-bottom: 0;
}

.ingredient-row:hover {
  background: #FFF8F0;
  border-color: #FFE4D6;
}

.ingredient-row.checked {
  background: #F0FFF0;
  border-color: #E1F3D8;
}

.ingredient-row.checked .row-name,
.ingredient-row.checked .row-amount,
.ingredient-row.checked .row-from {
  text-decoration: line-through;
  opacity: 0.6;
}

.row-checkbox {
  padding-top: 2px;
  flex-shrink: 0;
}

.row-info {
  flex: 1;
  min-width: 0;
}

.row-name {
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 2px;
}

.row-amount {
  font-size: 14px;
  font-weight: 600;
  color: #FF6B35;
}

.row-meta {
  margin-top: 6px;
}

.row-notes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 4px;
}

.note-tag {
  --el-tag-font-size: 11px;
}

.row-from {
  font-size: 11px;
  color: #999;
}

@media (max-width: 1024px) {
  .shopping-list-container {
    grid-template-columns: 1fr;
  }

  .recipe-grid {
    max-height: 300px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }
}
</style>
