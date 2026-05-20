<template>
  <div class="resume-app">
    <mainHeader :currentView="view" @change-view="view = $event" />

    <main class="main-content">
      <div class="content-body">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <mainFooter />
    </main>
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
/* 1. 최상위 루트부터 높이 100% 강제 고정 */
html,
body,
#app {
  margin: 0 !important;
  padding: 0 !important;
  height: 100% !important;
  width: 100% !important;
  overflow: hidden !important; /* 전체 스크롤 원천 봉쇄 */
}

/* 2. 전체 앱 컨테이너 */
.resume-app {
  display: flex !important;
  flex-direction: row !important; /* 기본 가로 배치 (메뉴|본문) */
  height: 100% !important;
  width: 100% !important;
}

/* 3. 본문 영역: 여기가 핵심입니다 */
.main-content {
  flex: 1 !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important; /* 여기는 hidden이어야 본문 스크롤만 남습니다 */
}

.content-body {
  flex: 1 !important;
  /* overflow-y: auto; <-- 이 부분을 아래처럼 수정하세요 */
  overflow-y: overlay; /* 스크롤바가 화면 폭을 차지하지 않게 해서 꿀렁거림 방지 */
  padding: 40px;
  background-color: #ffffff;

  /* 박스 크기 계산 방식 고정 (패딩 때문에 커지는 것 방지) */
  box-sizing: border-box !important;
}

/* 스크롤바 자체를 아주 얇게 만들거나, 내용이 적을 땐 안 보이게 처리 */
.content-body::-webkit-scrollbar {
  width: 6px;
}
.content-body::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

/* --- [모바일 대응: 768px 이하] --- */
@media (max-width: 768px) {
  .resume-app {
    flex-direction: column !important; /* 메뉴가 위로, 본문이 아래로 */
  }

  /* 모바일에서 메뉴 높이가 너무 크면 본문이 안 보이니 주의! */
  .main-content {
    flex: 1 !important;
    height: auto !important; /* 모바일은 내용에 따라 늘어나게 */
    overflow-y: visible !important;
  }

  html,
  body,
  #app {
    overflow: auto !important; /* 모바일은 전체 스크롤이 더 편함 */
    height: auto !important;
  }

  .content-body {
    padding: 20px 15px;
  }
}
</style>
