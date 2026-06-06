import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recipes as allRecipes } from '../data/recipes'

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref(allRecipes)
  const favorites = ref(JSON.parse(localStorage.getItem('recipeFavorites') || '[]'))
  const timers = ref([])
  const searchQuery = ref('')
  const selectedCategory = ref('全部')
  const currentPage = ref(1)
  const pageSize = 9

  const filteredRecipes = computed(() => {
    let result = recipes.value

    if (selectedCategory.value !== '全部') {
      result = result.filter(r => r.category === selectedCategory.value)
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      result = result.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query)) ||
        r.ingredients.some(ing => ing.name.toLowerCase().includes(query))
      )
    }

    return result
  })

  const paginatedRecipes = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredRecipes.value.slice(start, start + pageSize)
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredRecipes.value.length / pageSize)
  })

  const favoriteRecipes = computed(() => {
    return recipes.value.filter(r => favorites.value.includes(r.id))
  })

  const favoriteCount = computed(() => favorites.value.length)

  const activeTimers = computed(() => timers.value.filter(t => t.remaining > 0 || t.isRunning))

  function toggleFavorite(recipeId) {
    const index = favorites.value.indexOf(recipeId)
    if (index === -1) {
      favorites.value.push(recipeId)
    } else {
      favorites.value.splice(index, 1)
    }
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites.value))
  }

  function isFavorite(recipeId) {
    return favorites.value.includes(recipeId)
  }

  function getRecipeById(id) {
    return recipes.value.find(r => r.id === Number(id))
  }

  function setCategory(category) {
    selectedCategory.value = category
    currentPage.value = 1
  }

  function setSearch(query) {
    searchQuery.value = query
    currentPage.value = 1
  }

  function setPage(page) {
    currentPage.value = page
  }

  function addTimer(timer) {
    timers.value.push({
      ...timer,
      id: Date.now() + Math.random(),
      isRunning: false,
      remaining: timer.duration,
      startedAt: null
    })
  }

  function removeTimer(timerId) {
    const index = timers.value.findIndex(t => t.id === timerId)
    if (index !== -1) {
      timers.value.splice(index, 1)
    }
  }

  function startTimer(timerId) {
    const timer = timers.value.find(t => t.id === timerId)
    if (timer) {
      timer.isRunning = true
      timer.startedAt = Date.now()
    }
  }

  function pauseTimer(timerId) {
    const timer = timers.value.find(t => t.id === timerId)
    if (timer && timer.isRunning) {
      const elapsed = Date.now() - timer.startedAt
      timer.remaining = Math.max(0, timer.remaining - elapsed / 1000)
      timer.isRunning = false
      timer.startedAt = null
    }
  }

  function resetTimer(timerId) {
    const timer = timers.value.find(t => t.id === timerId)
    if (timer) {
      timer.remaining = timer.duration
      timer.isRunning = false
      timer.startedAt = null
    }
  }

  return {
    recipes,
    favorites,
    timers,
    searchQuery,
    selectedCategory,
    currentPage,
    pageSize,
    filteredRecipes,
    paginatedRecipes,
    totalPages,
    favoriteRecipes,
    favoriteCount,
    activeTimers,
    toggleFavorite,
    isFavorite,
    getRecipeById,
    setCategory,
    setSearch,
    setPage,
    addTimer,
    removeTimer,
    startTimer,
    pauseTimer,
    resetTimer
  }
})
