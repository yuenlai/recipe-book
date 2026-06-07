import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RecipeDetail from '../views/RecipeDetail.vue'
import Favorites from '../views/Favorites.vue'
import TimerPage from '../views/TimerPage.vue'
import MealPlan from '../views/MealPlan.vue'
import ShoppingList from '../views/ShoppingList.vue'
import CookingMode from '../views/CookingMode.vue'
import DinnerParty from '../views/DinnerParty.vue'
import FridgeInventory from '../views/FridgeInventory.vue'
import HolidayMenus from '../views/HolidayMenus.vue'
import TrainingCamp from '../views/TrainingCamp.vue'
import RecipeCompare from '../views/RecipeCompare.vue'
import LeftoverReuse from '../views/LeftoverReuse.vue'
import LeftoverDetail from '../views/LeftoverDetail.vue'
import Breakfast from '../views/Breakfast.vue'
import FatLossPlan from '../views/FatLossPlan.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recipe/:id',
    name: 'RecipeDetail',
    component: RecipeDetail,
    props: true
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  {
    path: '/timers',
    name: 'Timers',
    component: TimerPage
  },
  {
    path: '/meal-plan',
    name: 'MealPlan',
    component: MealPlan
  },
  {
    path: '/shopping-list',
    name: 'ShoppingList',
    component: ShoppingList
  },
  {
    path: '/dinner-party',
    name: 'DinnerParty',
    component: DinnerParty
  },
  {
    path: '/recipe/:id/cooking',
    name: 'CookingMode',
    component: CookingMode,
    props: true
  },
  {
    path: '/fridge',
    name: 'FridgeInventory',
    component: FridgeInventory
  },
  {
    path: '/holiday-menus',
    name: 'HolidayMenus',
    component: HolidayMenus
  },
  {
    path: '/training-camp',
    name: 'TrainingCamp',
    component: TrainingCamp
  },
  {
    path: '/compare',
    name: 'RecipeCompare',
    component: RecipeCompare
  },
  {
    path: '/leftover',
    name: 'LeftoverReuse',
    component: LeftoverReuse
  },
  {
    path: '/leftover/:id',
    name: 'LeftoverDetail',
    component: LeftoverDetail,
    props: true
  },
  {
    path: '/breakfast',
    name: 'Breakfast',
    component: Breakfast
  },
  {
    path: '/fat-loss',
    name: 'FatLossPlan',
    component: FatLossPlan
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
