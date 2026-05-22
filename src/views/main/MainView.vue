<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const latestPosts = ref([])
const nyaPosts = ref([])

// 1. 상세 페이지로 데이터를 '숨겨서(state)' 이동시키는 함수
const goToDetail = (post) => {
  router.push({
    name: 'BoardDetail', // 1단계에서 정의한 라우터 이름
    state: {
      // 💡 HTML5 History API의 state 기능을 사용해 데이터를 POST 방식처럼 주소창 몰래 숨겨서 넘깁니다.
      boardMstId: post.boardMstId || currentMstId.value,
      boardId: post.boardId,
    },
  })
}

// 데이터 가져오기 로직을 함수로 분리 (boardId를 받아옴)
const loadBoard = async (boardId, page, size) => {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL

    // 1. 주소 뒤에 파라미터 이름을 백엔드에서 정한 이름(예: mstId)으로 맞춥니다.
    // 2. 따옴표 대신 백틱(`)을 사용해 변수를 삽입합니다.
    const response = await axios.get(
      `${baseUrl}/api/board/list?boardMstId=${boardId}&page=${page}&size=${size}`,
    )

    // 3. 백엔드에서 이미 필터링된 결과를 보내주므로 필터 과정 없이 바로 데이터를 리턴합니다.
    return response.data
  } catch (error) {
    console.error(`${boardId} 데이터 로드 실패:`, error)
    return []
  }
}

onMounted(async () => {
  // 각 게시판별로 호출
  latestPosts.value = await loadBoard('2026052000000001', 1, 5)
  nyaPosts.value = await loadBoard('2026052000000002', 1, 5)
})
</script>

<template>
  <div id="nyanya-board-main">
    <div class="main-container">
      <section class="box box1">
        <h2>최신드립</h2>
        <ul>
          <li
            v-for="post in latestPosts"
            :key="post.boardId"
            @click="goToDetail(post)"
            class="click-title"
          >
            <span>[최신]</span> {{ post.title }}
          </li>
        </ul>
      </section>
      <section class="box box2">
        <h2>냥냥드립</h2>
        <ul>
          <li
            v-for="post in nyaPosts"
            :key="post.boardId"
            @click="goToDetail(post)"
            class="click-title"
          >
            <span>[냥냥]</span> {{ post.title }}
          </li>
        </ul>
      </section>
      <section class="box box3">
        <h2>빈 영역 A</h2>
      </section>
      <section class="box box4">
        <h2>빈 영역 B</h2>
      </section>
    </div>
  </div>
</template>

<style lang="scss" src="./MainView.scss" scoped></style>
