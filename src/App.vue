<template>
  <div class="app-wrapper">
    <mainHeader /> 

    <div class="main-container">
      <nav class="sidebar">
        <ul>
          <li>🏠 홈</li>
          <li>🔥 최신 드립</li>
          <li>🏆 명예의 전당</li>
        </ul>
      </nav>

      <main class="content">
        <router-view />
      </main>
    </div>

    <mainFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 1. 분리한 컴포넌트들을 불러옵니다.
import mainHeader from './components/mainHeader.vue'
import mainFooter from './components/mainFooter.vue'

const view = ref('main') // 최초 view 정의
const selectedPost = ref(null) // 선택된 게시글 데이터를 저장할 DTO

// 가상 데이터 (원래는 서버에서 가져올 값)
const mockData = ref([
  {
    id: 3,
    title: 'Vue3 프로젝트 아키텍처 설계',
    writer: '김병주',
    date: '2026-04-28',
    views: 12,
    content: 'Vue3와 Spring Boot를 연동하는 아키텍처는...',
  },
  {
    id: 2,
    title: 'C#과 Vue3의 차이점',
    writer: '관리자',
    date: '2026-04-27',
    views: 45,
    content: 'C#은 강한 타입 체크를 하지만 Vue는...',
  },
  {
    id: 1,
    title: '시니어 개발자의 도전',
    writer: '김병주',
    date: '2026-04-26',
    views: 89,
    content: 'jQuery에 익숙한 시니어들에게 Vue란...',
  },
])

// 상세 보기 클릭 시 실행
const handleShowDetail = (post) => {
  selectedPost.value = post // 선택된 데이터 저장
  view.value = 'detail' // 화면 전환
}

const handleViewChange = (newView) => {
  view.value = newView
}
</script>

<style>
/* 1. 전체 화면을 위아래로 쌓는 박스 */
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 2. 사이드바와 본문을 가로로 배치하는 박스 */
.main-container {
  display: flex; /* 이게 없으면 가로 배치가 안 됩니다 */
  flex: 1; /* 남은 공간을 다 차지함 */
}

.sidebar {
  width: 200px; /* 고정 크기 */
  background: #f8fafc;
}

.content {
  flex: 1; /* 나머지 공간 전부 차지 */
  padding: 40px;
}

/* 3. 모바일일 때만 세로로 바꾸기 */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column; /* 세로로 쌓음 */
  }
  .sidebar {
    width: 100%; /* 너비 100% */
  }
}
</style>