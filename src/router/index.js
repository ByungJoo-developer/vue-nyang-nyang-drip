import { createRouter, createWebHistory } from 'vue-router'

// 1. 연결할 컴포넌트들을 임포트합니다.
import MainView         from '../views/main/MainView.vue'
import BoardListView    from '@/views/board/BoardListView.vue';
import BoardDetailView  from '@/views/board/BoardDetailView.vue';


// 2. URL 경로와 컴포넌트를 매핑합니다.
const routes = [
  { path: '/', redirect: '/main' },                                     // 첫페이지
  { path: '/main',    name: 'Main', component: MainView },              // 메인페이지
  
  // 최신드립 게시판
  { 
    path: '/latest',  
    name: 'BoardList', 
    component: BoardListView,
    // 💡 props를 오브젝트 형태로 선언하여 값을 고정으로 넘겨줍니다.
    props: { boardMstId: '2026052000000001' } 
  },                         
  
  //게시판 상세                                                                      
  {                                                 
    path: '/board/boardDetail/:boardMstId/:boardId', // 경로에서 두 개의 파라미터를 받겠다고 정의
    name: 'BoardDetail',
    component: (BoardDetailView )
  }
]

const router = createRouter({
  history: createWebHistory(), // 깔끔한 URL 주소를 위해 사용 (Java의 깔끔한 URL 매핑 방식)
  routes,
})

export default router
