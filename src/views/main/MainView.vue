<template>
  <div id="nyanya-board-main">
    <div class="main-container">
      <section class="box box1">
        <h2>최신드립</h2>
        <ul>
          <li v-for="post in latestPosts" :key="post.BOARD_ID">
            <router-link
              :to="{
                path: `/board/boardDetail/${post.BOARD_MST_ID}/${post.BOARD_ID}`,
              }"
              class="post-link"
            >
              <span>[최신]</span> {{ post.TITLE }}
            </router-link>
          </li>
        </ul>
      </section>
      <section class="box box2">
        <h2>냥냥드립</h2>
        <ul>
          <li v-for="post in nyaPosts" :key="post.BOARD_ID">
            <router-link
              :to="{
                path: `/board/boardDetail/${post.BOARD_MST_ID}/${post.BOARD_ID}`,
              }"
              class="post-link"
            >
              <span>[냥냥]</span> {{ post.TITLE }}
            </router-link>
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

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const latestPosts = ref([])
const nyaPosts = ref([])

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

<style lang="scss" src="./MainView.scss" scoped></style>
