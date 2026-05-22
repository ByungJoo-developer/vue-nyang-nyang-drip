<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

// TarotHaemi 서비스 전용 탈퇴 유저 확인 키
const TAROT_HAEMI_WITHDRAWN_USER_FLAG = 'Nyang_Nyang_Withdrawn_User_Status'

// 1. 환경변수 로드 (Vite 방식) 및 Supabase 클라이언트 초기화
//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
//const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
//const supabase = createClient(supabaseUrl, supabaseKey)

const user = ref(null)

const loginWithGoogle = async () => {
  // 💡 저장소에서 플래그 확인
  const isWithdrawn = localStorage.getItem(TAROT_HAEMI_WITHDRAWN_USER_FLAG) === 'true'

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/main`,
      // 💡 탈퇴했던 유저라면 구글 계정 선택창(prompt)을 강제로 띄움
      queryParams: isWithdrawn ? { prompt: 'select_account' } : {},
    },
  })

  if (error) {
    console.error('로그인 중 에러 발생:', error.message)
  } else {
    // 💡 로그인이 진행되면 증표를 즉시 파기 (다음번엔 편하게 로그인하도록)
    localStorage.removeItem(TAROT_HAEMI_WITHDRAWN_USER_FLAG)
  }
}

// 로그아웃 함수 추가
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('로그아웃 중 오류:', error.message)
  } else {
    user.value = null // 로그아웃 성공 시 유저 정보 초기화 -> 화면이 자동으로 바뀜
    alert('로그아웃 되었습니다.')
  }
}

const handleWithdrawal = async () => {
  //if (!confirm('정말 탈퇴하시겠습니까? 그동안의 타로 기록이 모두 사라집니다.')) return
  if (!confirm('정말 탈퇴하시겠습니까? ')) return

  // 1. DB에서 사용자 삭제 (RPC 호출)
  const { error: rpcError } = await supabase.rpc('delete_user_own_account')

  if (rpcError) {
    alert('탈퇴 처리 중 오류가 발생했습니다.')
    return
  }

  // 2. 💡 풀네임을 활용한 탈퇴 증표 남기기
  localStorage.setItem(TAROT_HAEMI_WITHDRAWN_USER_FLAG, 'true')

  // 3. Supabase 세션 로그아웃
  await supabase.auth.signOut()

  alert('탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.')

  // 4. 화면 초기화 및 메인 새로고침
  user.value = null
  location.reload()
}

// 4. 페이지 로드 시 로그인 상태 체크
onMounted(async () => {
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()
  if (currentUser) {
    user.value = currentUser
  }

  // 2. 그 다음 페이지 이동
  router.replace('/main')
})
</script>

<template>
  <header class="main-header">
    <div class="header-top">
      <div class="logo">🐱 냥냥 드립</div>

      <div class="search-container">
        <input type="text" placeholder="검색어를 입력하냥" />
        <button>🔍</button>
      </div>

      <div class="login-container">
        &nbsp;&nbsp;&nbsp;
        <div v-if="user" class="user-profile">
          <span class="user-name">{{ user.user_metadata.full_name }}님 반갑습니다!</span>
          <button @click="handleLogout" class="logout-btn">로그아웃</button>
          <button @click="handleWithdrawal" class="withdraw-link">탈퇴하기</button>
        </div>

        <button v-else @click="loginWithGoogle" class="google-btn">
          <img src="https://developers.google.com/static/identity/images/g-logo.png" alt="Google" />
          <span>구글 로그인</span>
        </button>
      </div>
    </div>

    <nav class="nav-links">
      <router-link to="/main">🏠 홈</router-link>
      <router-link to="/latest">🔥 최신 드립</router-link>
      <router-link to="/hall">🔥 냥냥 드립</router-link>
    </nav>
  </header>
</template>

<style scoped>
/* ==========================================================================
   💻 PC 환경 기본 스타일 (mainHeader 하나로 상단+좌측을 다 먹는 구조)
   ========================================================================== */

/* 1. 상단 바 영역 (로고, 검색, 로그인 가로 배정) */
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 40px;
  background-color: #ffffff;
  border-bottom: 2px solid #e0e7ff;
  position: fixed; /* 상단 고정 */
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  box-sizing: border-box;
  z-index: 1000;
}

.logo {
  font-size: 1.3rem;
  font-weight: bold;
  color: #1e293b;
}

.search-container {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 20px;
  padding: 4px 12px;
}

.search-container input {
  border: none;
  background: transparent;
  padding: 6px 10px;
  outline: none;
  font-size: 0.9rem;
  width: 240px;
}

.search-container button {
  background: none;
  border: none;
  cursor: pointer;
}

.btn-login {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 15px; /* 이름과 로그아웃 버튼 사이 간격 */
  margin-left: 20px; /* 왼쪽 벽에서 띄우기 (여기서 '혜미' 앞 여백 조절) */
}

.user-name {
  font-weight: bold;
  color: #2c3e50;
}

.logout-btn {
  background: none;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.withdraw-link {
  background: none;
  border: none;
  color: #999;
  font-size: 11px;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 10px;
}
.withdraw-link:hover {
  color: #ff4d4f; /* 마우스 올리면 경고 의미로 빨간색 */
}

/* 2. ⭐️ 핵심: 헤더 파일 안에 들어있지만, 좌측 고정 세로 메뉴판으로 탈바꿈 */
.nav-links {
  position: fixed; /* 화면에 딱 고정 */
  top: 70px; /* 상단 헤더 높이만큼 띄우고 */
  left: 0;
  width: 240px; /* 좌측 메뉴판 너비 지정 */
  bottom: 0; /* 바닥까지 늘리기 */
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 30px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column; /* ◀ 위에서 아래로 세로 정렬!! */
  gap: 12px;
  z-index: 999;
}

.nav-links a {
  display: block;
  padding: 12px 20px;
  color: #475569;
  text-decoration: none;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background-color: #f1f5f9;
  color: #4f46e5;
}

/* mainHeader.vue의 style 섹션에 추가 */
.google-btn {
  margin-left: 20px !important; /* 💡 우선순위를 최상위로 끌어올림 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #3c4043;
  border: 1px solid #dadce0;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
  gap: 10px; /* 아이콘과 텍스트 간격 */
}

.google-btn:hover {
  background-color: #f8f9fa;
  box-shadow:
    0 1px 2px 0 rgba(60, 64, 67, 0.3),
    0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.google-btn img {
  width: 18px; /* 아이콘 크기를 버튼에 맞게 고정 */
  height: 18px;
  object-fit: contain;
}

/* ==========================================================================
   📱 모바일 환경 반응형 스타일 (화면폭 768px 이하)
   ========================================================================== */
@media (max-width: 768px) {
  /* 상단 바 고정을 풀고 유연하게 쌓이도록 변경 */
  .header-top {
    position: relative;
    height: auto;
    padding: 15px 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .search-container {
    order: 3;
    width: 100%;
  }

  /* ⭐️ 핵심: 좌측 세로 고정이었던 메뉴판을 상단 가로줄 메뉴로 원상복구 */
  .nav-links {
    position: relative; /* fixed 고정 해제 */
    top: 0;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding: 10px 20px;
    flex-direction: row; /* ◀ 다시 가로 정렬로 변경!! */
    justify-content: space-around;
  }

  .nav-links a {
    padding: 8px 12px;
    font-size: 0.95rem;
  }
}
</style>
