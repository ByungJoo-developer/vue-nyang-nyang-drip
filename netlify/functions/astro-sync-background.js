import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export const handler = async (event) => {
  const base_url =
    'https://apis.data.go.kr/B090041/openapi/service/AstroEventInfoService/getAstroEventInfo'
  const api_key = process.env.VITE_ASTRO_API_KEY

  for (let i = 0; i < 3; i++) {
    const targetDate = new Date()
    targetDate.setMonth(targetDate.getMonth() + i)
    const year = targetDate.getFullYear().toString()
    const month = (targetDate.getMonth() + 1).toString().padStart(2, '0')

    try {
      const final_url = `${base_url}?serviceKey=${api_key}&solYear=${year}&solMonth=${month}&_type=json`
      const response = await fetch(final_url)
      const json = await response.json()

      if (json.response?.header?.resultCode === '00') {
        // 프로시저 호출 (rpc 메서드 사용)
        // rpc 명칭은 프로시저 이름, 인자는 파라미터 이름과 매칭
        const { error } = await supabase.rpc('fn_astro_insert_update', {
          p_year: year,
          p_month: month,
          p_content: JSON.stringify(json),
        })

        if (error) throw error
        console.log(`${year}-${month} 처리 시도 완료`)
      }
    } catch (err) {
      console.error(`${year}-${month} API 호출 실패:`, err.message)
    }
  }

  return { statusCode: 200 }
}
