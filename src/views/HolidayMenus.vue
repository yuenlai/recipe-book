<template>
  <div class="holiday-menus-page">
    <div class="page-header">
      <div class="header-left">
        <h1>节日主题菜单 🎊</h1>
        <p>按节日和场景浏览整套菜谱组合，轻松应对各种场合</p>
      </div>
      <div v-if="selectedMenu" class="header-actions">
        <el-button type="info" @click="selectedMenu = null">
          <el-icon><Back /></el-icon>
          返回列表
        </el-button>
      </div>
    </div>

    <div v-if="!selectedMenu" class="menu-list-section">
      <div class="type-filter">
        <div
          v-for="type in holidayMenuTypes"
          :key="type.key"
          class="type-item"
          :class="{ active: selectedHolidayType === type.key }"
          @click="handleTypeChange(type.key)"
        >
          <span class="type-emoji">{{ type.emoji }}</span>
          <span class="type-name">{{ type.name }}</span>
          <el-tag size="small" type="info" effect="plain">
            {{ getTypeCount(type.key) }}
          </el-tag>
        </div>
      </div>

      <div class="menu-grid">
        <div
          v-for="menu in holidayMenusWithRecipes"
          :key="menu.id"
          class="menu-card"
          @click="handleSelectMenu(menu.id)"
        >
          <div class="menu-cover" :style="{ background: `linear-gradient(135deg, ${menu.coverColor}, ${adjustColor(menu.coverColor, 30)})` }">
            <span class="menu-emoji">{{ menu.emoji }}</span>
            <div class="menu-type-tag">
              {{ menu.type === 'holiday' ? '节日' : '场景' }}
            </div>
            <el-button
              class="favorite-btn"
              :type="isHolidayMenuFavorite(menu.id) ? 'danger' : 'default'"
              :icon="isHolidayMenuFavorite(menu.id) ? StarFilled : Star"
              circle
              size="small"
              @click.stop="handleToggleFavorite(menu.id)"
            />
          </div>
          <div class="menu-body">
            <h3 class="menu-title">{{ menu.name }}</h3>
            <p class="menu-desc">{{ menu.description }}</p>
            <div class="menu-meta">
              <span class="meta-item">
                <el-icon><UserFilled /></el-icon>
                {{ menu.people }}人份
              </span>
              <span class="meta-item">
                <el-icon><Bowl /></el-icon>
                {{ menu.recipes.length }}道菜
              </span>
            </div>
            <div class="menu-features">
              <el-tag
                v-for="feature in menu.features"
                :key="feature"
                size="small"
                type="warning"
                effect="light"
                round
              >
                {{ feature }}
              </el-tag>
            </div>
            <div class="menu-preview">
              <div
                v-for="recipe in menu.recipes.slice(0, 4)"
                :key="recipe.id"
                class="preview-item"
                :title="recipe.name"
              >
                <span class="preview-emoji" :style="{ backgroundColor: recipe.coverColor }">
                  {{ recipe.emoji }}
                </span>
              </div>
              <div v-if="menu.recipes.length > 4" class="preview-more">
                +{{ menu.recipes.length - 4 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="menu-detail-section">
      <div class="detail-header">
        <div class="detail-cover" :style="{ background: `linear-gradient(135deg, ${selectedMenu.coverColor}, ${adjustColor(selectedMenu.coverColor, 30)})` }">
          <span class="detail-emoji">{{ selectedMenu.emoji }}</span>
        </div>
        <div class="detail-info">
          <h2 class="detail-title">{{ selectedMenu.name }}</h2>
          <p class="detail-desc">{{ selectedMenu.description }}</p>
          <div class="detail-tags">
            <el-tag type="info" size="large">
              <el-icon><UserFilled /></el-icon>
              {{ selectedMenu.people }}人聚餐
            </el-tag>
            <el-tag type="warning" size="large">
              <el-icon><Bowl /></el-icon>
              共{{ selectedMenu.recipes.length }}道菜
            </el-tag>
            <el-tag type="success" size="large">
              {{ selectedMenu.type === 'holiday' ? '传统节日' : '场景主题' }}
            </el-tag>
          </div>
          <div class="detail-occasion">
            <el-icon><InfoFilled /></el-icon>
            {{ selectedMenu.occasion }}
          </div>
          <div class="detail-features">
            <el-tag
              v-for="feature in selectedMenu.features"
              :key="feature"
              size="large"
              type="warning"
              effect="light"
            >
              {{ feature }}
            </el-tag>
          </div>
        </div>
      </div>

      <div v-if="menuStats" class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <div class="stat-value">{{ menuStats.totalPrepTime }}</div>
            <div class="stat-label">准备时间(分钟)</div>
          </div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <div class="stat-value">{{ menuStats.totalCookTime }}</div>
            <div class="stat-label">烹饪时间(分钟)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⌛</div>
          <div class="stat-content">
            <div class="stat-value">{{ menuStats.totalTime }}</div>
            <div class="stat-label">总耗时(分钟)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🍽️</div>
          <div class="stat-content">
            <div class="stat-value">{{ menuStats.totalServings }}</div>
            <div class="stat-label">总份量</div>
          </div>
        </div>
      </div>

      <div class="action-bar">
        <el-button :type="allRecipesFavorited ? 'success' : 'danger'" size="large" @click="handleAddToFavorites">
          <el-icon><StarFilled /></el-icon>
          {{ allRecipesFavorited ? '✓ 菜谱已全部收藏' : '收藏整套餐单' }}
        </el-button>
        <el-button :type="allInShoppingList ? 'success' : 'success'" size="large" @click="handleAddToShoppingList">
          <el-icon><ShoppingCart /></el-icon>
          {{ allInShoppingList ? '✓ 已在购物清单' : '生成购物清单' }}
        </el-button>
        <el-button type="primary" size="large" @click="handleAddToMealPlan">
          <el-icon><Calendar /></el-icon>
          加入备餐计划
        </el-button>
      </div>

      <el-alert
        :title="`💡 温馨提示：${selectedMenu.tips}`"
        type="warning"
        show-icon
        :closable="false"
        class="tips-alert"
      />

      <div class="recipes-section">
        <h3 class="section-title">
          <el-icon><Menu /></el-icon>
          菜品搭配
        </h3>
        <div class="recipes-grid">
          <div
            v-for="recipe in selectedMenu.recipes"
            :key="recipe.id"
            class="recipe-item"
            @click="goToRecipe(recipe.id)"
          >
            <div class="recipe-emoji" :style="{ backgroundColor: recipe.coverColor }">
              {{ recipe.emoji }}
            </div>
            <div class="recipe-info">
              <div class="recipe-name">{{ recipe.name }}</div>
              <div class="recipe-meta">
                <el-tag size="small" :type="getDifficultyType(recipe.difficulty)" effect="plain">
                  {{ recipe.difficulty }}
                </el-tag>
                <span class="recipe-time">
                  <el-icon><Timer /></el-icon>
                  {{ recipe.prepTime + recipe.cookTime }}分钟
                </span>
                <span class="recipe-servings">
                  <el-icon><UserFilled /></el-icon>
                  {{ recipe.servings }}人份
                </span>
              </div>
            </div>
            <el-icon class="recipe-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div v-if="menuStats" class="ingredients-section">
        <h3 class="section-title">
          <el-icon><ShoppingCart /></el-icon>
          食材清单（共{{ menuStats.ingredientCount }}项）
        </h3>
        <div class="ingredients-groups">
          <div
            v-for="group in menuStats.groupedIngredients"
            :key="group.category"
            class="ingredient-group"
          >
            <div class="group-header">
              <span class="group-emoji">{{ group.emoji }}</span>
              <span class="group-name">{{ group.category }}</span>
              <el-tag size="small" type="info">{{ group.items.length }}项</el-tag>
            </div>
            <div class="group-items">
              <div
                v-for="item in group.items"
                :key="item.name"
                class="ingredient-item"
              >
                <span class="ing-name">{{ item.name }}</span>
                <span class="ing-amount">{{ item.displayAmount }}</span>
                <div v-if="item.notes.length > 0" class="ing-notes">
                  <el-tag
                    v-for="note in item.notes"
                    :key="note"
                    size="small"
                    type="info"
                    effect="plain"
                  >
                    {{ note }}
                  </el-tag>
                </div>
                <div class="ing-from">
                  来自：{{ item.fromRecipes.join('、') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="mealPlanDialogVisible"
      title="添加到备餐计划"
      width="400px"
    >
      <el-form label-width="80px">
        <el-form-item label="选择日期">
          <el-select v-model="selectedDate" placeholder="请选择日期">
            <el-option
              v-for="day in weekDates"
              :key="day.key"
              :label="`${day.label} ${day.date}`"
              :value="day.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择餐次">
          <el-select v-model="selectedMeal" placeholder="请选择餐次">
            <el-option label="早餐" value="breakfast" />
            <el-option label="午餐" value="lunch" />
            <el-option label="晚餐" value="dinner" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="mealPlanDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddToMealPlan">确定添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, StarFilled, Back, UserFilled, Bowl, Menu, Timer, ShoppingCart, Calendar, ArrowRight, InfoFilled } from '@element-plus/icons-vue'
import { useRecipeStore } from '../stores/recipe'

const store = useRecipeStore()
const router = useRouter()

const selectedMenu = ref(null)
const mealPlanDialogVisible = ref(false)
const selectedDate = ref('')
const selectedMeal = ref('dinner')

const holidayMenuTypes = computed(() => store.holidayMenuTypes)
const selectedHolidayType = computed(() => store.selectedHolidayType)
const holidayMenusWithRecipes = computed(() => store.holidayMenusWithRecipes)
const weekDates = computed(() => store.weekDates)

const menuStats = computed(() => {
  if (!selectedMenu.value) return null
  return store.getHolidayMenuStats(selectedMenu.value.id)
})

const allRecipesFavorited = computed(() => {
  if (!selectedMenu.value) return false
  return selectedMenu.value.recipes.every(r => store.isFavorite(r.id))
})

const allInShoppingList = computed(() => {
  if (!selectedMenu.value) return false
  return selectedMenu.value.recipes.every(r => store.isRecipeSelectedForShopping(r.id))
})

const favoritedCount = computed(() => {
  if (!selectedMenu.value) return 0
  return selectedMenu.value.recipes.filter(r => store.isFavorite(r.id)).length
})

const inShoppingListCount = computed(() => {
  if (!selectedMenu.value) return 0
  return selectedMenu.value.recipes.filter(r => store.isRecipeSelectedForShopping(r.id)).length
})

watch(selectedMenu, (newVal) => {
  if (newVal) {
    store.setCurrentHolidayMenu(newVal.id)
  } else {
    store.setCurrentHolidayMenu(null)
  }
})

function adjustColor(color, amount) {
  const hex = color.replace('#', '')
  const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount)
  const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount)
  const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function getTypeCount(typeKey) {
  if (typeKey === 'all') return store.holidayMenus.length
  return store.holidayMenus.filter(m => m.type === typeKey).length
}

function handleTypeChange(typeKey) {
  store.setHolidayType(typeKey)
}

function handleSelectMenu(menuId) {
  selectedMenu.value = store.getHolidayMenuById(menuId)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleToggleFavorite(menuId) {
  store.toggleHolidayMenuFavorite(menuId)
  ElMessage.success(
    store.isHolidayMenuFavorite(menuId) ? '已收藏菜单' : '已取消收藏'
  )
}

function isHolidayMenuFavorite(menuId) {
  return store.isHolidayMenuFavorite(menuId)
}

function getDifficultyType(difficulty) {
  const map = { '简单': 'success', '中等': 'warning', '困难': 'danger' }
  return map[difficulty] || 'info'
}

function handleAddToFavorites() {
  if (!selectedMenu.value) return
  const menuName = selectedMenu.value.name
  const totalCount = selectedMenu.value.recipes.length
  const alreadyCount = favoritedCount.value

  if (allRecipesFavorited.value) {
    ElMessageBox.confirm(
      `「${menuName}」的 ${totalCount} 道菜已全部在收藏中，是否前往收藏页查看？`,
      '菜谱已收藏',
      {
        confirmButtonText: '前往收藏页',
        cancelButtonText: '留在本页',
        type: 'info'
      }
    ).then(() => {
      router.push('/favorites')
    }).catch(() => {})
    return
  }

  ElMessageBox.confirm(
    `确定要将「${menuName}」的 ${totalCount} 道菜加入收藏吗？\n其中 ${alreadyCount} 道已在收藏中，将新增 ${totalCount - alreadyCount} 道。`,
    '收藏整套餐单',
    {
      confirmButtonText: '收藏并跳转',
      cancelButtonText: '仅收藏',
      distinguishCancelAndClose: true,
      type: 'warning'
    }
  ).then(() => {
    const result = store.addHolidayMenuToFavorites(selectedMenu.value.id)
    ElMessage.success({
      message: `收藏成功！新增 ${result.added} 道菜，共 ${result.total} 道已收藏`,
      duration: 2500,
      showClose: true
    })
    setTimeout(() => {
      router.push('/favorites')
    }, 800)
  }).catch(action => {
    if (action === 'cancel') {
      const result = store.addHolidayMenuToFavorites(selectedMenu.value.id)
      ElMessage.success({
        message: `已收藏！新增 ${result.added} 道菜，可前往收藏页查看`,
        duration: 2500,
        showClose: true
      })
    }
  })
}

function handleAddToShoppingList() {
  if (!selectedMenu.value) return
  const menuName = selectedMenu.value.name
  const totalCount = selectedMenu.value.recipes.length
  const alreadyCount = inShoppingListCount.value

  if (allInShoppingList.value) {
    ElMessageBox.confirm(
      `「${menuName}」的 ${totalCount} 道菜已全部在购物清单中，是否前往查看？`,
      '已在购物清单',
      {
        confirmButtonText: '前往购物清单',
        cancelButtonText: '留在本页',
        type: 'info'
      }
    ).then(() => {
      router.push('/shopping-list')
    }).catch(() => {})
    return
  }

  ElMessageBox.confirm(
    `确定要将「${menuName}」的 ${totalCount} 道菜加入购物清单吗？\n其中 ${alreadyCount} 道已在清单中，将新增 ${totalCount - alreadyCount} 道。`,
    '生成购物清单',
    {
      confirmButtonText: '加入并跳转',
      cancelButtonText: '仅加入',
      distinguishCancelAndClose: true,
      type: 'success'
    }
  ).then(() => {
    const result = store.addHolidayMenuToShoppingList(selectedMenu.value.id)
    ElMessage.success({
      message: `已加入！新增 ${result.added} 道菜，共 ${result.total} 道菜谱在购物清单中`,
      duration: 2500,
      showClose: true
    })
    setTimeout(() => {
      router.push('/shopping-list')
    }, 800)
  }).catch(action => {
    if (action === 'cancel') {
      const result = store.addHolidayMenuToShoppingList(selectedMenu.value.id)
      ElMessage.success({
        message: `已加入购物清单！新增 ${result.added} 道菜`,
        duration: 2500,
        showClose: true
      })
    }
  })
}

function handleAddToMealPlan() {
  if (weekDates.value.length > 0) {
    selectedDate.value = weekDates.value[0].key
  }
  mealPlanDialogVisible.value = true
}

function confirmAddToMealPlan() {
  if (!selectedDate.value || !selectedMenu.value) {
    ElMessage.warning('请选择日期')
    return
  }
  selectedMenu.value.recipes.forEach(r => {
    store.addRecipeToMeal(selectedDate.value, selectedMeal.value, r.id)
  })
  mealPlanDialogVisible.value = false
  ElMessage.success(`已将 ${selectedMenu.value.recipes.length} 道菜添加到备餐计划！`)
}

function goToRecipe(recipeId) {
  router.push(`/recipe/${recipeId}`)
}
</script>

<style scoped>
.holiday-menus-page {
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-top: 20px;
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
}

.type-filter {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.type-item:hover {
  background: #FFF8F0;
}

.type-item.active {
  background: linear-gradient(135deg, #FFF0E8, #FFE4D6);
  border-color: #FF6B35;
}

.type-emoji {
  font-size: 24px;
}

.type-name {
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.menu-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
}

.menu-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: #FFE4D6;
}

.menu-cover {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.menu-emoji {
  font-size: 64px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.menu-type-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #3D3D3D;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.menu-body {
  padding: 16px;
}

.menu-title {
  font-size: 18px;
  font-weight: 700;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.menu-desc {
  font-size: 13px;
  color: #757575;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #757575;
}

.menu-features {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.menu-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.preview-item {
  flex-shrink: 0;
}

.preview-emoji {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.preview-more {
  font-size: 13px;
  color: #FF6B35;
  font-weight: 600;
  margin-left: 4px;
}

.menu-detail-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-header {
  display: flex;
  gap: 24px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
}

.detail-cover {
  width: 180px;
  height: 180px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-emoji {
  font-size: 80px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.detail-info {
  flex: 1;
  min-width: 300px;
}

.detail-title {
  font-size: 24px;
  font-weight: 700;
  color: #3D3D3D;
  margin-bottom: 8px;
}

.detail-desc {
  font-size: 14px;
  color: #757575;
  margin-bottom: 16px;
}

.detail-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.detail-tags .el-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.detail-occasion {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #67C23A;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #F0F9EB;
  border-radius: 8px;
}

.detail-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card.highlight {
  background: linear-gradient(135deg, #FFF0E8, #FFE4D6);
}

.stat-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #FF6B35;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #757575;
}

.action-bar {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-bar .el-button {
  flex: 1;
  min-width: 180px;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
}

.tips-alert {
  margin-bottom: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 16px;
}

.recipes-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}

.recipe-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #FFF8F0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.recipe-item:hover {
  background: #FFF0E8;
  border-color: #FFE4D6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.recipe-emoji {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.recipe-info {
  flex: 1;
  min-width: 0;
}

.recipe-name {
  font-size: 15px;
  font-weight: 600;
  color: #3D3D3D;
  margin-bottom: 6px;
}

.recipe-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.recipe-time,
.recipe-servings {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  color: #757575;
}

.recipe-arrow {
  color: #BDBDBD;
  flex-shrink: 0;
}

.ingredients-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.ingredients-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.ingredient-group {
  background: #FAFAFA;
  border-radius: 12px;
  padding: 16px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F0F0F0;
}

.group-emoji {
  font-size: 18px;
}

.group-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
}

.group-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ingredient-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.ing-name {
  font-size: 14px;
  font-weight: 600;
  color: #3D3D3D;
  display: block;
  margin-bottom: 4px;
}

.ing-amount {
  font-size: 14px;
  font-weight: 600;
  color: #FF6B35;
  display: block;
  margin-bottom: 8px;
}

.ing-notes {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.ing-from {
  font-size: 11px;
  color: #999;
  font-style: italic;
}

@media (max-width: 992px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
  }

  .detail-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .detail-info {
    min-width: 100%;
  }

  .detail-tags,
  .detail-features {
    justify-content: center;
  }

  .action-bar {
    flex-direction: column;
  }

  .action-bar .el-button {
    width: 100%;
  }

  .ingredients-groups {
    grid-template-columns: 1fr;
  }

  .type-filter {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    gap: 12px;
  }

  .stat-icon {
    font-size: 28px;
  }

  .stat-value {
    font-size: 24px;
  }

  .detail-cover {
    width: 140px;
    height: 140px;
  }

  .detail-emoji {
    font-size: 64px;
  }
}
</style>
