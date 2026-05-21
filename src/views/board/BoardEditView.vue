<template>
  <div class="board-detail">
    <div v-if="post">
      <input v-model="post.TITLE" class="edit-title" placeholder="제목을 입력하세요" />

      <div class="meta">
        <span>작성자: {{ post.USER_ID }}</span>
        <span> | 게시글번호: {{ post.BOARD_ID }}</span>
      </div>
      <hr />

      <textarea
        v-model="post.CONTENT"
        class="edit-content"
        placeholder="내용을 입력하세요"
      ></textarea>

      <br />
      <div class="btn-group">
        <button class="btn-save" @click="updatePost">수정 완료</button>
        <button class="btn-list" @click="$router.back()">취소</button>
      </div>
    </div>

    <div v-else>
      <p>데이터를 불러오는 중...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const post = ref(null)

const fetchPost = async () => {
  const { boardMstId, boardId } = route.params
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  try {
    const response = await axios.get(
      `${baseUrl}/api/board/detail?boardMstId=${boardMstId}&boardId=${boardId}`,
    )
    post.value = response.data
  } catch (error) {
    alert('데이터 로드 실패')
  }
}

const updatePost = async () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  try {
    // 백엔드 수정 API 호출 (PUT 또는 POST)
    await axios.post(`${baseUrl}/api/board/update`, post.value)
    alert('수정되었습니다!')
    router.back()
  } catch (error) {
    alert('수정 실패')
  }
}

onMounted(fetchPost)
</script>

<style scoped>
/* 기존 상세 보기 스타일 + 수정용 추가 스타일 */
.edit-title {
  width: 100%;
  font-size: 2rem;
  font-weight: bold;
  padding: 5px;
  border: 1px solid #ddd;
}
.edit-content {
  width: 100%;
  min-height: 300px;
  padding: 10px;
  margin-top: 20px;
  font-size: 1.05rem;
}
.btn-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.btn-save {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
