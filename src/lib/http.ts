export interface ApiSuccessResponse<T> {
  success: true
  status: number
  data: T
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  status: number
  code: string
  message: string
  path: string
  timestamp: string
  errors: unknown[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const body = (await res.json()) as ApiSuccessResponse<T> | ApiErrorResponse
  if (!body.success) {
    throw new Error(body.message)
  }
  return body.data
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'POST', body: payload ? JSON.stringify(payload) : undefined }),
  patch: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'PATCH', body: payload ? JSON.stringify(payload) : undefined }),
}
