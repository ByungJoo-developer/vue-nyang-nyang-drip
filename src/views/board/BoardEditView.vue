<script setup>
import { supabase } from '@/supabase'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const post = ref(null)

/**************************************************** */
/* 페이지 로드시 데이터 보여주기                          */
/**************************************************** */
const fetchPost = async () => {
  //const { boardMstId, boardId } = route.params
  const boardMstId = history.state.boardMstId
  const boardId = history.state.boardId
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

/**************************************************** */
/* 수정                                                */
/**************************************************** */
const updatePost = async () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  try {
    // 1. 수파베이스 세션에서 현재 유저의 진짜 암호화 토큰(JWT)을 꺼내옵니다.
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const token = session?.access_token // 요 녀석이 핵심 치트키입니다.

    await axios.post(`${baseUrl}/api/board/update`, post.value, {
      headers: {
        Authorization: `Bearer ${token}`, // 'Bearer ' 한 칸 띄우고 토큰 첨부
      },
    })

    alert('수정되었습니다!')

    // 1. 현재 글이 어느 게시판인지 확인
    const targetName =
      post.value.boardMstId === '2026052000000001' ? 'LatestBoardList' : 'HallBoardList'

    // 2. 💡 리스트 페이지로 이동하면서 어떤 게시판인지 마스터 ID만 숨겨서 전달
    router.push({
      name: targetName, // 본인의 리스트 라우터 네임에 맞게 적어주세요
      state: {
        boardMstId: post.value.boardMstId || history.state.boardMstId,
      },
    })
  } catch (error) {
    alert('수정 실패')
  }
}

onMounted(fetchPost)
</script>

<template>
  <div class="board-detail">
    <div v-if="post">
      <input v-model="post.title" class="edit-title" placeholder="제목을 입력하세요" />

      <div class="meta">
        <span>작성자: {{ post.userId }}</span>
        <span> | 게시글번호: {{ post.boardId }}</span>
      </div>
      <hr />

      <textarea
        v-model="post.content"
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

<style lang="scss" src="./BoardEditView.scss" scoped></style>
