<template>
  <header class="main-header">
    <div class="logo">🐱 냥냥 드립</div>
    
    <div class="header-center">
      <nav class="nav-links">
        <router-link to="/">홈</router-link>
        <router-link to="/latest">최신 드립</router-link>
        <router-link to="/hall">명예의 전당</router-link>
      </nav>
      <div class="search-container">
        <input type="text" placeholder="검색어를 입력하냥">
        <button>🔍</button>
      </div>
    </div>

    <div class="user-menu">
      <button>로그인</button>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  display: flex;
  align-items: center;
  padding: 15px 30px;
  background-color: #ffffff;
  border-bottom: 2px solid #e0e7ff;
  justify-content: space-between; /* 로고, 센터박스, 로그인버튼을 크게 3등분 */
}

/* 메뉴와 검색창을 가깝게 붙임 */
.header-center {
  display: flex;
  align-items: center;
  gap: 20px; /* 여기서 숫자를 줄이면 메뉴와 검색창이 더 가까워집니다 */
}

.nav-links {
  display: flex;
  gap: 15px; /* 메뉴 항목 간 간격 */
}

.nav-links a {
  text-decoration: none;
  color: #64748b;
}


@media (max-width: 768px) {
  /* 1. 헤더 전체를 세로 정렬로 변경 */
.main-header {
    flex-direction: column;
    align-items: flex-start; /* 핵심: 로고와 전체 내용을 왼쪽 정렬 */
    padding: 20px;
  }

  .logo {
    align-self: flex-start; /* 로고만 강제로 왼쪽 고정 */
    margin-bottom: 10px;
  }

  /* 2. 중앙 컨테이너(메뉴 + 검색)도 세로로 변경 */
  .header-center {
    flex-direction: column;
    align-items: flex-start; /* 핵심: 로고와 전체 내용을 왼쪽 정렬 */
    gap: 10px;
    width: 100%;
  }

  /* 3. 메뉴 링크들도 세로로 */
  .nav-links {
    flex-direction: row;     /* 한줄로 나열 */
    align-items: center;
    gap: 10px;
  }

  /* 4. 검색창 너비 100%로 확장 */
  .search-container {
    width: 60%;
    justify-content: center;
  }
  
  .search-container input {
    width: 70%;
  }

  /* 로그인 버튼에 위쪽 여백을 추가 */
  .user-menu {
    margin-top: 15px; /* 이 수치를 조절하여 간격을 늘리거나 줄이세요 */
  }

}

</style>