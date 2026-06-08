import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recipes as allRecipes, rawRecipes } from '../data/recipes'
import { breakfastRecipes } from '../data/breakfastRecipes'
import { getCategory, parseAmount, formatAmount, categoryOrder, categoryEmojis } from '../data/ingredientCategories'
import { HOLIDAY_MENUS, HOLIDAY_TYPES } from '../data/holidayMenus'
import { TRAINING_STAGES, SKILLS, ACHIEVEMENTS } from '../data/trainingCamp'
import {
  LEFTOVER_CATEGORIES,
  LEFTOVER_INGREDIENTS,
  LEFTOVER_RECIPES,
  getIngredientsByCategory,
  getRecommendedRecipes,
  getAllLeftoverRecipes
} from '../data/leftoverRecipes'
import {
  lowFatRecipes,
  FAT_LOSS_WEEK_PLAN,
  FAT_LOSS_TIPS,
  FAT_LOSS_NUTRIENT_GOALS,
  getFatLossRecipeById,
  getWeekPlanWithRecipes,
  calculateDayNutrition,
  calculateWeekNutrition
} from '../data/fatLossPlan'

const allRecipesWithBreakfast = [...allRecipes, ...breakfastRecipes]

const TASTE_PREFERENCES = [
  { value: 'all', label: '不限口味', emoji: '🍽️' },
  { value: 'mild', label: '清淡', emoji: '🥬' },
  { value: 'spicy', label: '麻辣', emoji: '🌶️' },
  { value: 'sweet', label: '酸甜', emoji: '🍯' },
  { value: 'home-style', label: '家常', emoji: '🏠' },
  { value: 'seafood', label: '海鲜', emoji: '🦐' },
  { value: 'vegetarian', label: '素食', emoji: '🥗' }
]

const DISH_CATEGORIES = [
  { key: 'cold', name: '凉菜', minCount: 1, emoji: '🥒' },
  { key: 'hot', name: '热菜', minCount: 2, emoji: '🍲' },
  { key: 'soup', name: '汤品', minCount: 1, emoji: '🍜' },
  { key: 'staple', name: '主食', minCount: 1, emoji: '🍚' },
  { key: 'dessert', name: '甜点', minCount: 0, emoji: '🍰' }
]

function classifyDish(recipe) {
  const tags = recipe.tags || []
  const category = recipe.category || ''
  const name = recipe.name || ''

  if (category === '甜点') return 'dessert'
  if (category === '饮品') return 'dessert'
  if (['汤品', '汤', '羹', '粥'].some(t => tags.includes(t) || name.includes(t))) return 'soup'
  if (['主食', '面食', '饭', '面', '饼', '饺子'].some(t => tags.includes(t) || name.includes(t))) return 'staple'
  if (['凉菜', '沙拉', '凉拌'].some(t => tags.includes(t) || name.includes(t))) return 'cold'
  if (category === '西餐' && ['沙拉'].some(t => name.includes(t))) return 'cold'
  if (category === '西餐' && ['汤'].some(t => name.includes(t))) return 'soup'
  if (category === '西餐' && ['意面', '牛排'].some(t => name.includes(t))) return 'staple'
  return 'hot'
}

function matchTaste(recipe, preference) {
  if (preference === 'all') return true

  const tags = recipe.tags || []
  const name = recipe.name || ''
  const description = recipe.description || ''
  const text = (tags.join(' ') + ' ' + name + ' ' + description).toLowerCase()

  switch (preference) {
    case 'mild':
      return !['辣', '麻', '川菜'].some(t => text.includes(t)) && ['清淡', '健康', '素食', '蔬菜'].some(t => text.includes(t))
    case 'spicy':
      return ['辣', '麻', '川菜', '麻辣'].some(t => text.includes(t))
    case 'sweet':
      return ['甜', '酸', '糖醋', '番茄'].some(t => text.includes(t))
    case 'home-style':
      return ['家常', '下饭', '经典'].some(t => text.includes(t))
    case 'seafood':
      return ['海鲜', '鱼', '虾', '蟹', '鳀鱼'].some(t => text.includes(t))
    case 'vegetarian':
      return recipe.ingredients.every(ing =>
        !['肉', '鸡', '牛', '猪', '鱼', '虾', '蟹', '蛋', '排骨', '牛排', '鸡翅'].some(m => ing.name.includes(m))
      )
    default:
      return true
  }
}

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

function fixMealPlanStructure(plan) {
  if (!plan || typeof plan !== 'object') {
    return initializeMealPlan()
  }
  const fixed = {}
  const expectedMeals = ['breakfast', 'lunch', 'dinner']
  for (const [dateKey, meals] of Object.entries(plan)) {
    if (!meals || typeof meals !== 'object') {
      fixed[dateKey] = { breakfast: [], lunch: [], dinner: [] }
      continue
    }
    fixed[dateKey] = {}
    for (const mealType of expectedMeals) {
      const recipeIds = meals[mealType]
      fixed[dateKey][mealType] = Array.isArray(recipeIds) ? recipeIds.filter(id => typeof id === 'number') : []
    }
  }
  const defaultPlan = initializeMealPlan()
  for (const [dateKey, meals] of Object.entries(defaultPlan)) {
    if (!fixed[dateKey]) {
      fixed[dateKey] = meals
    }
  }
  return fixed
}

function safeParseArray(jsonStr, defaultValue = []) {
  try {
    const parsed = JSON.parse(jsonStr)
    return Array.isArray(parsed) ? parsed : defaultValue
  } catch {
    return defaultValue
  }
}

