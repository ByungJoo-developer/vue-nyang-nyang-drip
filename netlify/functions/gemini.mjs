/*
const { GoogleGenerativeAI } = require('@google/generative-ai')

// Netlify V2 함수 방식 (export default 사용)
export default async (req, context) => {
  // POST 요청만 허용
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const { cardResults, userQuestion, todayAstro } = await req.json()
    const API_KEY = process.env.VITE_GEMINI_API_KEY

    if (!API_KEY) {
      return new Response('API_KEY Missing', { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

    const prompt = `질문: ${userQuestion}\n카드 결과: ${cardResults}\n우주 흐름: ${todayAstro}\n이 정보를 바탕으로 타로 해석을 해줘.`

    // 스트리밍 시작
    const result = await model.generateContentStream(prompt)

    // 응답 스트림 생성
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          // 브라우저가 읽을 수 있도록 인코딩해서 전달
          controller.enqueue(new TextEncoder().encode(text))
        }
        controller.close()
      },
    })

    // 텍스트 스트림 응답 반환
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Gemini Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
*/

import { GoogleGenerativeAI } from '@google/generative-ai'

export default async (req, context) => {
  // 1. 요청 메서드 체크
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // 2. 환경 변수 확인 (로컬 ntl dev 실행 시 .env 파일 읽어옴)
    const API_KEY = process.env.VITE_GEMINI_API_KEY
    if (!API_KEY) {
      console.error('환경 변수 에러: VITE_GEMINI_API_KEY가 없습니다.')
      return new Response(JSON.stringify({ error: 'API Key Missing' }), { status: 500 })
    }

    // 3. 입력 데이터 파싱
    const { cardResults, userQuestion, todayAstro } = await req.json()

    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

    const prompt = `질문: ${userQuestion}\n카드 결과: ${cardResults}\n우주 흐름: ${todayAstro}\n이 정보를 바탕으로 타로 해석을 해줘.`

    // 4. 스트리밍 생성
    const result = await model.generateContentStream(prompt)

    // 5. 스트림 생성 및 반환
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
        } catch (err) {
          console.error('스트리밍 도중 에러:', err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('최종 서버 에러:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
