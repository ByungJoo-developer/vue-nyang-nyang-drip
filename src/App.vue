<template>
  <div class="app-wrapper">
    <mainHeader /> 

    <div class="main-container">
      <main class="content">
        <router-view />
      </main>
    </div>

    <mainFooter />
  </div>
</template>

<script setup>
import mainHeader from './components/mainHeader.vue'
import mainFooter from './components/mainFooter.vue'
</script>

<style>
body {
  margin: 0;
  font-family: 'Malgun Gothic', sans-serif;
  background-color: #f8fafc;
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-container {
  display: flex;
  flex: 1;
}

/* 💻 PC 화면 본문 영역 스타일 */
.content {
  flex: 1;
/* 💡 기존 좌측 여백(280px)은 유지하고, 
     상단 여백을 헤더 높이(70px)보다 넉넉하게 '110px' 정도로 늘려줍니다! */
  padding: 70px 40px 40px 280px;
  box-sizing: border-box;
}

/* 📱 모바일 환경 일 때 여백 리셋 */
@media (max-width: 768px) {
  .content {
    /* 모바일에서는 헤더 메뉴가 위로 올라가므로 좌측 여백을 없애줍니다 */
    padding: 20px 15px; 
  }
}
</style>