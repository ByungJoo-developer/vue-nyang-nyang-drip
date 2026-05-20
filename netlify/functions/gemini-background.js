import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai' // Gemini 라이브러리

// 1. 환경변수 로드 (Netlify 대시보드에 설정한 값들을 가져옴)
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const geminiApiKey = process.env.VITE_GEMINI_API_KEY

// 2. 클라이언트 초기화
const supabase = createClient(supabaseUrl, supabaseKey)
const genAI = new GoogleGenerativeAI(geminiApiKey)

// netlify/functions/gemini-background.js
export const handler = async (event) => {
  const body = JSON.parse(event.body)
  const { id, userQuestion } = body

  // 1. DB 행 생성
  await supabase.from('tarot_results').insert([
    {
      id: id,
      user_prompt: userQuestion,
      content: '',
      is_complete: false,
    },
  ])

  // 2. ⭐ 중요: await를 붙여서 Gemini 작업이 끝날 때까지 서버를 붙잡아둡니다.
  await processGemini(id, body)

  // 3. 작업이 다 끝난 후 응답을 보냅니다.
  return {
    statusCode: 200, // 완료되었으므로 200 전달
    body: JSON.stringify({ message: 'Success' }),
  }
}

async function processGemini(id, params) {
  // 여기서 Gemini 호출 및 결과 업데이트 로직 수행
  const resultText = await callGemini(params)
  await supabase
    .from('tarot_results')
    .update({ content: resultText, is_complete: true })
    .eq('id', id)
}

async function callGemini(params) {
  try {
    // 1. 모델 설정 (속도가 빠른 1.5-flash 추천)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

    // 2. 프롬프트 구성 (사용자 질문 + 사주 + 카드 결과)
    const prompt = `
      사용자 질문: ${params.userQuestion}
      오늘의 운세(사주): ${params.todayAstro}
      선택한 타로 카드들: ${JSON.stringify(params.cardResults)}
      
      위 정보를 바탕으로 친절하고 상세하게 타로 해석을 해줘.
    `

    /*
    console.log('==========================================')
    console.log('계산된 타로 카드 데이터 순서:')
    console.log(params.cardResults)
    console.log('==========================================')
    */

    // 3. 실제 API 호출
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text() // 해석 텍스트 반환
  } catch (error) {
    console.error('Gemini API 호출 중 에러:', error)

    // 1. 에러 객체에서 HTTP 상태 코드를 추출 (Google SDK 구조에 따라 다를 수 있음)
    const statusCode = error.status || (error.response && error.response.status)

    // 2. 상태 코드에 따른 사용자 메시지 분기
    if (statusCode === 503) {
      return '현재 구글 AI 서버에 요청이 몰려 해석이 지연되고 있습니다. 1~2분 후 다시 시도해 주세요. (Server Busy)'
    } else if (statusCode === 429) {
      return '단시간에 너무 많은 요청을 보내셨습니다. 잠시만 쉬었다가 다시 질문해 주세요. (Too Many Requests)'
    } else if (statusCode === 401 || statusCode === 403) {
      return 'API 키 설정에 문제가 있습니다. 관리자에게 문의하세요.'
    }

    // 3. 그 외 알 수 없는 에러
    return `해석 생성 중 오류 발생: ${error.message || '잠시 후 다시 시도해 주세요.'}`
  }
}
