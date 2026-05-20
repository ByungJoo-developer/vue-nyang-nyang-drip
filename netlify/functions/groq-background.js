import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai' // Groq은 OpenAI SDK를 사용하면 가장 편합니다.

// 1. 환경변수 로드 (Netlify에 GROQ_API_KEY 추가 잊지 마세요!)
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const groqApiKey = process.env.VITE_GROQ_API_KEY // Groq에서 받은 API Key

// 2. 클라이언트 초기화
const supabase = createClient(supabaseUrl, supabaseKey)
const groq = new OpenAI({
  apiKey: groqApiKey,
  baseURL: 'https://api.groq.com/openai/v1', // Groq 전용 엔드포인트
})

export const handler = async (event) => {
  const body = JSON.parse(event.body)
  const { id, userQuestion } = body

  // supabase.from().upsert 대신 rpc(정의된 함수 이름)를 호출합니다.
  const { error } = await supabase.rpc('tarot_insert_session', {
    p_id: id,
    p_user_question: userQuestion,
  })

  if (error) {
    console.error('데이터 삽입 실패:', error.message)
    // 만약 id가 중복되면 여기서 에러가 발생하므로 예외 처리가 가능합니다.
  }

  // 이후 Groq AI 호출 및 결과 업데이트 로직 진행...

  // 2. 비동기로 Groq 작업 처리 (백그라운드 펑션이 끝까지 대기)
  await processGroq(id, body)

  return {
    statusCode: 202, // Accepted
    body: JSON.stringify({ message: 'Groq process started' }),
  }
}

async function processGroq(id, params) {
  try {
    const result = await callGroq(params) // Groq API 호출

    //console.log('DB 업데이트 시작 (RPC)...')
    //console.log('id' + id)

    const { error } = await supabase.rpc('tarot_update_result', {
      p_id: id,
      p_content: result.content,
      p_total_tokens: result.totalTokens,
      p_remaining_tokens: result.limits.remainingTokens,
      p_remaining_requests: result.limits.remainingRequests,
      p_reset_time: result.limits.resetTime,
    })

    if (error) {
      throw error
    }

    //console.log('DB 업데이트 완료!')
  } catch (error) {
    console.error('DB 업데이트 실패:', error.message)
    // 필요시 사용자에게 실패 상태를 알리는 추가 DB 업데이트 로직 작성 가능
  }
}

