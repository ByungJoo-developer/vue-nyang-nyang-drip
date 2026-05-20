import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'

// 1. 연결할 컴포넌트들을 임포트합니다.
import MainView from '../views/contents/MainView.vue'
import BoardView from '../views/contents/BoardView.vue'
import BoardDetailView from '../views/contents/BoardDetailView.vue'
import TarotView from '../views/contents/TarotView.vue'

// 2. URL 경로와 컴포넌트를 매핑합니다.
const routes = [
  { path: '/', redirect: '/tarot' },
  { path: '/main', name: 'Main', component: MainView },
  { path: '/board', name: 'Board', component: BoardView },
  { path: '/tarot', name: 'Tarot', component: TarotView },
  {
    path: '/board/:id', // :id는 변수입니다. (Path Variable)
    name: 'BoardDetail',
    component: BoardDetailView,
    props: true, // URL 파라미터를 컴포넌트의 props로 전달합니다.
  },
]

const router = createRouter({
  history: createWebHistory(), // 깔끔한 URL 주소를 위해 사용 (Java의 깔끔한 URL 매핑 방식)
  routes,
})

export default router
