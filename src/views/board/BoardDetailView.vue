<template>
  <div class="board-detail">
    <div v-if="post">
      <h1>{{ post.TITLE }}</h1>
      <div class="meta">
        <span>작성자: {{ post.USER_ID }}</span>
        <span> | 게시글번호: {{ post.BOARD_ID }}</span>
      </div>
      <hr />
      <div class="content">
        <p>{{ post.CONTENT }}</p>
      </div>
      <br />
      <button class="btn-list" @click="$router.back()">목록으로</button>
    </div>

    <div v-else>
      <p>게시글을 불러오고 있습니다...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const post = ref(null) // 초기값을 null로 설정

const fetchPost = async () => {
  // 1. 라우터에서 :id 값을 가져옵니다.
  const boardMstId = route.params.boardMstId
  const boardId = route.params.boardId
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  try {
    // 2. 백엔드 상세 조회 API 호출 (boardId 파라미터 전달)
    const response = await axios.get(
      `${baseUrl}/api/board/detail?boardMstId=${boardMstId}&boardId=${boardId}`,
    )

    // 3. 받아온 데이터를 post 변수에 저장 (이때 화면이 자동으로 업데이트됨)
    post.value = response.data
  } catch (error) {
    console.error('상세 데이터 로드 실패:', error)
    alert('게시글을 불러오지 못했습니다.')
  }
}

// 4. 컴포넌트가 화면에 나타날 때 즉시 실행
onMounted(fetchPost)
</script>

<style lang="scss" src="./BoardDetailView.scss" scoped></style>