async function callGroq(params) {
  try {
    const now = new Date()

    //console.log('params.cardResults:', params.cardResults)
    //console.log(JSON.stringify(params.cardResults))

    //let dateStr = now.toLocaleDateString('ko-KR') // "2026. 5. 9." 형태

    // 1. 현재 날짜 문자열 "2026. 5. 14." -> 숫자 20260514로 변환
    let tempDateStr = now.toLocaleDateString('ko-KR') // "2026. 5. 14."
    const parts = tempDateStr.split('.').map((p) => p.trim()) // ["2026", "5", "14", ""]
    const dateStr = parseInt(parts[0] + parts[1].padStart(2, '0') + parts[2].padStart(2, '0'))

    /********************************************************/
    /* 카드 카운트 체크 시작 -                                 */
    /********************************************************/
    const cardListCountCheck = params.cardResults.split('\n').filter((line) => line.trim() !== '')

    // 2. 이제 진짜 카드 개수가 나온다냥!
    const cardCount = cardListCountCheck.length

    let AddContent = ''

    // 3. 길이에 따른 별도 로직 투입!
    if (cardCount === 3) {
      //console.log('3장 스프레드: 과거-현재-미래 레이아웃 적용냥!')
      AddContent = '\n\n 3 카드 스프레드 입니다  \n'
      // 여기에 3장 전용 로직 넣기
    } else if (cardCount === 5) {
      //console.log('5장 스프레드: 관계운/심층 분석 레이아웃 적용냥!')
      AddContent =
        '\n\n---\n[양자택일 배열 가이드]\n1번: 공통 상황\n2,3번: 첫 번째 선택지(A)의 과정과 결과\n4,5번: 두 번째 선택지(B)의 과정과 결과\n이 구조에 맞춰 분석해 주세요.\n'
    } else if (cardCount === 10) {
      //console.log('10장 스프레드: 켈틱 크로스 대형 레이아웃 적용냥!')
      AddContent = '\n\n 켈틱크로스 입니다.  \n'
    }

    /********************************************************/
    /* 카드 카운트 체크 끝                                      */
    /*********************************************************/

    const userQ = params.userQuestion

    let targetDate = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    // 🔴 기본값을 2(월간 모드)로 설정합니다! (범용 질문은 이달 전체의 흐름을 타도록)
    let p_mode = 2

    // 1. [모드 & 날짜 판별] 딱 깔끔하게 4가지 케이스만 체크합니다.
    if (userQ.includes('오늘') || userQ.includes('현재') || userQ.includes('지금')) {
      // "오늘"을 명시했다면 날짜는 그대로 두고 모드만 1(일간)로 스위칭!
      p_mode = 1
    } else if (userQ.includes('내일')) {
      targetDate.setDate(targetDate.getDate() + 1) // 날짜만 내일로 변경 (p_mode는 1 유지)
      p_mode = 1
    } else if (userQ.includes('어제')) {
      targetDate.setDate(targetDate.getDate() - 1) // 날짜만 어제로 변경 (p_mode는 1 유지)
      p_mode = 1
    } else if (/(이번달|이달|한달|월간)/.test(userQ)) {
      p_mode = 2 // 🔴 월간 모드로 스위칭 (날짜는 오늘 날짜 기준 유지)
    } else if (/(올해|올한해|신년|연간|총운)/.test(userQ)) {
      p_mode = 3 // 🔴 연간 모드로 스위칭 (날짜는 오늘 날짜 기준 유지)
    }

    // 🔴 1. 변수를 if문 바깥에 미리 선언해 둡니다. (기본값은 '특이 현상 없음' 문구로 세팅)

    // 2. DB가 원하는 'YYYYMMDD' 문자열 포맷으로 변환
    const targetDateStr =
      targetDate.getFullYear() +
      String(targetDate.getMonth() + 1).padStart(2, '0') +
      String(targetDate.getDate()).padStart(2, '0')

    // 💥 3. 완벽해진 파라미터로 Supabase RPC 한 방에 호출!
    const { data, error } = await supabase.rpc('tarot_get_astro_summary', {
      p_date: targetDateStr,
      p_mode: p_mode,
    })

    if (data && data.length > 0) {
      past_events = data[0].past_events || '과거 특이 천문 현상 없음'
      current_events = data[0].current_events || '현재 특이 천문 현상 없음'
      future_events = data[0].future_events || '미래 특이 천문 현상 없음'
    }

    //console.log(past_events)
    //console.log(current_events)
    //console.log(future_events)

    // 4. Groq 모델 호출 (llama-3.1-8b-instant는 무료 한도가 하루 14,400회입니다)
    const response = await groq.chat.completions
      .create({
        messages: [
          {
            role: 'system',
            content:
              "당신은 장난꾸러기지만 점술에는 천재적인 능력을 가진 마스터 고양이 '혜미'입니다. " +
              '다음의 지침에 따라 타로 결과를 작성하세요. ' +
              '[답변 구조] ' +
              "1. 혜미의 인사: '냥'이나 '다옹'을 섞어 귀엽고 장난스럽게 시작하세요. (예: 안녕 하냥! 내가 네 운명을 훔쳐보러 왔다옹!) " +
              '2. 타로 본문: 카드의 의미를 매우 진지하고 깊이 있게 분석하세요. 단, 말투는 친절한 현대적 구어체를 유지해야 합니다. ' +
              "3. 혜미의 한마디: 마지막에 다시 '냥'을 섞어 위트 있는 응원이나 장난 섞인 조언으로 마무리하세요. " +
              '[반드시 지켜야 할 5대 원칙] ' +
              "1. 모든 답변은 '순수 한글'로만 작성하세요. (영어나 외국어 금지) " +
              "2. 어려운 한자어나 한자 표기를 절대 사용하지 마세요. (예: '길흉화복' -> '좋고 나쁜 일', '상충' -> '부딪힘') " +
              '3. 초등학생도 한 번에 읽고 이해할 수 있는 쉬운 구어체(~해요, ~입니다)를 사용하세요. ' +
              '4. 냉정한 통찰력 유지: 혜미는 점술에 있어서 거짓말을 하지 않습니다. 카드에 부정적인 의미나 경고가 있다면, ' +
              '   사용자의 기분을 맞추기 위해 억지로 좋게 포장하지 마세요. 안 좋은 결과일수록 더 명확하게 사실대로 짚어주되, 혜미만의 방식으로 어떻게 조심하거나 대비하면 좋을지 실질적인 조언을 덧붙여주세요. ' +
              '5. 전문 용어가 필요하다면 한자어 대신 쉬운 우리말로 풀어서 설명하세요. ' +
              "   분석 시 천문 데이터를 참고하되, '우주의 기운', '우주의 흐름', '사주/운세' 같은 표현은 절대 쓰지 마세요.  \n" +
              "\n\n 대신 **'천문의 배치'**나 '성계의 흐름' 같은 담백하고 전문적인 용어를 사용하여 타로 해석에 녹여주세요    \n" +
              '6. ★천문의 배치 결합 원칙 (필수)★ ' +
              "   제공된 [과거/현재/미래의 천문 흐름]은 모든 사람에게 내리는 '우주적 날씨'입니다. " +
              "   혜미는 유저가 뽑은 '타로 카드들의 의미'를 이 '우주적 날씨'와 연결하여 오직 이 유저에게만 해당하는 개인화된 리딩을 해야 합니다. " +
              "   - 천문 현상이 거칠거나 어두운 흐름일 때: 유저가 긍정적인 카드를 뽑았다면 '이 거센 우주적 흐름 속에서도 너는 카드가 뜻하는 강력한 힘으로 위기를 기회로 바꾼다'고 해석하세요. " +
              "   - 천문 현상이 밝거나 안정적인 흐름일 때: 유저가 경고성 카드를 뽑았다면 '우주의 성계는 평온하지만 네 마음에 방심이 들이치고 있으니 카드가 말하는 주의점을 꼭 챙겨라'고 해석하세요. " +
              "   - 절대로 '오늘 수성이 역행하니 너는 무조건 나쁘다'처럼 천문 현상 하나만으로 운세를 단정 짓지 마세요. " +
              "   - '우주의 기운/흐름', '사주/운세' 표현은 절대 금지이며, 반드시 **'천문의 배치'**나 '성계의 흐름'이라는 담백한 용어를 사용해 타로 카드의 조미료(가중치)로만 버무려야 합니다. " +
              ' 7. 마지막으로 카드를 개별적으로 설명하는 데 그치지 말고, 카드들 사이의 인과관계와 전체적인 이야기 흐름(Storytelling)을 중심으로 해석하세요' +
              AddContent + // 카드 숫자별 지침
              '[혜미의 행동 묘사] ' +
              '문장 중간중간 혜미의 행동을 [ ] 안에 넣어 생동감을 더하세요. (예: [앞발로 카드를 꾹 누르며], [꼬리를 살랑거리며 고민에 빠짐]) ' +
              "'오늘' 의 카드 해석에는 현재월 천문정보 로 매칭되는 날짜만 사용하고, 질문이 미래를 묻거나 '오늘' 인 경우에만 '미래 엿보기'를 추가해서 현재월 천문정보를 활용하세요.",
          },
          {
            role: 'user',
            content: `
            사용자 질문: ${params.userQuestion}
            [과거의 천문 흐름]
            ${past_events}
            [현재(당일)의 천문 흐름]
            ${current_events}
            [미래의 천문 흐름]
            ${future_events}
            선택한 타로 카드들: ${JSON.stringify(params.cardResults)}
            현재일 : ${dateStr}
          `,
          },
        ],

        // 현재월 천문정보: ${params.todayAstro}

        //model: 'llama-3.1-8b-instant', // 가장 빠르고 한도가 넉넉한 모델
        //temperature: 0.7, // 해석의 창의성을 위해 0.7 정도 추천
        model: 'openai/gpt-oss-120b',
        //model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        //temperature: 0.85,
        //temperature: 0.7,
        top_p: 0.9,
      })
      .asResponse()

    //const aiResponse = completion.choices[0].message.content
    const headers = response.headers // 응답 헤더

    // 헤더에서 남은 한도 정보 추출 (Groq 전용 헤더)
    const remainingTokens = headers.get('x-ratelimit-remaining-tokens')
    const remainingRequests = headers.get('x-ratelimit-remaining-requests')
    const resetTime = headers.get('x-ratelimit-reset-tokens')

    /*
    console.log('================ [Groq Response Start] ================')
    console.log(aiResponse)
    console.log('================ [Groq Response End] ==================')
    */

    const completion = await response.json()

    return {
      content: completion.choices[0].message.content,
      usage: completion.usage, // 토큰 사용량 (prompt, completion, total)
      model: completion.model, // 사용된 모델 정보
      totalTokens: completion.usage.total_tokens,
      limits: {
        remainingTokens, // 👈 집사가 제일 궁금해하는 '남은 토큰'!
        remainingRequests, // 남은 요청 횟수
        resetTime, // 한도 초기화까지 남은 시간
      },
    }

    //return aiResponse
  } catch (error) {
    console.error('Groq API 에러:', error)

    // 에러 상태 코드에 따른 분기 (Groq/OpenAI 규격)
    if (error.status === 429) {
      return '현재 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요. (Groq Rate Limit)'
    }

    return `해석 중 오류 발생: ${error.message || '잠시 후 다시 시도해 주세요.'}`
  }
}
