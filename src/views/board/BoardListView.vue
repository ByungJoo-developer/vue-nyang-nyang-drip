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

// 1. 검색 관련 상태 추가 (반드시 상단 변수 선언부에 같이 둘 것)
const searchType = ref('01') //
const searchQuery = ref('') // 사용자가 입력창에 치는 실시간 텍스트
const activeSearchType = ref('') // 💡 실제 "검색" 버튼을 눌렀을 때 락(Lock)이 걸리는 검색 조건
const activeSearchQuery = ref('') // 💡 실제 "검색" 버튼을 눌렀을 때 락(Lock)이 걸리는 검색어

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

const formatDate = (dateString, isToday) => {
  if (!dateString) return ''

  // 💡 DB에서 판단해 준 'Y' 값만 보고 칼같이 분기 처리! (유저 PC 시간 안 봄)
  if (isToday === 'Y') {
    // 2026-05-25 18:15:30 에서 시간(18:15)만 쏙 자르기
    return dateString.substring(11, 16)
  } else {
    // 2026-05-25 18:15:30 에서 날짜(2026-05-25)만 쏙 자르기
    return dateString.substring(0, 10)
  }
}

// 2. ⭐️ 이제 route.params 대신 라우터가 넣어준 props를 우선적으로 바라보게 만듭니다.
const currentMstId = computed(() => {
  // 라우터 props로 들어온 게 있다면 쓰고, 아니라면 주소창 동적 파라미터(:boardMstId)를 봅니다.
  return props.boardMstId || route.params.boardMstId
})

// 💡 마스터 ID에 맞춰 게시판 타이틀을 동적으로 세팅
const boardTitle = computed(() => {
  // 고정값 ID 매핑 추가
  if (currentMstId.value === '2026052000000001') {
    return '🔥 최신 드립 게시판'
  } else if (currentMstId.value === '2026052000000002') {
    return '🐱 냥냥 드립 게시판'
  } else if (currentMstId.value === '2026052000000003') {
    return '테크 드립 게시판'
  }
})

// 화면 크기 감지 (Resize 이벤트)
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})

// 2. 통합 데이터 로드 함수 수정
const loadBoardList = async (page = 1, isAppend = false) => {
  loading.value = true
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    let url = `${baseUrl}/api/board/list?boardMstId=${currentMstId.value}&page=${page}&size=${pageSize}`

    // 확정된 검색어가 있을 때만 실행
    if (activeSearchQuery.value.trim() !== '') {
      // 💡 여기서 01과 02를 주소창 파라미터(title, content)로 치환합니다.
      // 아까 만든 백엔드 컨트롤러(@RequestParam "title", "content")와 톱니바퀴처럼 딱 맞물립니다!
      const paramKey = activeSearchType.value === '01' ? 'title' : 'content'

      url += `&keywordType=${activeSearchType.value}&keyword=${encodeURIComponent(activeSearchQuery.value)}`
    }

    const response = await axios.get(url)

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

// 3. 🔍 [검색] 버튼 핸들러
const handleSearch = () => {
  // 사용자가 현재 입력창에 쳐놓은 값을 "나 이제 이걸로 검색할 거야!" 하고 확정(Lock) 지어줍니다.
  activeSearchType.value = searchType.value
  activeSearchQuery.value = searchQuery.value

  // 검색 조건이 바뀐 상태로 무조건 '1페이지'부터 새로 리스트를 받아옵니다 (Append는 false)
  loadBoardList(1, false)
}

// 4. 📱 모바일 [더보기] 핸들러
const handleLoadMore = async () => {
  // 다음 페이지 번호를 계산해서 넘기고, 기존 데이터 뒤에 붙여야 하므로이 값을 true로 보냅니다.
  // 이 안에서 loadBoardList를 호출하므로, 확정된 검색 조건(activeSearchQuery)이 자동으로 같이 날아갑니다!
  await loadBoardList(currentPage.value + 1, true)

  nextTick(() => {
    const rows = document.querySelectorAll('.list-table tbody tr')
    if (rows.length > 0) {
      const lastRow = rows[rows.length - 1]
      lastRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}

// 💻 PC [페이지 변경] 핸들러
const handlePageChange = (page) => {
  // 특정 페이지를 강제로 불러오며, 리스트를 새로 갈아끼웁니다 (Append는 false)
  // 이때도 역시 기존에 확정해둔 검색 조건이 자동으로 병합되어 날아갑니다.
  loadBoardList(page, false)
}

// 🔄 메뉴 이동 감시 (게시판 종류가 바뀌면 검색 조건도 시원하게 초기화해 주는 게 좋습니다)
watch(
  () => currentMstId.value,
  () => {
    searchQuery.value = ''
    activeSearchQuery.value = ''
    loadBoardList(1, false)
  },
)

// 메뉴 이동 감시 (props나 route 파라미터가 바뀔 때 재생성)
watch(
  () => currentMstId.value,
  () => {
    loadBoardList()
  },
)

const goToWrite = () => {
  // 💡 라우터를 통해 글쓰기 페이지로 이동하면서,
  // '나 지금 자유게시판에서 글쓰기 누른 거야'라고 주소창에 파라미터를 묻혀서 보냅니다.
  router.push({
    path: '/board/write',
    query: { boardMstId: currentMstId.value }, // 👈 query로 던졌는지 확인!
  })
}

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
      <button class="btn-write" @click="goToWrite">글쓰기</button>
    </div>

    <div class="table-wrapper">
      <table class="list-table">
        <thead>
          <tr>
            <th class="th-title">제목</th>
            <th class="th-writer">작성자</th>
            <th class="th-date">날짜</th>
            <th class="th-views">조회수</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="4" class="no-data">드립 목록을 긁어오는 중이다냥... 🐾</td>
          </tr>

          <tr v-else-if="boardList.length === 0">
            <td colspan="4" class="no-data">아직 올라온 드립이 없다냥... 🐱</td>
          </tr>

          <tr v-else v-for="(post, index) in boardList" :key="post.boardId || index">
            <td class="td-title click-title" @click="goToDetail(post)">
              {{ post.title }}
            </td>
            <td class="td-writer">{{ post.writer || post.userId || '무명묘' }}</td>

            <td class="td-date">{{ formatDate(post.createDate, post.isToday) }}</td>

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
      <select v-model="searchType">
        <option value="01">제목</option>
        <option value="02">내용</option>
      </select>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="검색어를 입력하세요"
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">검색</button>

      <button class="btn-write" @click="goToWrite">글쓰기</button>
    </div>

    <p class="search-warning-text">
      🐾 띄어쓰기가 틀리면 검색 결과가 안 나올 수 있다냥! <br />
      우리 검색기는 문장을 공백 단위로 쪼개서 기억한다냥. <br />
      단어와 단어 사이를 꼭 띄어서 입력해야 <br />
      원하는 드립을 쏙쏙 찾아낼 수 있다냥!
    </p>
  </div>
</template>

<style lang="scss" src="./BoardListView.scss" scoped></style>
