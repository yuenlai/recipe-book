import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RecipeDetail from '../views/RecipeDetail.vue'
import Favorites from '../views/Favorites.vue'
import TimerPage from '../views/TimerPage.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
