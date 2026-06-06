import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recipes as allRecipes } from '../data/recipes'

const DAYS_OF_WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner']
const MEAL_NAMES = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' }

function getWeekDates() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push({
      key: date.toISOString().split('T')[0],
      label: DAYS_OF_WEEK[i],
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      isToday: date.toISOString().split('T')[0] === today.toISOString().split('T')[0]
    })
  }
  return dates
}

function initializeMealPlan() {
  const weekDates = getWeekDates()
  const plan = {}
  weekDates.forEach(day => {
    plan[day.key] = { breakfast: [], lunch: [], dinner: [] }
  })
  return plan
}

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref(allRecipes)
  const favorites = ref(JSON.parse(localStorage.getItem('recipeFavorites') || '[]'))
  const timers = ref([])
  const searchQuery = ref('')
  const selectedCategory = ref('全部')
  const currentPage = ref(1)
  const pageSize = 9
  const weekDates = ref(getWeekDates())
  const mealPlan = ref(JSON.parse(localStorage.getItem('mealPlan') || 'null') || initializeMealPlan())

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

  const mealPlanWithRecipes = computed(() => {
    const result = {}
    for (const [dateKey, meals] of Object.entries(mealPlan.value)) {
      result[dateKey] = {}
      for (const [mealType, recipeIds] of Object.entries(meals)) {
        result[dateKey][mealType] = recipeIds
          .map(id => recipes.value.find(r => r.id === id))
          .filter(Boolean)
      }
    }
    return result
  })

  const weekPlanSummary = computed(() => {
    return weekDates.value.map(day => {
      const dayPlan = mealPlanWithRecipes.value[day.key] || { breakfast: [], lunch: [], dinner: [] }
      const allRecipes = [...dayPlan.breakfast, ...dayPlan.lunch, ...dayPlan.dinner]
      const totalTime = allRecipes.reduce((sum, r) => sum + r.prepTime + r.cookTime, 0)
      return {
        ...day,
        mealCount: allRecipes.length,
        totalTime,
        breakfastCount: dayPlan.breakfast.length,
        lunchCount: dayPlan.lunch.length,
        dinnerCount: dayPlan.dinner.length
      }
    })
  })

  function getDaySummary(dateKey) {
    const dayPlan = mealPlanWithRecipes.value[dateKey] || { breakfast: [], lunch: [], dinner: [] }
    const allRecipes = [...dayPlan.breakfast, ...dayPlan.lunch, ...dayPlan.dinner]
    const totalPrepTime = allRecipes.reduce((sum, r) => sum + r.prepTime, 0)
    const totalCookTime = allRecipes.reduce((sum, r) => sum + r.cookTime, 0)
    const ingredients = {}
    allRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        if (!ingredients[ing.name]) {
          ingredients[ing.name] = { name: ing.name, amount: 0, unit: '' }
        }
        const amountMatch = ing.amount.match(/([\d.]+)\s*(\D+)/)
        if (amountMatch) {
          ingredients[ing.name].amount += parseFloat(amountMatch[1])
          ingredients[ing.name].unit = amountMatch[2].trim()
        }
      })
    })
    return {
      recipes: allRecipes,
      totalPrepTime,
      totalCookTime,
      totalTime: totalPrepTime + totalCookTime,
      ingredients: Object.values(ingredients),
      breakfast: dayPlan.breakfast,
      lunch: dayPlan.lunch,
      dinner: dayPlan.dinner
    }
  }

  function addRecipeToMeal(dateKey, mealType, recipeId) {
    if (!mealPlan.value[dateKey]) {
      mealPlan.value[dateKey] = { breakfast: [], lunch: [], dinner: [] }
    }
    if (!mealPlan.value[dateKey][mealType].includes(recipeId)) {
      mealPlan.value[dateKey][mealType].push(recipeId)
      saveMealPlan()
    }
  }

  function removeRecipeFromMeal(dateKey, mealType, recipeId) {
    if (mealPlan.value[dateKey] && mealPlan.value[dateKey][mealType]) {
      const index = mealPlan.value[dateKey][mealType].indexOf(recipeId)
      if (index > -1) {
        mealPlan.value[dateKey][mealType].splice(index, 1)
        saveMealPlan()
      }
    }
  }

  function moveRecipe(fromDate, fromMeal, toDate, toMeal, recipeId) {
    removeRecipeFromMeal(fromDate, fromMeal, recipeId)
    addRecipeToMeal(toDate, toMeal, recipeId)
  }

  function clearDayPlan(dateKey) {
    if (mealPlan.value[dateKey]) {
      mealPlan.value[dateKey] = { breakfast: [], lunch: [], dinner: [] }
      saveMealPlan()
    }
  }

  function clearWeekPlan() {
    weekDates.value.forEach(day => {
      mealPlan.value[day.key] = { breakfast: [], lunch: [], dinner: [] }
    })
    saveMealPlan()
  }

  function saveMealPlan() {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan.value))
  }

  function isRecipeInPlan(recipeId) {
    for (const dateKey of Object.keys(mealPlan.value)) {
      for (const mealType of MEAL_TYPES) {
        if (mealPlan.value[dateKey][mealType]?.includes(recipeId)) {
          return true
        }
      }
    }
    return false
  }

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
    weekDates,
    mealPlan,
    mealPlanWithRecipes,
    weekPlanSummary,
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
    resetTimer,
    getDaySummary,
    addRecipeToMeal,
    removeRecipeFromMeal,
    moveRecipe,
    clearDayPlan,
    clearWeekPlan,
    isRecipeInPlan
  }
})
