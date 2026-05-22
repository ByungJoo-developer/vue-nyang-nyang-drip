import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/supabase' // 대표님이 프로젝트에 만들어두신 수파베이스 인스턴스 경로

// 1. 연결할 컴포넌트들을 임포트합니다.
import MainView from '../views/main/MainView.vue' // 메인 화면
import BoardListView from '@/views/board/BoardListView.vue' // 게시판 리스트
import BoardDetailView from '@/views/board/BoardDetailView.vue' // 게시판 상세
import BoardEditView from '@/views/board/BoardEditView.vue' // 게시판 수정

// 2. URL 경로와 컴포넌트를 매핑합니다.
const routes = [
  { path: '/', redirect: '/main' }, // 첫페이지
  { path: '/main', name: 'Main', component: MainView }, // 메인페이지

  // 최신드립 게시판 리스트
  {
    path: '/latest',
    name: 'LatestBoardList',
    component: BoardListView,
    // 💡 props를 오브젝트 형태로 선언하여 값을 고정으로 넘겨줍니다.
    props: { boardMstId: '2026052000000001' },
  },

  // 냥냥드립 게시판 리스트
  {
    path: '/hall',
    name: 'HallBoardList',
    component: BoardListView,
    // 💡 props를 오브젝트 형태로 선언하여 값을 고정으로 넘겨줍니다.
    props: { boardMstId: '2026052000000002' },
  },

  //게시판 상세
  {
    path: '/board/boardDetail', // 경로에서 두 개의 파라미터를 받겠다고 정의
    name: 'BoardDetail',
    component: BoardDetailView,
  },
  {
    // 💡 수정 페이지 호출을 위한 라우터 등록
    path: '/board/edit',
    name: 'BoardEdit',
    component: BoardEditView,
    meta: { requiresAuth: true }, // 로그인 필수 여부
  },
]

const router = createRouter({
  history: createWebHistory(), // 깔끔한 URL 주소를 위해 사용 (Java의 깔끔한 URL 매핑 방식)
  routes,
})

// router/index.js 파일 내부에 추가
router.beforeEach(async (to, from, next) => {
  // 💡 주소창에 ?code=가 붙어있으면 낚아채서 URL을 깔끔하게 바꿉니다.
  if (window.location.search.includes('code=')) {
    const cleanUrl = window.location.origin + window.location.pathname
    window.history.replaceState({}, document.title, cleanUrl)
  }

  // 특정 페이지에서 테스트를 강제하고 싶다면 아래와 같이 작성하세요.
  const isLocal = window.location.hostname === 'localhost'

  if (isLocal) {
    console.log('개발 모드: 로그인 검증 건너뜀')
    next()
  }

  // 기존 로직들...
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      alert('구글 로그인이 필요한 서비스다냥! 🐾')
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
