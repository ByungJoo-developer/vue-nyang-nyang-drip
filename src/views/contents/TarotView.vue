<template>
<div class="nyang-container">
  <nav class="sidebar">
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
</div>
</template>

