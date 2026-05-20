import axios from 'axios'

export const handler = async (event) => {
  // 1. 환경 변수 확인 (로그로 찍어서 키가 잘 나오는지 보세요)
  const SERVICE_KEY = process.env.VITE_ASTRO_API_KEY

  //console.log('SERVICE_KEY' + SERVICE_KEY)

  // 1. 한국 시간(KST) 기준 날짜 계산
  // 서버 시간(UTC)에 9시간을 더해 한국 시간을 맞춥니다.
  const curr = new Date()
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000
  const kr_curr = new Date(utc + KR_TIME_DIFF)

  const year = kr_curr.getFullYear().toString()
  // 월은 0부터 시작하므로 +1, 그리고 반드시 2자리(05) 형식을 맞춰야 합니다.
  const month = (kr_curr.getMonth() + 1).toString().padStart(2, '0')

  //console.log(`호출 기준 시간: ${year}년 ${month}월`)

  // 2. URL 구성 (반드시 Full URL)
  // axios의 params 기능을 쓰면 인코딩 이슈를 줄일 수 있습니다.
  const API_URL =
    'https://apis.data.go.kr/B090041/openapi/service/AstroEventInfoService/getAstroEventInfo'

  try {
    const response = await axios.get(API_URL, {
      params: {
        serviceKey: decodeURIComponent(SERVICE_KEY), // 키가 이미 인코딩 되어있을 경우를 대비해 디코딩 후 전달
        solYear: year, // 동적 년도 적용
        solMonth: month, // 동적 월 적용
        _type: 'json', // JSON 응답 강제 (공공데이터 기본은 XML인 경우가 많음)
      },
    })

    // 공공데이터 API의 복잡한 경로를 타고 들어가 실제 배열(item) 추출
    // 데이터가 1개일 때 객체로 오는 경우도 있으니 [].concat으로 배열 보장
    const items = response.data.response.body.items.item || []
    const itemsArray = Array.isArray(items) ? items : [items]

    return {
      statusCode: 200,
      body: JSON.stringify(itemsArray), // 이제 프런트엔드는 바로 .map() 가능!
    }
  } catch (error) {
    // 401 에러 발생 시 여기서 상세 내용을 볼 수 있습니다.
    console.error('API 호출 실패:', error.response ? error.response.status : error.message)

    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ error: '데이터 호출 실패' }),
    }
  }
}
