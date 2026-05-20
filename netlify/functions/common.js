// 1. 경로를 @supabase/supabase-js 로 변경
import { createClient } from '@supabase/supabase-js'

// 2. Vite 환경에 맞게 import.meta.env 사용
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // 주소를 직접 치는 것보다 window.location.origin을 쓰면
      // 로컬 테스트와 배포 서버 양쪽에서 다 잘 작동합니다.
      redirectTo: window.location.origin,
    },
  })

  if (error) console.error('로그인 에러:', error.message)
}
