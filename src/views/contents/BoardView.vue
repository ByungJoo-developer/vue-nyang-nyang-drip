<template>
  <div class="board-container">
    <div class="board-header">
      <h2>샘플 게시판</h2>
      <button class="btn-write">글쓰기</button>
    </div>

    <table class="board-table">
      <thead>
        <tr>
          <th style="width: 80px">번호</th>
          <th>제목</th>
          <th style="width: 120px">작성자</th>
          <th style="width: 150px">날짜</th>
          <th style="width: 80px">조회수</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in boardList" :key="item.id">
          <td>{{ item.id }}</td>
          <td class="title-td">
            <a href="#" @click.prevent="$emit('show-detail', item)">{{ item.title }}</a>
          </td>
          <td>{{ item.writer }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.views }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Java의 List<Board> 같은 가상 데이터입니다.
// ref()로 감싸야 값이 변했을 때 화면이 자동으로 바뀝니다.
const boardList = ref([
  {
    id: 3,
    title: '개발중',
    writer: '김병주',
    date: '2026-04-28',
    views: 12,
  },
  {
    id: 2,
    title: '개발중',
    writer: '관리자',
    date: '2026-04-27',
    views: 45,
  },
  {
    id: 1,
    title: '개발중',
    writer: '김병주',
    date: '2026-04-26',
    views: 89,
  },
])

// 부모로부터 받은 데이터를 정의하고, 상세 요청 신호를 정의합니다.
defineProps(['boardList'])
defineEmits(['show-detail'])
</script>

<style scoped>
.board-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-write {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

/* 테이블 스타일 (WinForm의 DataGridView나 HTML 표준 테이블 스타일) */
.board-table {
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid #2d3748;
}

.board-table th {
  background-color: #f7fafc;
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: bold;
  text-align: center;
}

.board-table td {
  padding: 15px 12px;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
}

.title-td {
  text-align: left !important;
}

.title-td a {
  text-decoration: none;
  color: #2d3748;
}

.title-td a:hover {
  color: #3182ce;
  text-decoration: underline;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.pagination span {
  padding: 5px 10px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}
</style>
