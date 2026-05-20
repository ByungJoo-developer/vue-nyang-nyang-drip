<template>
  <div class="main-container">
    <section class="profile-header">
      <div class="badge">Senior Developer</div>
      <div class="contact-links"></div>
    </section>

    <section class="tech-stack">
      <h3>Core Competencies</h3>
      <div class="skill-grid">
        <div class="skill-item">
          <strong>Backend</strong>
          <p>Java, Spring Boot, C#, .NET</p>
        </div>
        <div class="skill-item">
          <strong>Frontend</strong>
          <p>Vue.js 3, JavaScript, CSS3</p>
        </div>
        <div class="skill-item">
          <strong>Database</strong>
          <p>Oracle, MySQL, MS-SQL</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* --- 스타일 시트 (CSS) --- */

/* 전체 컨테이너: 최대 너비를 잡고 중앙 정렬 */
/* MainView.vue 의 <style scoped> 부분 */
.main-container {
  /* max-width: 900px;  <-- 이 줄을 주석 처리하거나 지워보세요 */
  width: 100%; /* 부모 너비에 맞게 꽉 채움 */
  margin: 0 auto;
  color: #2c3e50;
  line-height: 1.6;
}

/* 상단 프로필 영역 */
.profile-header {
  padding: 40px 0;
  border-bottom: 2px solid #edf2f7;
  margin-bottom: 30px;
}

.badge {
  display: inline-block;
  background: #ebf4ff;
  color: #3182ce;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
}

h1 {
  font-size: 42px;
  margin: 0;
  color: #1a202c;
}
.lead {
  font-size: 20px;
  color: #4a5568;
  margin: 15px 0;
}
.contact-links {
  color: #718096;
  font-size: 15px;
}
.contact-links span {
  margin-right: 20px;
}

/* 기술 스택 그리드 레이아웃 */
.tech-stack {
  margin-bottom: 40px;
}
.tech-stack h3 {
  border-left: 5px solid #3182ce;
  padding-left: 15px;
  margin-bottom: 20px;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3단 가로 배열 */
  gap: 20px;
}

.skill-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.skill-item strong {
  display: block;
  margin-bottom: 8px;
  color: #2d3748;
}
.skill-item p {
  margin: 0;
  font-size: 14px;
  color: #4a5568;
}

/* 하단 카드형 리스트 */
.summary-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.project-list {
  list-style: none;
  padding: 0;
}
.project-list li {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e2e8f0;
}

.project-list li:last-child {
  border-bottom: none;
}
.project-list strong {
  display: block;
  color: #3182ce;
  font-size: 18px;
}
.project-list span {
  font-size: 15px;
  color: #4a5568;
}
</style>
