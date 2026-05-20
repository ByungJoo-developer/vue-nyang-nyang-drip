<template>
  <div class="detail-container">
    <div class="detail-header">
      <h2>{{ boardData.title }}</h2>
      <div class="info">
        <span>작성자: {{ boardData.writer }}</span>
        <span>날짜: {{ boardData.date }}</span>
        <span>조회수: {{ boardData.views }}</span>
      </div>
    </div>

    <div class="detail-content">
      <p>{{ boardData.content }}</p>
      <div class="dummy-text">
        이 부분은 상세 페이지의 본문 영역입니다. <br />
        Java Spring Boot에서 보내준 데이터를 Vue가 받아서 바인딩한 결과입니다.
      </div>
    </div>

    <div class="detail-footer">
      <button class="btn-list" @click="$emit('go-list')">목록으로</button>
    </div>
  </div>
</template>

<script setup>
// 부모(App.vue)로부터 선택된 게시글의 데이터를 전달받습니다. (Java의 생성자 파라미터 느낌)
defineProps(['boardData'])
// 목록으로 돌아가기 위한 신호를 정의합니다.
defineEmits(['go-list'])
</script>

<style scoped>
.detail-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.detail-header {
  border-bottom: 2px solid #2d3748;
  padding-bottom: 15px;
  margin-bottom: 20px;
}
.detail-header h2 {
  margin: 0 0 10px 0;
  color: #1a202c;
}
.info {
  color: #718096;
  font-size: 14px;
}
.info span {
  margin-right: 20px;
}
.detail-content {
  min-height: 300px;
  line-height: 1.8;
  color: #2d3748;
}
.dummy-text {
  margin-top: 50px;
  color: #a0aec0;
  border-top: 1px solid #edf2f7;
  padding-top: 20px;
}
.detail-footer {
  margin-top: 30px;
  text-align: center;
}
.btn-list {
  background: #718096;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
