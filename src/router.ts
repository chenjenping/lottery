import { createWebHistory, createRouter } from 'vue-router'

import PrizeBoard from './components/PrizeBoard.vue'
import PrizeDraw from './components/PrizeDraw.vue'

const routes = [
  { path: '/', component: PrizeBoard },
  { path: '/draw', component: PrizeDraw },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;