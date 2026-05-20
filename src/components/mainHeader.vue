<template>
  <header class="main-header">
    <div class="logo">🐱 냥냥 드립</div>
    <nav class="nav-links">
      <a href="#">홈</a>
      <a href="#">최신 드립</a>
      <a href="#">명예의 전당</a>
    </nav>
    <div class="user-menu">
      <button>로그인</button>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #ffffff;
  border-bottom: 2px solid #e0e7ff;
}
.logo { font-size: 1.5rem; font-weight: bold; color: #334155; }
.nav-links a { margin: 0 15px; text-decoration: none; color: #64748b; font-weight: 500; }
.nav-links a:hover { color: #5d9cec; }
</style>