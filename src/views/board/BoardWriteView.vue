<script setup>
import { supabase } from '@/supabase'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// 💡 [핵심] 처음부터 빈 제목과 빈 내용 객체로 채워둡니다. (null이 아니므로 화면에 바로 뜸!)
const post = ref({
  boardMstId: route.query.boardMstId || history.state.boardMstId || '2026052000000001', // 리스트에서 넘겨준 ID 낚아채기
  title: '', // 제목 입력값 바인딩
  content: '', // 내용 입력값 바인딩
})

/**************************************************** */
/* 🚀 새로운 드립 등록 (Insert)                        */
/**************************************************** */
const insertPost = async () => {
  // 간단한 유효성 검사 (빈 값 방어)
  if (!post.value.title.trim()) {
    return alert('제목을 입력해달라냥! 🐾')
  }
  if (!post.value.content.trim()) {
    return alert('내용을 입력해달라냥! 🐾')
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL
  try {
    // 1. 수파베이스 세션에서 현재 유저의 진짜 토큰(JWT)을 꺼내옵니다.
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const token = session?.access_token

    // 2. 백엔드 글쓰기 API로 post 객체를 보냅니다.
    await axios.post(`${baseUrl}/api/board/upsert`, post.value, {
      headers: {
        Authorization: `Bearer ${token}`, // 인증 토큰 첨부
      },
    })

    alert('성공적으로 등록되었다냥! 🎉')

    // 3. 원래 있던 리스트 게시판에 맞게 타겟 설정
    const targetName =
      post.value.boardMstId === '2026052000000001' ? 'LatestBoardList' : 'HallBoardList'

    // 4. 저장 후 해당 리스트 페이지로 튕겨주기
    router.push({
      name: targetName,
      state: {
        boardMstId: post.value.boardMstId,
      },
    })
  } catch (error) {
    console.error('등록 실패:', error)
    alert('등록에 실패했다냥.. 다시 확인해달라냥!')
  }
}

onMounted(() => {
  console.log('글쓰기 화면 로드 완료! 대상 게시판 ID:', post.value.boardMstId)
})
</script>

<template>
  <div class="board-detail">
    <input v-model="post.title" class="edit-title" placeholder="제목을 입력하세요" />

    <div class="meta">
      <span>새로운 드립 작성 중... ✍️</span>
    </div>
    <hr />

    <textarea
      v-model="post.content"
      class="edit-content"
      placeholder="내용을 입력하세요"
    ></textarea>

    <br />
    <div class="btn-group">
      <button class="btn-save" @click="insertPost">등록 완료</button>
      <button class="btn-list" @click="$router.back()">취소</button>
    </div>
  </div>
</template>

<style lang="scss" src="./BoardWriteView.scss" scoped></style>
