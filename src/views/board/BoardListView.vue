<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { nextTick } from 'vue' // 1. 상단에 nextTick 임포트 확인!
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const boardList = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 15
const isMobile = ref(window.innerWidth < 768)

// 1. ⭐️ 라우터에서 props로 넘겨준 고정 ID('2026052000000001')를 여기서 정의합니다.
const props = defineProps({
  boardMstId: {
    type: String,
    default: 'C6WGI06XVM', // 주소창 파라미터도 없고 props도 없을 때를 대비한 기본값
  },
})

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

// 2. ⭐️ 이제 route.params 대신 라우터가 넣어준 props를 우선적으로 바라보게 만듭니다.
const currentMstId = computed(() => {
  // 라우터 props로 들어온 게 있다면 쓰고, 아니라면 주소창 동적 파라미터(:boardMstId)를 봅니다.
  return props.boardMstId || route.params.boardMstId
})

// 💡 마스터 ID에 맞춰 게시판 타이틀을 동적으로 세팅
const boardTitle = computed(() => {
  // 고정값 ID 매핑 추가
  if (currentMstId.value === '2026052000000001' || currentMstId.value === 'C6WGI06XVM') {
    return '🔥 최신 드립 게시판'
  }
  if (currentMstId.value === 'HONOR_001') return '🏆 명예의 전당'
  return '🐱 냥냥 드립 게시판'
})

// 화면 크기 감지 (Resize 이벤트)
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})

// 🔄 데이터 로드 함수 수정: append 모드 추가
const loadBoardList = async (page = 1, isAppend = false) => {
  loading.value = true
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const response = await axios.get(
      `${baseUrl}/api/board/list?boardMstId=${currentMstId.value}&page=${page}&size=${pageSize}`,
    )

    if (isAppend) {
      boardList.value = [...boardList.value, ...response.data]
    } else {
      boardList.value = response.data || []
    }
    currentPage.value = page
  } catch (error) {
    console.error('불러오기 실패:', error)
  } finally {
    loading.value = false
  }
}

// 더보기 핸들러 (모바일)
const handleLoadMore = async () => {
  await loadBoardList(currentPage.value + 1, true)

  // 2. 화면 렌더링이 완료된 후 실행
  nextTick(() => {
    // 3. 마지막 추가된 항목을 찾아 부드럽게 스크롤
    // 리스트의 마지막 tr 요소를 찾습니다.
    const rows = document.querySelectorAll('.list-table tbody tr')
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1]
      lastRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

// 페이지 변경 핸들러 (PC)
const handlePageChange = (page) => {
  loadBoardList(page, false)
}

// 메뉴 이동 감시 (props나 route 파라미터가 바뀔 때 재생성)
watch(
  () => currentMstId.value,
  () => {
    loadBoardList()
  },
)

onMounted(() => {
  loadBoardList(1, 15)
})
</script>

<template>
  <div class="board-list-container">
    <h2 class="board-title">{{ boardTitle }}</h2>

    <div class="board-sub-header">
      <div class="total-count">
        전체 <span>{{ boardList.length }}</span
        >개
      </div>
      <button class="btn-write" @click="goToWrite">✏️ 드립치기</button>
    </div>

    <div class="table-wrapper">
      <table class="list-table">
        <thead>
          <tr>
            <th class="th-num">번호</th>
            <th class="th-title">제목</th>
            <th class="th-writer">작성자</th>
            <th class="th-date">날짜</th>
            <th class="th-views">조회수</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="no-data">드립 목록을 긁어오는 중이다냥... 🐾</td>
          </tr>

          <tr v-else-if="boardList.length === 0">
            <td colspan="5" class="no-data">아직 올라온 드립이 없다냥... 🐱</td>
          </tr>

          <tr v-else v-for="(post, index) in boardList" :key="post.boardId || index">
            <td class="td-num">{{ post.boardId || boardList.length - index }}</td>
            <td class="td-title click-title" @click="goToDetail(post)">
              {{ post.title }}
            </td>
            <td class="td-writer">{{ post.writer || post.userId || '무명묘' }}</td>
            <!--
            <td class="td-date">{{ formatDate(post.regDt || post.date) }}</td>
            -->
            <td class="td-views">{{ post.views ?? 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="list-controls">
    <button
      v-if="isMobile && boardList.length > 0"
      class="btn-more"
      @click="handleLoadMore"
      :disabled="loading"
    >
      {{ loading ? '불러오는 중...' : '더보기' }}
    </button>

    <div v-else-if="!isMobile" class="pagination">
      <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} 페이지</span>
      <button @click="handlePageChange(currentPage + 1)">다음</button>
    </div>

    <div class="bottom-search-bar">
      <select>
        <option>제목</option>
        <option>제목+내용</option>
        <option>작성자</option>
      </select>
      <input type="text" placeholder="검색어를 입력하세요" />
      <button>검색</button>
    </div>
  </div>
</template>

<style lang="scss" src="./BoardListView.scss" scoped></style>
