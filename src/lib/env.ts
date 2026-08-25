export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

// F-28: 공동설정 채팅 자연어 파싱을 담당하는 별도 AI 백엔드(FastAPI, main 백엔드와 무관)
export const AI_API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL ?? 'https://web-production-dc097.up.railway.app'
