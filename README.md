# NoBoss

대학 팀플에서 "팀장" 역할 자체를 없애고, 업무 배분·진행 관리·독촉·기여도 집계를 데이터와 규칙으로
대체하는 서비스. unwork 해커톤 프로젝트의 프론트엔드입니다.

## 기술 스택

- **Vite 8** + **React 19** + **TypeScript** (strict)
- **React Router 7** (`BrowserRouter`)
- **Tailwind CSS v4** (`@tailwindcss/vite`, `@theme` 토큰 방식)
- Lint: **oxlint**

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build     # tsc -b && vite build
npm run lint
```

실제 백엔드(`https://noboss-api.kusitms.xyz`)와 연동하려면 `VITE_API_BASE_URL`을 설정하세요. 자세한
백엔드 연동 규칙과 코드 컨벤션은 [`CLAUDE.md`](./CLAUDE.md)를 참고하세요.
