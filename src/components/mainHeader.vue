<template>
  <header class="main-header">
    <div class="header-top">
      <div class="logo">🐱 냥냥 드립</div>
      
      <div class="search-container">
        <input type="text" placeholder="검색어를 입력하냥">
        <button>🔍</button>
      </div>

      <div class="user-menu">
        <button class="btn-login">로그인</button>
      </div>
    </div>

    <nav class="nav-links">
      <router-link to="/main">🏠 홈</router-link>
      <router-link to="/latest">🔥 최신 드립</router-link>
<!--
      <router-link to="/hall">🏆 명예의 전당</router-link>
-->
    </nav>
  </header>
</template>

<style scoped>
/* ==========================================================================
   💻 PC 환경 기본 스타일 (mainHeader 하나로 상단+좌측을 다 먹는 구조)
   ========================================================================== */

/* 1. 상단 바 영역 (로고, 검색, 로그인 가로 배정) */
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 40px;
  background-color: #ffffff;
  border-bottom: 2px solid #e0e7ff;
  position: fixed; /* 상단 고정 */
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  box-sizing: border-box;
  z-index: 1000;
}

.logo {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1e293b;
}

.search-container {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 20px;
  padding: 4px 12px;
}

.search-container input {
  border: none;
  background: transparent;
  padding: 6px 10px;
  outline: none;
  font-size: 0.9rem;
  width: 240px;
}

.search-container button {
  background: none;
  border: none;
  cursor: pointer;
}

.btn-login {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

/* 2. ⭐️ 핵심: 헤더 파일 안에 들어있지만, 좌측 고정 세로 메뉴판으로 탈바꿈 */
.nav-links {
  position: fixed;         /* 화면에 딱 고정 */
  top: 70px;               /* 상단 헤더 높이만큼 띄우고 */
  left: 0;
  width: 240px;            /* 좌측 메뉴판 너비 지정 */
  bottom: 0;               /* 바닥까지 늘리기 */
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 30px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;  /* ◀ 위에서 아래로 세로 정렬!! */
  gap: 12px;
  z-index: 999;
}

.nav-links a {
  display: block;
  padding: 12px 20px;
  color: #475569;
  text-decoration: none;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background-color: #f1f5f9;
  color: #4f46e5;
}


/* ==========================================================================
   📱 모바일 환경 반응형 스타일 (화면폭 768px 이하)
   ========================================================================== */
@media (max-width: 768px) {
  /* 상단 바 고정을 풀고 유연하게 쌓이도록 변경 */
  .header-top {
    position: relative;
    height: auto;
    padding: 15px 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .search-container {
    order: 3;
    width: 100%;
  }

  /* ⭐️ 핵심: 좌측 세로 고정이었던 메뉴판을 상단 가로줄 메뉴로 원상복구 */
  .nav-links {
    position: relative;    /* fixed 고정 해제 */
    top: 0;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 10px 20px;
    flex-direction: row;   /* ◀ 다시 가로 정렬로 변경!! */
    justify-content: space-around;
  }

  .nav-links a {
    padding: 8px 12px;
    font-size: 0.95rem;
  }
}
</style>