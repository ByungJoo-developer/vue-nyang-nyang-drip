<script setup>
import { supabase } from '@/supabase'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter() // 4. router 변수 정의
const post = ref(null) // 초기값을 null로 설정
const isLoggedIn = ref(false) // 💡 1. 변수 선언 누락 해결

// 💡 여기에 추가하세요!
const isLocal = computed(() => {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname)
})

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

const deleteBoard = async () => {
  // 💡 [방어막] 진짜 삭제할 건지 유저한테 한 번 물어보는 게 매너입니다냥!
  if (!confirm('이 드립을 정말로 삭제하겠냐냥? 🐾')) {
    return
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL

  try {
    // 1. 수파베이스 세션에서 현재 로그인한 유저의 토큰(JWT)을 꺼내옵니다.
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const token = session?.access_token

    // 2. 백엔드 삭제 API로 현재 보고 있는 게시글 정보(post.value)를 보냅니다.
    await axios.post(`${baseUrl}/api/board/delete`, post.value, {
      headers: {
        Authorization: `Bearer ${token}`, // 인증 토큰 첨부
      },
    })

    alert('성공적으로 삭제되었다냥! 🎉')

    // 3. 원래 있던 리스트 게시판에 맞게 타겟 설정
    let targetName = ''

    if (post.value.boardMstId === '2026052000000001') {
      targetName = 'LatestBoardList'
    } else if (post.value.boardMstId === '2026052000000002') {
      targetName = 'HallBoardList'
    } else if (post.value.boardMstId === '2026052000000003') {
      targetName = 'boardTechList'
    }

    // 4. 삭제 완료 후 해당 리스트 페이지로 튕겨주기
    router.push({
      name: targetName,
      state: {
        boardMstId: post.value.boardMstId,
      },
    })
  } catch (error) {
    console.error('삭제 실패:', error)
    alert('삭제에 실패했다냥.. 다시 시도해달라냥!')
  }
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
        <pre class="sql-plan">{{ post.content }}</pre>
      </div>
      <br />
      <div class="btn-group">
        <button class="btn-list" @click="goToEdit" v-if="isLoggedIn || isLocal">수정</button>
        <button class="btn-list" @click="$router.back()">목록으로</button>
        <button class="btn-list" @click="deleteBoard" v-if="isLoggedIn || isLocal">삭제</button>
      </div>
    </div>

    <div v-else>
      <p>게시글을 불러오고 있습니다...</p>
    </div>
  </div>
</template>

<style lang="scss" src="./BoardDetailView.scss" scoped></style>
