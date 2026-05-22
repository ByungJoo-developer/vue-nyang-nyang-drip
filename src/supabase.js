import { createClient } from '@supabase/supabase-js'

// 💡 기존에 프로젝트에서 사용하시던 수파베이스 URL과 Anon Key값을 적어줍니다.
// 만약 .env 파일을 쓰신다면 import.meta.env... 구조를 그대로 쓰셔도 됩니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🎯 공통 인스턴스를 단 하나만 생성해서 외부로 수출(export)합니다.
// src/supabase.js
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // 💡 이 설정이 주소창 파라미터 문제를 획기적으로 줄여줍니다.
  },
})
