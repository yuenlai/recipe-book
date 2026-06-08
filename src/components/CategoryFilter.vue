<template>
  <div class="category-filter-wrapper">
    <div class="category-filter" ref="filterRef">
      <div class="category-tabs" ref="tabsRef">
        <button
          v-for="(cat, index) in categories"
          :key="cat"
          :ref="el => setTabRef(el, index)"
          :class="['category-tab', { active: selectedCategory === cat }]"
          @click="handleSelect(cat)"
        >
          <span class="category-emoji">{{ categoryEmojis[cat] }}</span>
          <span class="category-name">{{ cat }}</span>
          <span v-if="selectedCategory === cat" class="active-indicator"></span>
        </button>
      </div>
    </div>

    <transition name="fade-scale">
      <button
        v-if="selectedCategory !== '全部'"
        class="back-to-all"
        @click="handleBackToAll"
        title="回到全部"
      >
        <span class="back-icon">🏠</span>
        <span class="back-text">全部</span>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRecipeStore } from '../stores/recipe'
import { categories } from '../data/recipes'

const emit = defineEmits(['categoryChange', 'beforeCategoryChange'])

const store = useRecipeStore()
const { selectedCategory } = storeToRefs(store)

const filterRef = ref(null)
const tabsRef = ref(null)
const tabRefs = ref([])

const tabsScrollPosition = ref(0)
const categoryScrollPositions = ref({})
let scrollRestoreTimer = null

const categoryEmojis = {
  '全部': '🍽️',
  '中餐': '🥢',
  '西餐': '🍝',
  '甜点': '🍰',
  '饮品': '🥤',
  '小吃': '🥟'
}

function setTabRef(el, index) {
  if (el) {
    tabRefs.value[index] = el
  }
}

function saveTabsScrollPosition() {
  if (filterRef.value) {
    tabsScrollPosition.value = filterRef.value.scrollLeft
  }
}

function restoreTabsScrollPosition() {
  if (filterRef.value) {
    filterRef.value.scrollLeft = tabsScrollPosition.value
  }
}

function saveCategoryScrollPosition(category) {
  if (category && typeof window !== 'undefined') {
    categoryScrollPositions.value[category] = window.scrollY
  }
}

function restoreCategoryScrollPosition(category) {
  const savedPosition = categoryScrollPositions.value[category]
  if (savedPosition !== undefined && savedPosition > 0) {
    nextTick(() => {
      window.scrollTo({
        top: savedPosition,
        behavior: 'auto'
      })
    })
  } else {
    nextTick(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      })
    })
  }
}

function scrollToActiveTab() {
  const activeIndex = categories.indexOf(selectedCategory.value)
  if (activeIndex === -1) return

  const activeTab = tabRefs.value[activeIndex]
  const container = filterRef.value

  if (!activeTab || !container) return

  const tabLeft = activeTab.offsetLeft
  const tabWidth = activeTab.offsetWidth
  const containerWidth = container.clientWidth

  const scrollTo = tabLeft - (containerWidth / 2) + (tabWidth / 2)

  container.scrollTo({
    left: Math.max(0, scrollTo),
    behavior: 'smooth'
  })
}

function handleSelect(cat) {
  if (cat === selectedCategory.value) {
    return
  }

  const previousCategory = selectedCategory.value

  saveTabsScrollPosition()
  saveCategoryScrollPosition(previousCategory)

  emit('beforeCategoryChange', {
    from: previousCategory,
    to: cat,
    scrollPosition: window.scrollY
  })

  if (scrollRestoreTimer) {
    clearTimeout(scrollRestoreTimer)
  }

  store.setCategory(cat)
  store.setPage(1)

  emit('categoryChange', {
    from: previousCategory,
    to: cat
  })

  nextTick(() => {
    scrollToActiveTab()
    restoreCategoryScrollPosition(cat)
  })

  scrollRestoreTimer = setTimeout(() => {
    restoreTabsScrollPosition()
  }, 300)
}

function handleBackToAll() {
  handleSelect('全部')
}

watch(selectedCategory, () => {
  nextTick(() => {
    scrollToActiveTab()
  })
})

onMounted(() => {
  nextTick(() => {
    scrollToActiveTab()
  })
})

onBeforeUnmount(() => {
  if (scrollRestoreTimer) {
    clearTimeout(scrollRestoreTimer)
  }
})
</script>

<style scoped>
.category-filter-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.category-filter {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin-right: 70px;
}

.category-filter::-webkit-scrollbar {
  display: none;
}

.category-tabs {
  display: flex;
  gap: 10px;
  padding: 4px 0;
  white-space: nowrap;
}

.category-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px 12px;
  border: 2px solid transparent;
  border-radius: 20px;
  background: #FFFFFF;
  color: #757575;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.category-tab:hover {
  background: #FFF0E8;
  color: #FF6B35;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
  border-color: #FFE4D6;
}

.category-tab:active {
  transform: translateY(0) scale(0.97);
}

.category-tab.active {
  background: linear-gradient(135deg, #FF6B35, #FF8C42);
  color: white;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
  transform: translateY(-2px) scale(1.02);
  font-weight: 600;
  border-color: rgba(255, 255, 255, 0.3);
}

.category-tab.active .category-name {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.category-emoji {
  font-size: 18px;
  transition: transform 0.25s ease;
  line-height: 1;
}

.category-tab.active .category-emoji {
  transform: scale(1.1);
}

.category-name {
  transition: all 0.25s ease;
  line-height: 1.2;
}

.active-indicator {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 2px;
  animation: indicatorGrow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

@keyframes indicatorGrow {
  from {
    width: 0;
    opacity: 0;
    transform: translateX(-50%) scaleX(0);
  }
  to {
    width: 24px;
    opacity: 1;
    transform: translateX(-50%) scaleX(1);
  }
}

.back-to-all {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border: 2px solid #FF6B35;
  border-radius: 20px;
  background: linear-gradient(135deg, #FFF8F0, #FFFFFF);
  color: #FF6B35;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(255, 107, 53, 0.2);
  z-index: 10;
  backdrop-filter: blur(8px);
}

.back-to-all:hover {
  background: linear-gradient(135deg, #FF6B35, #FF8C42);
  color: white;
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
}

.back-to-all:active {
  transform: translateY(-50%) scale(0.97);
}

.back-icon {
  font-size: 16px;
}

.back-text {
  white-space: nowrap;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.8);
}

.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

@media (max-width: 600px) {
  .category-filter {
    margin-right: 56px;
  }

  .category-tabs {
    gap: 8px;
  }

  .category-tab {
    padding: 8px 14px 10px;
    font-size: 13px;
    border-radius: 18px;
  }

  .category-emoji {
    font-size: 16px;
  }

  .active-indicator {
    width: 18px;
    bottom: 4px;
  }

  @keyframes indicatorGrow {
    from {
      width: 0;
      opacity: 0;
      transform: translateX(-50%) scaleX(0);
    }
    to {
      width: 18px;
      opacity: 1;
      transform: translateX(-50%) scaleX(1);
    }
  }

  .back-to-all {
    padding: 8px 10px;
    font-size: 12px;
    border-radius: 18px;
  }

  .back-icon {
    font-size: 14px;
  }

  .back-text {
    display: none;
  }
}
</style>
