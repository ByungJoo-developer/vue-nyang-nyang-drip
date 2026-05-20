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
            <td class="td-title">
              <router-link
                :to="`/board/boardDetail/${post.boardMstId || currentMstId}/${post.boardId}`"
              >
                {{ post.TITLE }}
              </router-link>
            </td>
            <td class="td-writer">{{ post.writer || post.USER_ID || '무명묘' }}</td>
            <!--
            <td class="td-date">{{ formatDate(post.regDt || post.date) }}</td>
            -->
            <td class="td-views">{{ post.views ?? 0 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const boardList = ref([])
const loading = ref(false)

// 1. ⭐️ 라우터에서 props로 넘겨준 고정 ID('2026052000000001')를 여기서 정의합니다.
const props = defineProps({
  boardMstId: {
    type: String,
    default: 'C6WGI06XVM', // 주소창 파라미터도 없고 props도 없을 때를 대비한 기본값
  },
})

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

// 🔄 실제 자바 서버 연동 API 호출 함수
const loadBoardList = async (paramPage = 1, paramSize = 5) => {
  loading.value = true
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL

    // 이제 currentMstId.value에 '2026052000000001'이 안전하게 담겨서 전송됩니다!
    const response = await axios.get(
      `${baseUrl}/api/board/list?boardMstId=${currentMstId.value}&page=${paramPage}&size=${paramSize}`,
    )
    boardList.value = response.data || []
  } catch (error) {
    console.error('자바 백엔드로부터 게시판 리스트를 가져오는데 실패했습니다:', error)
    boardList.value = []
  } finally {
    loading.value = false
  }
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

<style scoped>
.board-list-container {
  max-width: 1000px;
  margin: 0 auto;
}

.board-title {
  font-size: 1.8rem;
  color: #1e293b;
  margin-bottom: 30px;
  font-weight: bold;
}

/* 상단 서브 헤더 라인 */
.board-sub-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.total-count {
  font-size: 0.95rem;
  color: #64748b;
}

.total-count span {
  color: #4f46e5;
  font-weight: bold;
}

.btn-write {
  background-color: #4f46e5;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-write:hover {
  background-color: #4338ca;
}

/* 📊 테이블 스타일 디자인 */
.table-wrapper {
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  overflow: hidden;
}

.list-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.95rem;
}

.list-table th,
.list-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

/* 테이블 헤더 */
.list-table th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: bold;
  font-size: 0.9rem;
}

/* 컬럼별 고정 너비 및 정렬 규격 */
.th-num,
.td-num {
  width: 80px;
  text-align: center;
  color: #94a3b8;
}
.th-writer,
.td-writer {
  width: 140px;
}
.th-date,
.td-date {
  width: 120px;
  color: #64748b;
}
.th-views,
.td-views {
  width: 80px;
  text-align: center;
  color: #94a3b8;
}

/* 제목 컬럼 스타일 */
.td-title a {
  color: #1e293b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;

  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-transform: capitalize;
  text-overflow: ellipsis;
}

.td-title a:hover {
  color: #4f46e5;
}

/* 행 하이라이트 효과 */
.list-table tbody tr {
  transition: background-color 0.2s;
}
.list-table tbody tr:hover {
  background-color: #f8fafc;
}

.no-data {
  text-align: center;
  padding: 50px 0 !important;
  color: #94a3b8;
}

/* 📱 모바일 환경 최적화 */
@media (max-width: 768px) {
  .th-date,
  .td-date,
  .th-views,
  .td-views {
    display: none;
  }

  .list-table th,
  .list-table td {
    padding: 12px 10px;
  }
}
</style>
