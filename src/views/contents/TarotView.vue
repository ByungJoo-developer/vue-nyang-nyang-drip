<template>
<div class="nyang-container">
<!--  <nav class="sidebar">
    <div class="logo">🐱 냥냥 드립</div>
    <ul>
      <li>🏠 홈</li>
      <li>🔥 최신 드립</li>
      <li>🏆 명예의 전당</li>
    </ul>
  </nav>

  <main class="content">
    <header class="search-bar">
      <input type="text" placeholder="어떤 드립을 찾으냥?">
      <button>🔍</button>
    </header>

    <div class="filter-bar">
      <select>
        <option>최신순</option>
        <option>인기순</option>
      </select>
      <button class="btn-write">새 드립 작성</button>
    </div>

    <div class="board-grid">
      <div class="card" v-for="item in boardList" :key="item.id">
        <img src="https://thecatapi.com/api/images/get?format=src&type=jpg" alt="귀여운 냥이">
        <div class="card-body">
          <h4>{{ item.title }}</h4>
          <p>👤 {{ item.writer }} | 🐾 {{ item.views }}</p>
        </div>
      </div>
    </div>
  </main>
-->

</div>
</template>

<style scoped>  /*  style scoped 이 태그는 컴포넌트 내의 태그에만 영향을 줌! */

/* 사이드바 스타일 수정 */
.sidebar {
  width: 250px; /* 고정 너비 */
  background: #f8fafc;
  border-right: 1px solid #eee;
  padding: 20px;
  
  /* 핵심: 내부를 가로로 배치하고 정렬함 */
  display: flex;
  flex-direction: row;      /* 가로로 나열 */
  align-items: center;      /* 세로 중앙 정렬 */
  gap: 15px;                /* 로고와 메뉴 사이 간격 */
  flex-shrink: 0;           /* 사이드바가 찌그러지지 않게 방지 */
}

/* 메뉴 리스트 수정 */
.sidebar ul {
  display: flex;            /* ul 내부 li들을 가로로 나열 */
  flex-direction: row;
  list-style: none;
  gap: 10px;
  margin: 0;
  padding: 0;
}




</style>