function safeParseObject(jsonStr, defaultValue = {}) {
  try {
    const parsed = JSON.parse(jsonStr)
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : defaultValue
  } catch {
    return defaultValue
  }
}

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref(allRecipesWithBreakfast)
  const favorites = ref(safeParseArray(localStorage.getItem('recipeFavorites') || '[]'))
  const timers = ref([])
  const searchQuery = ref('')
  const selectedCategory = ref('全部')
  const currentPage = ref(1)
  const pageSize = 9
  const homeScrollPosition = ref(0)
  const weekDates = ref(getWeekDates())
  const mealPlan = ref(fixMealPlanStructure(JSON.parse(localStorage.getItem('mealPlan') || 'null')))
  const shoppingListSelectedRecipes = ref(safeParseArray(localStorage.getItem('shoppingListSelectedRecipes') || '[]'))
  const shoppingListCheckedItems = ref(safeParseObject(localStorage.getItem('shoppingListCheckedItems') || '{}'))

  const dinnerPartyPeople = ref(6)
  const dinnerPartyTaste = ref('all')
  const dinnerPartyPlan = ref(JSON.parse(localStorage.getItem('dinnerPartyPlan') || 'null'))
  const dinnerPartyHistory = ref(safeParseArray(localStorage.getItem('dinnerPartyHistory') || '[]'))

  const trainingCompletedTasks = ref(safeParseArray(localStorage.getItem('trainingCompletedTasks') || '[]'))
  const trainingCompletedAt = ref(safeParseObject(localStorage.getItem('trainingCompletedAt') || '{}'))
  const trainingUnlockedAchievements = ref(safeParseArray(localStorage.getItem('trainingUnlockedAchievements') || '[]'))

  const compareRecipes = ref(safeParseArray(localStorage.getItem('compareRecipes') || '[]'))

  const selectedLeftoverCategory = ref('all')
  const selectedLeftoverIngredients = ref(safeParseArray(localStorage.getItem('selectedLeftoverIngredients') || '[]'))

  const fatLossCompletedDays = ref(safeParseArray(localStorage.getItem('fatLossCompletedDays') || '[]'))
  const fatLossCurrentWeek = ref(JSON.parse(localStorage.getItem('fatLossCurrentWeek') || 'null'))

  const cookingProgress = ref(safeParseObject(localStorage.getItem('cookingProgress') || '{}'))

  const favoriteChangeHistory = ref([])
  const MAX_HISTORY = 5

  const leftoverCategories = computed(() => LEFTOVER_CATEGORIES)
  const leftoverIngredients = computed(() => getIngredientsByCategory(selectedLeftoverCategory.value))
  const allLeftoverIngredients = computed(() => LEFTOVER_INGREDIENTS)
  const allLeftoverRecipes = computed(() => getAllLeftoverRecipes())

  const recommendedLeftoverRecipes = computed(() => {
    return getRecommendedRecipes(selectedLeftoverIngredients.value)
  })

  const lowFatRecipesList = computed(() => lowFatRecipes)
  const fatLossTips = computed(() => FAT_LOSS_TIPS)
  const fatLossNutrientGoals = computed(() => FAT_LOSS_NUTRIENT_GOALS)

  const fatLossWeekPlan = computed(() => {
    const plan = getWeekPlanWithRecipes()
    return plan.map(day => ({
      ...day,
      nutrition: calculateDayNutrition(day),
      isCompleted: fatLossCompletedDays.value.includes(day.day)
    }))
  })

  const fatLossWeekNutrition = computed(() => calculateWeekNutrition())

  const fatLossStats = computed(() => {
    const weekPlan = fatLossWeekPlan.value
    const completedDays = fatLossCompletedDays.value.length
    const totalDays = weekPlan.length
    const progress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0
    
    return {
      completedDays,
      totalDays,
      progress,
      isWeekComplete: completedDays === totalDays
    }
  })

  const selectedLeftoverIngredientObjects = computed(() => {
    return LEFTOVER_INGREDIENTS.filter(i => selectedLeftoverIngredients.value.includes(i.id))
  })

  const selectedLeftoverCount = computed(() => selectedLeftoverIngredients.value.length)

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

  const CUISINE_KEYWORDS = {
    '中餐': ['中餐', '中国', '川菜', '湘菜', '粤菜', '鲁菜', '苏菜', '浙菜', '闽菜', '徽菜', '东北菜', '家常菜', '中式'],
    '西餐': ['西餐', '西式', '法国', '意大利', '意式', '美式', '俄式', '牛排', '意面', '汉堡', '披萨'],
    '甜点': ['甜点', '甜品', '蛋糕', '饼干', '面包', '布丁', '慕斯', '冰淇淋', '巧克力', '糖果'],
    '饮品': ['饮品', '饮料', '茶', '咖啡', '果汁', '奶茶', '鸡尾酒', '酒', '汤品', '汤'],
    '小吃': ['小吃', '零食', '点心', '夜宵', '炸物', '烧烤', '串串', '煎饼', '饺子', '包子']
  }

  const MAIN_INGREDIENT_KEYWORDS = [
    '鸡肉', '鸡胸肉', '鸡腿', '鸡翅', '鸡蛋', '猪肉', '五花肉', '瘦肉', '排骨', '牛肉', '牛排', '牛腩',
    '羊肉', '鱼肉', '鱼', '虾', '虾仁', '螃蟹', '蟹', '海鲜', '鱿鱼', '章鱼', '花甲', '扇贝',
    '番茄', '西红柿', '土豆', '马铃薯', '胡萝卜', '白菜', '青菜', '生菜', '菠菜', '西兰花', '花椰菜',
    '黄瓜', '茄子', '辣椒', '青椒', '洋葱', '大蒜', '葱', '姜', '豆腐', '豆皮', '豆芽',
    '米饭', '大米', '面条', '面粉', '面包', '牛奶', '芝士', '奶酪', '黄油', '奶油'
  ]

  function detectCuisineFromQuery(query) {
    if (!query) return null
    const q = query.toLowerCase()
    for (const [cuisine, keywords] of Object.entries(CUISINE_KEYWORDS)) {
      if (keywords.some(kw => q.includes(kw.toLowerCase()))) {
        return cuisine
      }
    }
    return null
  }

  function detectMainIngredientFromQuery(query) {
    if (!query) return []
    const q = query.toLowerCase()
    const found = []
    for (const ing of MAIN_INGREDIENT_KEYWORDS) {
      if (q.includes(ing.toLowerCase())) {
        found.push(ing)
      }
    }
    return found
  }

  function calculateRecipeSimilarity(recipe1, recipe2) {
    let score = 0
    if (recipe1.category === recipe2.category) score += 30
    const ing1 = recipe1.ingredients.map(i => i.name)
    const ing2 = recipe2.ingredients.map(i => i.name)
    const commonIng = ing1.filter(i => ing2.some(j => i.includes(j) || j.includes(i)))
    score += commonIng.length * 15
    const commonTags = recipe1.tags.filter(t => recipe2.tags.includes(t))
    score += commonTags.length * 10
    return score
  }

  const searchSuggestions = computed(() => {
    if (filteredRecipes.value.length > 0 || !searchQuery.value.trim()) {
      return { hasSuggestions: false, similarCuisine: [], sameIngredient: [], favoriteSimilar: [] }
    }

    const query = searchQuery.value.toLowerCase().trim()
    const allRecipeList = recipes.value

    const detectedCuisine = detectCuisineFromQuery(query) || selectedCategory.value
    const detectedIngredients = detectMainIngredientFromQuery(query)

    let similarCuisine = []
    if (detectedCuisine && detectedCuisine !== '全部') {
      similarCuisine = allRecipeList
        .filter(r => r.category === detectedCuisine)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
    }

    let sameIngredient = []
    if (detectedIngredients.length > 0) {
      sameIngredient = allRecipeList
        .map(r => {
          const matchCount = r.ingredients.filter(ing =>
            detectedIngredients.some(di => ing.name.includes(di) || di.includes(ing.name))
          ).length
          return { recipe: r, matchCount }
        })
        .filter(r => r.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, 4)
        .map(r => r.recipe)
    }

    let favoriteSimilar = []
    const favRecipes = favoriteRecipes.value
    if (favRecipes.length > 0) {
      const searchTerms = query.split(/\s+/).filter(Boolean)
      favoriteSimilar = favRecipes
        .map(r => {
          let score = 0
          const text = (r.name + ' ' + r.tags.join(' ') + ' ' + r.ingredients.map(i => i.name).join(' ')).toLowerCase()
          searchTerms.forEach(term => {
            if (text.includes(term)) score += 20
          })
          score += calculateRecipeSimilarity({ tags: detectedIngredients, category: detectedCuisine, ingredients: [] }, r)
          return { recipe: r, score }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(r => r.recipe)
    }

    if (similarCuisine.length === 0 && sameIngredient.length === 0 && favoriteSimilar.length === 0) {
      similarCuisine = allRecipeList
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
    }

    return {
      hasSuggestions: true,
      query,
      detectedCuisine,
      detectedIngredients,
      similarCuisine,
      sameIngredient,
      favoriteSimilar
    }
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

  const compareRecipeObjects = computed(() => {
    return compareRecipes.value
      .map(id => recipes.value.find(r => r.id === id))
      .filter(Boolean)
  })

  const compareCount = computed(() => compareRecipes.value.length)

  const favoriteCount = computed(() => favorites.value.length)

  const activeTimers = computed(() => timers.value.filter(t => t.remaining > 0 || t.isRunning))

  const mealPlanWithRecipes = computed(() => {
    const result = {}
    for (const [dateKey, meals] of Object.entries(mealPlan.value)) {
      result[dateKey] = {}
      for (const [mealType, recipeIds] of Object.entries(meals)) {
        const ids = Array.isArray(recipeIds) ? recipeIds : []
        result[dateKey][mealType] = ids
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
    const wasFavorite = index !== -1
    const action = wasFavorite ? 'remove' : 'add'

    if (wasFavorite) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(recipeId)
    }

    const changeRecord = {
      id: Date.now(),
      recipeId,
      action,
      wasFavorite,
      isFavorite: !wasFavorite,
      timestamp: Date.now()
    }

    favoriteChangeHistory.value.unshift(changeRecord)
    if (favoriteChangeHistory.value.length > MAX_HISTORY) {
      favoriteChangeHistory.value.pop()
    }

    localStorage.setItem('recipeFavorites', JSON.stringify(favorites.value))

    return {
      ...changeRecord,
      recipeName: getRecipeById(recipeId)?.name || ''
    }
  }

  function isFavorite(recipeId) {
    return favorites.value.includes(recipeId)
  }

  function undoLastFavoriteChange() {
    if (favoriteChangeHistory.value.length === 0) {
      return null
    }

    const lastChange = favoriteChangeHistory.value.shift()
    const { recipeId, action } = lastChange

    const index = favorites.value.indexOf(recipeId)
    if (action === 'add') {
      if (index !== -1) {
        favorites.value.splice(index, 1)
      }
    } else {
      if (index === -1) {
        favorites.value.push(recipeId)
      }
    }

    localStorage.setItem('recipeFavorites', JSON.stringify(favorites.value))

    return {
      ...lastChange,
      recipeName: getRecipeById(recipeId)?.name || '',
      undoAction: action === 'add' ? 'remove' : 'add'
    }
  }

  function getLatestFavoriteChange() {
    return favoriteChangeHistory.value[0] || null
  }

  function addToCompare(recipeId) {
    if (!compareRecipes.value.includes(recipeId) && compareRecipes.value.length < 6) {
      compareRecipes.value.push(recipeId)
      saveCompareRecipes()
    }
  }

  function removeFromCompare(recipeId) {
    const index = compareRecipes.value.indexOf(recipeId)
    if (index > -1) {
      compareRecipes.value.splice(index, 1)
      saveCompareRecipes()
    }
  }

  function isInCompare(recipeId) {
    return compareRecipes.value.includes(recipeId)
  }

  function clearCompare() {
    compareRecipes.value = []
    saveCompareRecipes()
  }

  function saveCompareRecipes() {
    localStorage.setItem('compareRecipes', JSON.stringify(compareRecipes.value))
  }

  function getRecipeById(id) {
    return recipes.value.find(r => r.id === Number(id))
  }

  function setCategory(category) {
    selectedCategory.value = category
    const maxPage = Math.max(1, Math.ceil(filteredRecipes.value.length / pageSize))
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  }

  function setSearch(query) {
    searchQuery.value = query
    const maxPage = Math.max(1, Math.ceil(filteredRecipes.value.length / pageSize))
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
  }

  function setPage(page) {
    currentPage.value = page
  }

  function setScrollPosition(position) {
    homeScrollPosition.value = position
  }

  function addTimer(timer) {
    timers.value.push({
      ...timer,
      id: Date.now() + Math.random(),
      isRunning: false,
      remaining: timer.remaining !== undefined ? timer.remaining : timer.duration,
      startedAt: null,
      completed: timer.completed || false,
      skipped: timer.skipped || false
    })
  }

  function addCompletedTimer(timer) {
    timers.value.push({
      ...timer,
      id: Date.now() + Math.random(),
      isRunning: false,
      remaining: 0,
      startedAt: null,
      completed: true,
      skipped: timer.skipped || false
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
      timer.completed = false
      timer.skipped = false
      if (timer.actualDuration !== undefined) {
        timer.actualDuration = 0
      }
    }
  }

  function updateTimerRemaining(timerId, remaining) {
    const timer = timers.value.find(t => t.id === timerId)
    if (timer) {
      timer.remaining = remaining
    }
  }

  const shoppingListSelectedRecipeObjects = computed(() => {
    return shoppingListSelectedRecipes.value
      .map(id => recipes.value.find(r => r.id === id))
      .filter(Boolean)
  })

  const mergedIngredients = computed(() => {
    const ingredientMap = {}
    
    shoppingListSelectedRecipeObjects.value.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const key = ing.name
        const parsed = parseAmount(ing.amount)
        
        if (!ingredientMap[key]) {
          ingredientMap[key] = {
            name: ing.name,
            totalValue: parsed.value,
            unit: parsed.unit,
            category: getCategory(ing.name),
            checked: shoppingListCheckedItems.value[key] || false,
            notes: [],
            fromRecipes: []
          }
        } else {
          if (parsed.value !== null && ingredientMap[key].totalValue !== null) {
            if (parsed.unit === ingredientMap[key].unit) {
              ingredientMap[key].totalValue += parsed.value
            } else {
              ingredientMap[key].totalValue = null
              ingredientMap[key].unit = '请参考各食谱用量'
            }
          } else {
            ingredientMap[key].totalValue = null
            if (ingredientMap[key].unit !== '请参考各食谱用量') {
              ingredientMap[key].unit = ingredientMap[key].unit || parsed.unit
            }
          }
        }
        
        if (ing.note && !ingredientMap[key].notes.includes(ing.note)) {
          ingredientMap[key].notes.push(ing.note)
        }
        if (!ingredientMap[key].fromRecipes.includes(recipe.name)) {
          ingredientMap[key].fromRecipes.push(recipe.name)
        }
      })
    })
    
    return Object.values(ingredientMap)
  })

  const groupedIngredients = computed(() => {
    const groups = {}
    
    categoryOrder.forEach(cat => {
      groups[cat] = []
    })
    
    mergedIngredients.value.forEach(ing => {
      if (!groups[ing.category]) {
        groups[ing.category] = []
      }
      groups[ing.category].push({
        ...ing,
        displayAmount: formatAmount(ing.totalValue, ing.unit)
      })
    })
    
    const result = []
    categoryOrder.forEach(cat => {
      if (groups[cat] && groups[cat].length > 0) {
        result.push({
          category: cat,
          emoji: categoryEmojis[cat] || '📦',
          items: groups[cat].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
        })
      }
    })
    
    Object.keys(groups).forEach(cat => {
      if (!categoryOrder.includes(cat) && groups[cat].length > 0) {
        result.push({
          category: cat,
          emoji: categoryEmojis[cat] || '📦',
          items: groups[cat].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
        })
      }
    })
    
    return result
  })

  const shoppingListStats = computed(() => {
    const total = mergedIngredients.value.length
    const checked = mergedIngredients.value.filter(ing => shoppingListCheckedItems.value[ing.name]).length
    return {
      totalRecipes: shoppingListSelectedRecipeObjects.value.length,
      totalItems: total,
      checkedItems: checked,
      progress: total > 0 ? Math.round((checked / total) * 100) : 0
    }
  })

  function toggleRecipeForShoppingList(recipeId) {
    const index = shoppingListSelectedRecipes.value.indexOf(recipeId)
    if (index === -1) {
      shoppingListSelectedRecipes.value.push(recipeId)
    } else {
      shoppingListSelectedRecipes.value.splice(index, 1)
    }
    saveShoppingListSelection()
  }

  function addRecipesToShoppingList(recipeIds) {
    recipeIds.forEach(id => {
      if (!shoppingListSelectedRecipes.value.includes(id)) {
        shoppingListSelectedRecipes.value.push(id)
      }
    })
    saveShoppingListSelection()
  }

  function removeRecipeFromShoppingList(recipeId) {
    const index = shoppingListSelectedRecipes.value.indexOf(recipeId)
    if (index > -1) {
      shoppingListSelectedRecipes.value.splice(index, 1)
    }
    saveShoppingListSelection()
  }

  function clearShoppingListRecipes() {
    shoppingListSelectedRecipes.value = []
    shoppingListCheckedItems.value = {}
    saveShoppingListSelection()
    saveShoppingListCheckedItems()
  }

  function toggleIngredientChecked(ingredientName) {
    shoppingListCheckedItems.value[ingredientName] = !shoppingListCheckedItems.value[ingredientName]
    saveShoppingListCheckedItems()
  }

  function setIngredientChecked(ingredientName, checked) {
    shoppingListCheckedItems.value[ingredientName] = checked
    saveShoppingListCheckedItems()
  }

  function checkAllIngredients() {
    mergedIngredients.value.forEach(ing => {
      shoppingListCheckedItems.value[ing.name] = true
    })
    saveShoppingListCheckedItems()
  }

  function uncheckAllIngredients() {
    shoppingListCheckedItems.value = {}
    saveShoppingListCheckedItems()
  }

  function isRecipeSelectedForShopping(recipeId) {
    return shoppingListSelectedRecipes.value.includes(recipeId)
  }

  function isIngredientChecked(ingredientName) {
    return shoppingListCheckedItems.value[ingredientName] || false
  }

  function saveShoppingListSelection() {
    localStorage.setItem('shoppingListSelectedRecipes', JSON.stringify(shoppingListSelectedRecipes.value))
  }

  function saveShoppingListCheckedItems() {
    localStorage.setItem('shoppingListCheckedItems', JSON.stringify(shoppingListCheckedItems.value))
  }

  function addMealPlanToShoppingList(dateKeys = []) {
    const recipeIds = new Set()
    
    const datesToProcess = dateKeys.length > 0 ? dateKeys : Object.keys(mealPlan.value)
    
    datesToProcess.forEach(dateKey => {
      const dayPlan = mealPlan.value[dateKey]
      if (dayPlan) {
        MEAL_TYPES.forEach(mealType => {
          if (dayPlan[mealType]) {
            dayPlan[mealType].forEach(id => recipeIds.add(id))
          }
        })
      }
    })
    
    addRecipesToShoppingList(Array.from(recipeIds))
  }

  const tastePreferences = computed(() => TASTE_PREFERENCES)

  const recipesWithClassification = computed(() => {
    return recipes.value.map(recipe => ({
      ...recipe,
      dishCategory: classifyDish(recipe)
    }))
  })

  function calculateDishCount(people) {
    const baseCount = Math.max(4, Math.ceil(people * 1.2))
    return {
      cold: Math.max(1, Math.ceil(baseCount * 0.15)),
      hot: Math.max(2, Math.ceil(baseCount * 0.4)),
      soup: 1,
      staple: Math.max(1, Math.ceil(baseCount * 0.15)),
      dessert: people >= 4 ? 1 : 0
    }
  }

  function shuffleArray(array) {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    return result
  }

  function generateDinnerParty(people, tastePreference) {
    const p = Math.max(2, Math.min(20, people))
    const dishCounts = calculateDishCount(p)
    const taste = tastePreference || 'all'

    const eligibleRecipes = recipesWithClassification.value.filter(r => matchTaste(r, taste))

    const grouped = {
      cold: [],
      hot: [],
      soup: [],
      staple: [],
      dessert: []
    }

    eligibleRecipes.forEach(recipe => {
      if (grouped[recipe.dishCategory]) {
        grouped[recipe.dishCategory].push(recipe)
      }
    })

    const selectedRecipes = []
    const totalServingsNeeded = p

    DISH_CATEGORIES.forEach(cat => {
      const count = dishCounts[cat.key] || 0
      const candidates = shuffleArray(grouped[cat.key] || [])

      if (candidates.length === 0) {
        const fallback = shuffleArray(
          recipesWithClassification.value.filter(r => r.dishCategory === cat.key)
        )
        for (let i = 0; i < count && i < fallback.length; i++) {
          selectedRecipes.push(fallback[i])
        }
        return
      }

      for (let i = 0; i < count && i < candidates.length; i++) {
        selectedRecipes.push(candidates[i])
      }
    })

    const uniqueRecipes = Array.from(new Map(selectedRecipes.map(r => [r.id, r])).values())

    const multiplier = Math.max(1, Math.ceil(totalServingsNeeded / Math.max(1, uniqueRecipes.reduce((sum, r) => sum + (r.servings || 2), 0))))

    const totalPrepTime = uniqueRecipes.reduce((sum, r) => sum + r.prepTime, 0)
    const totalCookTime = uniqueRecipes.reduce((sum, r) => sum + r.cookTime, 0)
    const totalServings = uniqueRecipes.reduce((sum, r) => sum + (r.servings || 2), 0) * multiplier

    const ingredientMap = {}
    uniqueRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const key = ing.name
        const parsed = parseAmount(ing.amount)

        if (!ingredientMap[key]) {
          ingredientMap[key] = {
            name: ing.name,
            totalValue: parsed.value !== null ? parsed.value * multiplier : null,
            unit: parsed.unit,
            category: getCategory(ing.name),
            notes: [],
            fromRecipes: []
          }
        } else {
          if (parsed.value !== null && ingredientMap[key].totalValue !== null) {
            if (parsed.unit === ingredientMap[key].unit) {
              ingredientMap[key].totalValue += parsed.value * multiplier
            } else {
              ingredientMap[key].totalValue = null
              ingredientMap[key].unit = '请参考各食谱用量'
            }
          } else {
            ingredientMap[key].totalValue = null
          }
        }

        if (ing.note && !ingredientMap[key].notes.includes(ing.note)) {
          ingredientMap[key].notes.push(ing.note)
        }
        if (!ingredientMap[key].fromRecipes.includes(recipe.name)) {
          ingredientMap[key].fromRecipes.push(recipe.name)
        }
      })
    })

    const ingredientsList = Object.values(ingredientMap)
    const groups = {}
    categoryOrder.forEach(cat => { groups[cat] = [] })
    ingredientsList.forEach(ing => {
      if (!groups[ing.category]) groups[ing.category] = []
      groups[ing.category].push({
        ...ing,
        displayAmount: formatAmount(ing.totalValue, ing.unit)
      })
    })

    const groupedIngredients = []
    categoryOrder.forEach(cat => {
      if (groups[cat] && groups[cat].length > 0) {
        groupedIngredients.push({
          category: cat,
          emoji: categoryEmojis[cat] || '📦',
          items: groups[cat].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
        })
      }
    })

    const plan = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      people: p,
      tastePreference: taste,
      tasteLabel: TASTE_PREFERENCES.find(t => t.value === taste)?.label || '不限',
      multiplier,
      recipes: uniqueRecipes,
      dishCounts,
      totalPrepTime,
      totalCookTime,
      totalTime: totalPrepTime + totalCookTime,
      totalServings,
      ingredients: ingredientsList,
      groupedIngredients,
      dishCategories: DISH_CATEGORIES.map(cat => ({
        ...cat,
        recipes: uniqueRecipes.filter(r => r.dishCategory === cat.key)
      }))
    }

    dinnerPartyPlan.value = plan
    saveDinnerPartyPlan()

    return plan
  }

  function regenerateDinnerParty() {
    return generateDinnerParty(dinnerPartyPeople.value, dinnerPartyTaste.value)
  }

  function saveDinnerPartyPlan() {
    localStorage.setItem('dinnerPartyPlan', JSON.stringify(dinnerPartyPlan.value))
  }

  function clearDinnerPartyPlan() {
    dinnerPartyPlan.value = null
    localStorage.removeItem('dinnerPartyPlan')
  }

  function addDinnerPartyToHistory() {
    if (dinnerPartyPlan.value) {
      dinnerPartyHistory.value.unshift({
        ...dinnerPartyPlan.value,
        savedAt: new Date().toISOString()
      })
      if (dinnerPartyHistory.value.length > 10) {
        dinnerPartyHistory.value = dinnerPartyHistory.value.slice(0, 10)
      }
      saveDinnerPartyHistory()
    }
  }

  function saveDinnerPartyHistory() {
    localStorage.setItem('dinnerPartyHistory', JSON.stringify(dinnerPartyHistory.value))
  }

  function clearDinnerPartyHistory() {
    dinnerPartyHistory.value = []
    localStorage.removeItem('dinnerPartyHistory')
  }

  function setDinnerPartyPeople(count) {
    dinnerPartyPeople.value = Math.max(2, Math.min(20, count))
  }

  function setDinnerPartyTaste(taste) {
    dinnerPartyTaste.value = taste
  }

  function addDinnerPartyToShoppingList() {
    if (dinnerPartyPlan.value) {
      const recipeIds = dinnerPartyPlan.value.recipes.map(r => r.id)
      addRecipesToShoppingList(recipeIds)
    }
  }

  function addDinnerPartyRecipesToMealPlan(dateKey, mealType) {
    if (dinnerPartyPlan.value) {
      dinnerPartyPlan.value.recipes.forEach(r => {
        addRecipeToMeal(dateKey, mealType, r.id)
      })
    }
  }

  const fridgeInventory = ref([])

  function getDaysUntilExpiry(expiryDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expiry = new Date(expiryDate)
    expiry.setHours(0, 0, 0, 0)
    const diffTime = expiry - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  function getExpiryStatus(expiryDate) {
    const days = getDaysUntilExpiry(expiryDate)
    if (days < 0) return { status: 'expired', days, label: '已过期', color: '#F56C6C' }
    if (days === 0) return { status: 'today', days, label: '今天到期', color: '#F56C6C' }
    if (days <= 3) return { status: 'urgent', days, label: `${days}天后过期`, color: '#E6A23C' }
    if (days <= 7) return { status: 'soon', days, label: `${days}天后过期`, color: '#67C23A' }
    return { status: 'normal', days, label: `${days}天后过期`, color: '#909399' }
  }

  const fridgeInventoryWithStatus = computed(() => {
    return fridgeInventory.value.map(item => ({
      ...item,
      expiryInfo: getExpiryStatus(item.expiryDate),
      category: getCategory(item.name)
    })).sort((a, b) => {
      const priority = { expired: 0, today: 1, urgent: 2, soon: 3, normal: 4 }
      const statusDiff = priority[a.expiryInfo.status] - priority[b.expiryInfo.status]
      if (statusDiff !== 0) return statusDiff
      return new Date(a.expiryDate) - new Date(b.expiryDate)
    })
  })

  const expiringItems = computed(() => {
    return fridgeInventoryWithStatus.value.filter(
      item => item.expiryInfo.status === 'today' || item.expiryInfo.status === 'urgent'
    )
  })

  const expiredItems = computed(() => {
    return fridgeInventoryWithStatus.value.filter(
      item => item.expiryInfo.status === 'expired'
    )
  })

  const fridgeStats = computed(() => {
    const items = fridgeInventoryWithStatus.value
    return {
      total: items.length,
      expiring: expiringItems.value.length,
      expired: expiredItems.value.length,
      categories: [...new Set(items.map(i => i.category))].length
    }
  })

  const groupedFridgeInventory = computed(() => {
    const groups = {}
    categoryOrder.forEach(cat => { groups[cat] = [] })
    
    fridgeInventoryWithStatus.value.forEach(item => {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    })

    const result = []
    categoryOrder.forEach(cat => {
      if (groups[cat] && groups[cat].length > 0) {
        result.push({
          category: cat,
          emoji: categoryEmojis[cat] || '📦',
          items: groups[cat]
        })
      }
    })

    Object.keys(groups).forEach(cat => {
      if (!categoryOrder.includes(cat) && groups[cat].length > 0) {
        result.push({
          category: cat,
          emoji: categoryEmojis[cat] || '📦',
          items: groups[cat]
        })
      }
    })

    return result
  })

  function addFridgeItem(item) {
    const newItem = {
      id: Date.now(),
      name: item.name.trim(),
      quantity: item.quantity,
      unit: item.unit || 'g',
      purchaseDate: item.purchaseDate || new Date().toISOString().split('T')[0],
      expiryDate: item.expiryDate,
      note: item.note || ''
    }
    fridgeInventory.value = [...fridgeInventory.value, newItem]
    return newItem
  }

  function updateFridgeItem(id, updates) {
    const index = fridgeInventory.value.findIndex(item => item.id === id)
    if (index !== -1) {
      const newInventory = [...fridgeInventory.value]
      newInventory[index] = {
        ...newInventory[index],
        ...updates
      }
      fridgeInventory.value = newInventory
    }
  }

  function removeFridgeItem(id) {
    fridgeInventory.value = fridgeInventory.value.filter(item => item.id !== id)
  }

  function clearFridgeInventory() {
    fridgeInventory.value = []
  }

  function removeExpiredItems() {
    fridgeInventory.value = fridgeInventory.value.filter(
      item => getExpiryStatus(item.expiryDate).status !== 'expired'
    )
  }

  const recommendedRecipesForFridge = computed(() => {
    const expiringIngredientNames = expiringItems.value.map(i => i.name)
    
    if (expiringIngredientNames.length === 0) return []

    const scored = recipes.value.map(recipe => {
      const matchedIngredients = recipe.ingredients.filter(ing =>
        expiringIngredientNames.some(name =>
          ing.name.includes(name) || name.includes(ing.name)
        )
      )
      
      const matchedExpiringItems = expiringItems.value.filter(item =>
        recipe.ingredients.some(ing =>
          ing.name.includes(item.name) || item.name.includes(ing.name)
        )
      )
      
      return {
        recipe,
        matchCount: matchedIngredients.length,
        matchedItems: matchedExpiringItems,
        score: matchedIngredients.length * 100 + (100 - recipe.ingredients.length)
      }
    }).filter(r => r.matchCount > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
    return scored
  })

  function useFridgeIngredient(recipeId, ingredientName, amountUsed) {
    const ingredient = fridgeInventory.value.find(item =>
      item.name === ingredientName || ingredientName.includes(item.name)
    )
    if (!ingredient) return
    
    const parsed = parseAmount(amountUsed)
    if (parsed.value !== null && ingredient.quantity !== null) {
      const newQuantity = ingredient.quantity - parsed.value
      if (newQuantity <= 0) {
        removeFridgeItem(ingredient.id)
      } else {
        updateFridgeItem(ingredient.id, { quantity: newQuantity })
      }
    }
  }

  const holidayMenus = ref(HOLIDAY_MENUS)
  const holidayMenuTypes = ref(HOLIDAY_TYPES)
  const selectedHolidayType = ref('all')
  const currentHolidayMenu = ref(null)
  const favoriteHolidayMenus = ref(JSON.parse(localStorage.getItem('favoriteHolidayMenus') || '[]'))

  const filteredHolidayMenus = computed(() => {
    if (selectedHolidayType.value === 'all') {
      return holidayMenus.value
    }
    return holidayMenus.value.filter(menu => menu.type === selectedHolidayType.value)
  })

  const holidayMenusWithRecipes = computed(() => {
    return filteredHolidayMenus.value.map(menu => ({
      ...menu,
      recipes: menu.recipeIds.map(id => recipes.value.find(r => r.id === id)).filter(Boolean)
    }))
  })

  const favoriteHolidayMenusWithRecipes = computed(() => {
    return holidayMenus.value
      .filter(menu => favoriteHolidayMenus.value.includes(menu.id))
      .map(menu => ({
        ...menu,
        recipes: menu.recipeIds.map(id => recipes.value.find(r => r.id === id)).filter(Boolean)
      }))
  })

  function getHolidayMenuById(menuId) {
    const menu = holidayMenus.value.find(m => m.id === menuId)
    if (!menu) return null
    return {
      ...menu,
      recipes: menu.recipeIds.map(id => recipes.value.find(r => r.id === id)).filter(Boolean)
    }
  }

  function setHolidayType(type) {
    selectedHolidayType.value = type
  }

  function setCurrentHolidayMenu(menuId) {
    currentHolidayMenu.value = menuId ? getHolidayMenuById(menuId) : null
  }

  function toggleHolidayMenuFavorite(menuId) {
    const index = favoriteHolidayMenus.value.indexOf(menuId)
    if (index === -1) {
      favoriteHolidayMenus.value.push(menuId)
    } else {
      favoriteHolidayMenus.value.splice(index, 1)
    }
    localStorage.setItem('favoriteHolidayMenus', JSON.stringify(favoriteHolidayMenus.value))
  }

  function isHolidayMenuFavorite(menuId) {
    return favoriteHolidayMenus.value.includes(menuId)
  }

  function addHolidayMenuToFavorites(menuId) {
    const menu = getHolidayMenuById(menuId)
    if (!menu) return { added: 0, already: 0 }
    let addedCount = 0
    let alreadyCount = 0
    menu.recipes.forEach(recipe => {
      if (!favorites.value.includes(recipe.id)) {
        toggleFavorite(recipe.id)
        addedCount++
      } else {
        alreadyCount++
      }
    })
    if (!favoriteHolidayMenus.value.includes(menuId)) {
      favoriteHolidayMenus.value.push(menuId)
      localStorage.setItem('favoriteHolidayMenus', JSON.stringify(favoriteHolidayMenus.value))
    }
    return { added: addedCount, already: alreadyCount, total: menu.recipes.length }
  }

  function addHolidayMenuToShoppingList(menuId) {
    const menu = getHolidayMenuById(menuId)
    if (!menu) return { added: 0, already: 0 }
    const recipeIds = menu.recipes.map(r => r.id)
    let addedCount = 0
    let alreadyCount = 0
    recipeIds.forEach(id => {
      if (!shoppingListSelectedRecipes.value.includes(id)) {
        shoppingListSelectedRecipes.value.push(id)
        addedCount++
      } else {
        alreadyCount++
      }
    })
    saveShoppingListSelection()
    return { added: addedCount, already: alreadyCount, total: recipeIds.length, recipeIds }
  }

  function getHolidayMenuStats(menuId) {
    const menu = getHolidayMenuById(menuId)
    if (!menu) return null

    const totalPrepTime = menu.recipes.reduce((sum, r) => sum + r.prepTime, 0)
    const totalCookTime = menu.recipes.reduce((sum, r) => sum + r.cookTime, 0)
    const totalServings = menu.recipes.reduce((sum, r) => sum + r.servings, 0)

    const ingredientMap = {}
    menu.recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        const key = ing.name
        const parsed = parseAmount(ing.amount)
        
        if (!ingredientMap[key]) {
          ingredientMap[key] = {
            name: ing.name,
            totalValue: parsed.value,
            unit: parsed.unit,
            category: getCategory(ing.name),
            notes: [],
            fromRecipes: []
          }
        } else {
          if (parsed.value !== null && ingredientMap[key].totalValue !== null) {
            if (parsed.unit === ingredientMap[key].unit) {
              ingredientMap[key].totalValue += parsed.value
            } else {
              ingredientMap[key].totalValue = null
              ingredientMap[key].unit = '请参考各食谱用量'
            }
          } else {
            ingredientMap[key].totalValue = null
          }
        }
        
        if (ing.note && !ingredientMap[key].notes.includes(ing.note)) {
          ingredientMap[key].notes.push(ing.note)
        }
        if (!ingredientMap[key].fromRecipes.includes(recipe.name)) {
          ingredientMap[key].fromRecipes.push(recipe.name)
        }
      })
    })

    const ingredientsList = Object.values(ingredientMap)
    const groups = {}
    categoryOrder.forEach(cat => { groups[cat] = [] })
    ingredientsList.forEach(ing => {
      if (!groups[ing.category]) groups[ing.category] = []
      groups[ing.category].push({
        ...ing,
        displayAmount: formatAmount(ing.totalValue, ing.unit)
      })
    })

    const groupedIngredients = []
    categoryOrder.forEach(cat => {
      if (groups[cat] && groups[cat].length > 0) {
        groupedIngredients.push({
          category: cat,
          emoji: categoryEmojis[cat] || '📦',
          items: groups[cat].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
        })
      }
    })

    Object.keys(groups).forEach(cat => {
      if (!categoryOrder.includes(cat) && groups[cat].length > 0) {
        groupedIngredients.push({
          category: cat,
          emoji: categoryEmojis[cat] || '📦',
          items: groups[cat].sort((a, b) => a.name.localeCompare(b.name, 'zh'))
        })
      }
    })

    return {
      totalPrepTime,
      totalCookTime,
      totalTime: totalPrepTime + totalCookTime,
      totalServings,
      recipeCount: menu.recipes.length,
      ingredientCount: ingredientsList.length,
      ingredients: ingredientsList,
      groupedIngredients
    }
  }

  const trainingStages = computed(() => TRAINING_STAGES)
  const skills = computed(() => SKILLS)
  const achievements = computed(() => ACHIEVEMENTS)

  const trainingStats = computed(() => {
    const completedTaskIds = trainingCompletedTasks.value
    const completedTaskSet = new Set(completedTaskIds)
    
    const completedStages = TRAINING_STAGES.filter(stage => 
      stage.tasks.every(task => completedTaskSet.has(task.id))
    ).map(s => s.id)

    const unlockedSkillIds = new Set()
    TRAINING_STAGES.forEach(stage => {
      stage.tasks.forEach(task => {
        if (completedTaskSet.has(task.id)) {
          task.skills.forEach(skillId => unlockedSkillIds.add(skillId))
        }
      })
    })

    const totalTasks = TRAINING_STAGES.reduce((sum, stage) => sum + stage.tasks.length, 0)
    const progress = totalTasks > 0 ? Math.round((completedTaskIds.length / totalTasks) * 100) : 0

    const currentLevel = completedStages.length

    return {
      completedTasks: completedTaskIds.length,
      totalTasks,
      progress,
      completedStages,
      currentLevel,
      unlockedSkills: Array.from(unlockedSkillIds)
    }
  })

  const trainingStagesWithProgress = computed(() => {
    const completedTaskSet = new Set(trainingCompletedTasks.value)
    
    return TRAINING_STAGES.map(stage => {
      const completedTasks = stage.tasks.filter(task => completedTaskSet.has(task.id))
      const isUnlocked = stage.unlockLevel <= trainingStats.value.currentLevel
      const isCompleted = stage.tasks.every(task => completedTaskSet.has(task.id))
      const progress = stage.tasks.length > 0 
        ? Math.round((completedTasks.length / stage.tasks.length) * 100) 
        : 0

      return {
        ...stage,
        isUnlocked,
        isCompleted,
        progress,
        completedCount: completedTasks.length,
        totalCount: stage.tasks.length,
        tasks: stage.tasks.map(task => ({
          ...task,
          isCompleted: completedTaskSet.has(task.id),
          completedAt: trainingCompletedAt.value[task.id] || null,
          recipe: recipes.value.find(r => r.id === task.recipeId)
        }))
      }
    })
  })

  const unlockedAchievements = computed(() => {
    const stats = trainingStats.value
    return ACHIEVEMENTS.filter(a => a.condition(stats))
  })

  const newlyUnlockedAchievements = computed(() => {
    const allUnlocked = unlockedAchievements.value.map(a => a.id)
    return allUnlocked.filter(id => !trainingUnlockedAchievements.value.includes(id))
  })

  const skillsWithProgress = computed(() => {
    const unlockedSet = new Set(trainingStats.value.unlockedSkills)
    return Object.values(SKILLS).map(skill => ({
      ...skill,
      isUnlocked: unlockedSet.has(skill.id)
    }))
  })

  function isTrainingTaskCompleted(taskId) {
    return trainingCompletedTasks.value.includes(taskId)
  }

  function completeTrainingTask(taskId) {
    if (!trainingCompletedTasks.value.includes(taskId)) {
      trainingCompletedTasks.value = [...trainingCompletedTasks.value, taskId]
      trainingCompletedAt.value = {
        ...trainingCompletedAt.value,
        [taskId]: new Date().toISOString()
      }
      saveTrainingProgress()
      
      const newAchievements = checkAchievements()
      return newAchievements
    }
    return []
  }

  function uncompleteTrainingTask(taskId) {
    const index = trainingCompletedTasks.value.indexOf(taskId)
    if (index > -1) {
      const newTasks = [...trainingCompletedTasks.value]
      newTasks.splice(index, 1)
      trainingCompletedTasks.value = newTasks
      
      const newCompletedAt = { ...trainingCompletedAt.value }
      delete newCompletedAt[taskId]
      trainingCompletedAt.value = newCompletedAt
      
      saveTrainingProgress()
    }
  }

  function saveTrainingProgress() {
    localStorage.setItem('trainingCompletedTasks', JSON.stringify(trainingCompletedTasks.value))
    localStorage.setItem('trainingCompletedAt', JSON.stringify(trainingCompletedAt.value))
  }

  function checkAchievements() {
    const newUnlocked = newlyUnlockedAchievements.value
    if (newUnlocked.length > 0) {
      trainingUnlockedAchievements.value = [
        ...trainingUnlockedAchievements.value,
        ...newUnlocked
      ]
      localStorage.setItem('trainingUnlockedAchievements', JSON.stringify(trainingUnlockedAchievements.value))
    }
    return newUnlocked
  }

  function resetTrainingProgress() {
    trainingCompletedTasks.value = []
    trainingCompletedAt.value = {}
    trainingUnlockedAchievements.value = []
    localStorage.removeItem('trainingCompletedTasks')
    localStorage.removeItem('trainingCompletedAt')
    localStorage.removeItem('trainingUnlockedAchievements')
  }

  function getTaskRecipe(task) {
    return recipes.value.find(r => r.id === task.recipeId)
  }

  function setLeftoverCategory(category) {
    selectedLeftoverCategory.value = category
  }

  function toggleLeftoverIngredient(ingredientId) {
    const index = selectedLeftoverIngredients.value.indexOf(ingredientId)
    if (index === -1) {
      selectedLeftoverIngredients.value = [...selectedLeftoverIngredients.value, ingredientId]
    } else {
      selectedLeftoverIngredients.value = selectedLeftoverIngredients.value.filter(id => id !== ingredientId)
    }
    saveSelectedLeftoverIngredients()
  }

  function isLeftoverSelected(ingredientId) {
    return selectedLeftoverIngredients.value.includes(ingredientId)
  }

  function clearSelectedLeftovers() {
    selectedLeftoverIngredients.value = []
    saveSelectedLeftoverIngredients()
  }

  function saveSelectedLeftoverIngredients() {
    localStorage.setItem('selectedLeftoverIngredients', JSON.stringify(selectedLeftoverIngredients.value))
  }

  function getLeftoverRecipeById(id) {
    return LEFTOVER_RECIPES.find(r => r.id === Number(id))
  }

  function getLowFatRecipeById(id) {
    return lowFatRecipes.find(r => r.id === Number(id))
  }

  function toggleFatLossDayComplete(dayNumber) {
    const index = fatLossCompletedDays.value.indexOf(dayNumber)
    if (index === -1) {
      fatLossCompletedDays.value = [...fatLossCompletedDays.value, dayNumber]
    } else {
      fatLossCompletedDays.value = fatLossCompletedDays.value.filter(d => d !== dayNumber)
    }
    saveFatLossProgress()
  }

  function isFatLossDayComplete(dayNumber) {
    return fatLossCompletedDays.value.includes(dayNumber)
  }

  function resetFatLossProgress() {
    fatLossCompletedDays.value = []
    localStorage.removeItem('fatLossCompletedDays')
  }

  function saveFatLossProgress() {
    localStorage.setItem('fatLossCompletedDays', JSON.stringify(fatLossCompletedDays.value))
  }

  function addFatLossRecipeToMealPlan(dateKey, mealType, recipeId) {
    addRecipeToMeal(dateKey, mealType, recipeId)
  }

  function addFatLossDayToShoppingList(dayPlan) {
    const recipeIds = [
      ...dayPlan.breakfast,
      ...dayPlan.lunch,
      ...dayPlan.dinner,
      ...dayPlan.snack
    ]
    addRecipesToShoppingList(recipeIds)
  }

  function addFatLossWeekToShoppingList() {
    const recipeIds = new Set()
    FAT_LOSS_WEEK_PLAN.forEach(day => {
      day.breakfast.forEach(id => recipeIds.add(id))
      day.lunch.forEach(id => recipeIds.add(id))
      day.dinner.forEach(id => recipeIds.add(id))
      day.snack.forEach(id => recipeIds.add(id))
    })
    addRecipesToShoppingList(Array.from(recipeIds))
  }

  function saveCookingProgress(recipeId, progress) {
    const recipeKey = String(recipeId)
    cookingProgress.value[recipeKey] = {
      ...progress,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('cookingProgress', JSON.stringify(cookingProgress.value))
  }

  function getCookingProgress(recipeId) {
    const recipeKey = String(recipeId)
    return cookingProgress.value[recipeKey] || null
  }

  function clearCookingProgress(recipeId) {
    const recipeKey = String(recipeId)
    if (cookingProgress.value[recipeKey]) {
      delete cookingProgress.value[recipeKey]
      localStorage.setItem('cookingProgress', JSON.stringify(cookingProgress.value))
    }
  }

  function hasCookingProgress(recipeId) {
    const recipeKey = String(recipeId)
    const progress = cookingProgress.value[recipeKey]
    return progress && !progress.isFinished
  }

  function getActiveCookingRecipes() {
    return Object.entries(cookingProgress.value)
      .filter(([_, progress]) => !progress.isFinished)
      .map(([recipeId, progress]) => ({
        recipeId: Number(recipeId),
        ...progress
      }))
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
  }

  return {
    recipes,
    favorites,
    timers,
    searchQuery,
    selectedCategory,
    currentPage,
    pageSize,
    homeScrollPosition,
    weekDates,
    mealPlan,
    mealPlanWithRecipes,
    weekPlanSummary,
    filteredRecipes,
    searchSuggestions,
    paginatedRecipes,
    totalPages,
    favoriteRecipes,
    favoriteCount,
    compareRecipes,
    compareRecipeObjects,
    compareCount,
    activeTimers,
    shoppingListSelectedRecipes,
    shoppingListSelectedRecipeObjects,
    mergedIngredients,
    groupedIngredients,
    shoppingListStats,
    shoppingListCheckedItems,
    dinnerPartyPeople,
    dinnerPartyTaste,
    dinnerPartyPlan,
    dinnerPartyHistory,
    tastePreferences,
    recipesWithClassification,
    fridgeInventory,
    fridgeInventoryWithStatus,
    expiringItems,
    expiredItems,
    fridgeStats,
    groupedFridgeInventory,
    recommendedRecipesForFridge,
    toggleFavorite,
    isFavorite,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
    getRecipeById,
    setCategory,
    setSearch,
    setPage,
    setScrollPosition,
    addTimer,
    addCompletedTimer,
    removeTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimerRemaining,
    getDaySummary,
    addRecipeToMeal,
    removeRecipeFromMeal,
    moveRecipe,
    clearDayPlan,
    clearWeekPlan,
    isRecipeInPlan,
    toggleRecipeForShoppingList,
    addRecipesToShoppingList,
    removeRecipeFromShoppingList,
    clearShoppingListRecipes,
    toggleIngredientChecked,
    setIngredientChecked,
    checkAllIngredients,
    uncheckAllIngredients,
    isRecipeSelectedForShopping,
    isIngredientChecked,
    addMealPlanToShoppingList,
    generateDinnerParty,
    regenerateDinnerParty,
    clearDinnerPartyPlan,
    addDinnerPartyToHistory,
    clearDinnerPartyHistory,
    setDinnerPartyPeople,
    setDinnerPartyTaste,
    addDinnerPartyToShoppingList,
    addDinnerPartyRecipesToMealPlan,
    addFridgeItem,
    updateFridgeItem,
    removeFridgeItem,
    clearFridgeInventory,
    removeExpiredItems,
    getExpiryStatus,
    useFridgeIngredient,
    holidayMenus,
    holidayMenuTypes,
    selectedHolidayType,
    currentHolidayMenu,
    favoriteHolidayMenus,
    filteredHolidayMenus,
    holidayMenusWithRecipes,
    favoriteHolidayMenusWithRecipes,
    getHolidayMenuById,
    setHolidayType,
    setCurrentHolidayMenu,
    toggleHolidayMenuFavorite,
    isHolidayMenuFavorite,
    addHolidayMenuToFavorites,
    addHolidayMenuToShoppingList,
    getHolidayMenuStats,
    trainingStages,
    skills,
    achievements,
    trainingStats,
    trainingStagesWithProgress,
    unlockedAchievements,
    newlyUnlockedAchievements,
    skillsWithProgress,
    trainingCompletedTasks,
    trainingCompletedAt,
    trainingUnlockedAchievements,
    isTrainingTaskCompleted,
    completeTrainingTask,
    uncompleteTrainingTask,
    checkAchievements,
    resetTrainingProgress,
    getTaskRecipe,
    leftoverCategories,
    leftoverIngredients,
    allLeftoverIngredients,
    allLeftoverRecipes,
    selectedLeftoverCategory,
    selectedLeftoverIngredients,
    selectedLeftoverIngredientObjects,
    selectedLeftoverCount,
    recommendedLeftoverRecipes,
    setLeftoverCategory,
    toggleLeftoverIngredient,
    isLeftoverSelected,
    clearSelectedLeftovers,
    getLeftoverRecipeById,
    lowFatRecipesList,
    fatLossTips,
    fatLossNutrientGoals,
    fatLossWeekPlan,
    fatLossWeekNutrition,
    fatLossStats,
    fatLossCompletedDays,
    getLowFatRecipeById,
    toggleFatLossDayComplete,
    isFatLossDayComplete,
    resetFatLossProgress,
    addFatLossRecipeToMealPlan,
    addFatLossDayToShoppingList,
    addFatLossWeekToShoppingList,
    cookingProgress,
    saveCookingProgress,
    getCookingProgress,
    clearCookingProgress,
    hasCookingProgress,
    getActiveCookingRecipes
  }
}, {
  persist: {
    key: 'recipe-book-store',
    storage: localStorage,
    paths: [
      'timers',
      'favorites',
      'mealPlan',
      'shoppingListSelectedRecipes',
      'shoppingListCheckedItems',
      'fridgeInventory',
      'trainingCompletedTasks',
      'trainingCompletedAt',
      'trainingUnlockedAchievements',
      'compareRecipes',
      'fatLossCompletedDays',
      'searchQuery',
      'selectedCategory',
      'currentPage',
      'homeScrollPosition'
    ]
  }
})
