import { createClient } from '@supabase/supabase-js'

// 1. 환경변수 로드 및 Supabase 클라이언트 초기화
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * [Netlify Function] get-token-status.js
 * 호출 방법:
 * 1. 토큰 현황: /.netlify/functions/get-token-status?type=tokens
 * 2. 전체 로그(예시): /.netlify/functions/get-token-status?type=logs
 */
export const handler = async (event) => {
  try {
    // URL 파라미터에서 type 가져오기 (기본값은 tokens)
    const type = event.queryStringParameters?.type || 'tokens'

    let responseData = {}

    // --- [구분자별 로직 시작] ---
    switch (type) {
      /*************************************************************************/
      /*  토큰 사용량 및 남은 잔량 조회 시작                                       */
      /*************************************************************************/
      case 'tokens':
        const { data: tokenData, error: tokenError } = await supabase.rpc(
          'tarot_get_daily_token_status',
        )

        if (tokenError) throw tokenError

        const status =
          tokenData && tokenData.length > 0
            ? tokenData[0]
            : {
                daily_limit: 200000,
                used_tokens: 0,
                remaining_tokens: 200000,
              }

        responseData = {
          daily_limit: status.daily_limit,
          used_tokens: status.used_tokens,
          remaining_tokens: status.remaining_tokens,
          usage_percent: ((status.used_tokens / status.daily_limit) * 100).toFixed(2) + '%',
        }
        break
      /*************************************************************************/
      /*  토큰 사용량 및 남은 잔량 조회 끝                                         */
      /*************************************************************************/

      /************************************************/
      /*  타로 응답 데이터 리턴 시작                      */
      /************************************************/
      case 'checkResult':
        responseData = await checkResult(event)
        break
      /************************************************/
      /*  타로 응답 데이터 리턴 끝                       */
      /************************************************/

      /************************************************/
      /*  타로 응답 데이터 리턴 시작                      */
      /************************************************/
      case 'getAstroData':
        responseData = await getAstroData()
        break
      /************************************************/
      /*  타로 응답 데이터 리턴 끝                       */
      /************************************************/

      // C. 정의되지 않은 타입 요청 시
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ success: false, message: `알 수 없는 타입이다냥: ${type}` }),
        }
    }
    // --- [구분자별 로직 끝] ---

    // 성공 응답 반환
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // 필요 시 설정
      },
      body: JSON.stringify({
        success: true,
        requested_type: type,
        timestamp: new Date().toISOString(),
        data: responseData,
      }),
    }
  } catch (err) {
    console.error('운영 지표 조회 중 에러 발생:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: '서버 에러가 발생했다냥!',
        details: err.message,
      }),
    }
  }
}

/*****************************************************/
/** 타로 응답 데이터 리턴 시작                          */
/*****************************************************/
async function checkResult(event) {
  const { id } = event.queryStringParameters || {}

  console.log('id=' + id)

  if (!id) {
    throw new Error('ID가 필요합니다') // 에러를 던지면 하단 catch에서 처리됨
  }

  // DB 조회
  const { data, error } = await supabase
    .from('tarot_results')
    .select('content, is_complete')
    .eq('id', id)
    .single()

  if (error || !data) {
    // 데이터가 없거나 에러면 완료되지 않은 것으로 리턴
    return { is_complete: false }
  }

  // 성공 시 데이터 알맹이만 리턴!
  return data
}
/*****************************************************/
/** 타로 응답 데이터 리턴 끝                            */
/*****************************************************/

/*****************************************************/
/** 천문 데이터 조회 시작                               */
/*****************************************************/
async function getAstroData() {
  // 1. 한국 시간(KST) 기준 날짜 계산
  // 서버 시간(UTC)에 9시간을 더해 한국 시간을 맞춥니다.
  const curr = new Date()
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000
  const kr_curr = new Date(utc + KR_TIME_DIFF)

  const year = kr_curr.getFullYear().toString()
  // 월은 0부터 시작하므로 +1, 그리고 반드시 2자리(05) 형식을 맞춰야 합니다.
  const month = (kr_curr.getMonth() + 1).toString().padStart(2, '0')

  // Supabase RPC 호출: 함수명과 파라미터를 던집니다.
  const { data, error } = await supabase.rpc('tarot_get_astro', {
    p_year: year, // 예: '2026'
    p_month: month, // 예: '05'
  })

  if (error) throw error

  const result = typeof data === 'string' ? JSON.parse(data) : data

  //console.log('🚀 DB에서 가져온 천문 데이터:\n', JSON.stringify(result, null, 2))

  // data에는 event_text(JSON 문자열)가 들어있으므로 파싱해서 리턴
  return result
}
/*****************************************************/
/** 천문 데이터 조회 끝                                 */
/*****************************************************/
