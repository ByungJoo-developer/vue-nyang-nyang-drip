<script setup>
import { supabase } from '@/supabase'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter() // 4. router 변수 정의
const post = ref(null) // 초기값을 null로 설정
const isLoggedIn = ref(false) // 💡 1. 변수 선언 누락 해결

const goToEdit = () => {
  // 현재 post가 가진 ID 값을 가지고 수정 페이지(BoardEdit)로 이동시킵니다.
  router.push({
    name: 'BoardEdit',
    state: {
      boardMstId: post.value.boardMstId, //
      boardId: post.value.boardId,
    },
  })
}

const fetchPost = async () => {
  // 💡 데이터가 없으면 즉시 중단하고 리스트로 돌려보냅니다. (이게 파라미터 생성을 막는 핵심!)
  if (!history.state.boardMstId || !history.state.boardId) {
    alert('데이터가 없습니다. 리스트로 돌아갑니다.')
    router.replace('/latest') // 리스트 페이지로 이동
    return
  }

  const boardMstId = history.state.boardMstId
  const boardId = history.state.boardId
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  try {
    const response = await axios.get(
      `${baseUrl}/api/board/detail?boardMstId=${boardMstId}&boardId=${boardId}`,
    )
    post.value = response.data
  } catch (error) {
    console.error('상세 데이터 로드 실패:', error)
  }
}

// BoardDetailView.vue 의 checkLoginStatus 함수를 아래로 교체
const checkLoginStatus = async () => {
  const { data } = await supabase.auth.getSession()

  isLoggedIn.value = !!data.session

  // 2. 💡 개발 환경(로컬)이면 강제로 버튼 노출!
  // window.location.hostname이 'localhost'이면 무조건 true로 만듭니다.
  if (window.location.hostname === 'localhost') {
    isLoggedIn.value = true
    //console.log('개발 모드: 수정 버튼 강제 활성화')
  }
}
// 4. 컴포넌트가 화면에 나타날 때 즉시 실행
onMounted(async () => {
  // 데이터를 먼저 불러오고, 동시에 로그인 상태도 확인
  await Promise.all([fetchPost(), checkLoginStatus()])
})
</script>

<template>
  <div class="board-detail">
    <div v-if="post">
      <h1>{{ post.title }}</h1>
      <div class="meta">
        <span>작성자: {{ post.userId }}</span>
        <span> | 게시글번호: {{ post.boardId }}</span>
      </div>
      <hr />
      <div class="content">
        <p>{{ post.content }}</p>
      </div>
      <br />
      <div class="btn-group">
        <button class="btn-list" @click="goToEdit" v-if="isLoggedIn">수정</button>
        <button class="btn-list" @click="$router.back()">목록으로</button>
      </div>
    </div>

    <div v-else>
      <p>게시글을 불러오고 있습니다...</p>
    </div>
  </div>
</template>

<style lang="scss" src="./BoardDetailView.scss" scoped></style>
