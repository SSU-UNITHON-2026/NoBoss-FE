# NoBoss — Frontend 작업 지침

unwork 해커톤 프로젝트. Vite + React 19 + TypeScript + Tailwind v4 프론트엔드.

## 제품 컨셉 (코드 판단 기준으로 항상 참고)

**한 줄 정의**: 대학 팀플에서 "팀장" 역할 자체를 없애고, 업무 배분·진행 관리·독촉·기여도 집계를
데이터와 규칙으로 대체하는 서비스.

**절대 놓치면 안 되는 프레이밍**: "AI가 팀장 업무를 대신 해준다"가 아니라 "팀장이라는 역할과 그로
인해 파생되던 일 자체가 사라진다"가 방향이다. 기능을 추가/수정할 때 이 프레이밍에 어긋나는 UI
(예: "팀장 승인" 버튼, 팀장을 지정하는 흐름, 특정 인물에게 책임을 몰아주는 문구)는 만들지 않는다.

**사라져야 하는 것들** — 팀장 정하기, 배분 갈등, 무임승차 뒷담화, 최종 제출 책임의 쏠림, 평가 불공정
시비, 공개적 독촉으로 인한 망신. 화면/카피를 쓸 때 이 목록에 반하는 표현(팀장, 승인, 공개 지적 등)을
피한다.

**독촉하기(F-24)는 반드시 개인 전용이다.** 발송 결과는 발신자에게만 보이고, 팀 채팅이나 다른 팀원
화면에는 절대 노출하지 않는다. 이 요구사항은 프로덕트의 핵심 차별점이므로 실수로 공개 노출시키지
않도록 특히 주의한다.

## 기술 스택 & 실행

- Vite 8, React 19, TypeScript(strict, `noUnusedLocals`/`noUnusedParameters` on), React Router 7 (`BrowserRouter`)
- Tailwind CSS v4 (`@tailwindcss/vite` 플러그인, `@theme` 토큰 방식 — `src/index.css` 참고. 별도 `tailwind.config` 없음)
- Lint: `oxlint` (`npm run lint`). ESLint 없음.
- 빌드: `npm run build` (`tsc -b && vite build`), 개발 서버: `npm run dev`
- 테스트 프레임워크 없음 — 새로 도입하려면 먼저 사용자에게 확인
- 경로 별칭 `@/*` → `src/*` (vite.config.ts, tsconfig.app.json 양쪽에 정의되어 있음, 새 별칭 추가 시 두 곳 다 수정)

## 백엔드 API (실제 서버 존재 — 연동 전 반드시 확인)

실제 백엔드가 떠 있고 Swagger로 스펙을 확인할 수 있다:
- UI: https://noboss-api.kusitms.xyz/swagger-ui/index.html#/
- 스펙 JSON(그대로 curl/fetch 가능): https://noboss-api.kusitms.xyz/v3/api-docs

- `src/api/*.ts`에 엔드포인트를 추가·수정하기 전에는 항상 위 스펙에서 실제 요청/응답 스키마를 먼저
  확인한다. 프론트에서 기대하는 타입(`types/*.ts`)과 실제 백엔드 응답 스키마가 다른 경우가 많으므로
  추측으로 연동하지 않는다 — 특히 필드명(`owner`가 멤버 id가 아니라 이름 문자열, 공동 담당은
  `"공동"` 문자열로 내려옴)과 중첩 구조(로드맵 `RoadmapStep[]`처럼 프론트가 기대하는 중첩 형태를
  백엔드가 그대로 주지 않고 평평한 리스트 + `stage`/`stageName` 필드로 내려주는 식)에 유의.
- 인증은 없지만 **CORS가 `http://localhost:5173` origin으로만 허용**되어 있다(다른 포트는
  `403 Invalid CORS request`). Vite 기본 포트(5173)에서 `VITE_API_BASE_URL=https://noboss-api.kusitms.xyz/api/v1`로
  설정하면 바로 호출 가능하다(`src/lib/http.ts` 참고, 기본값은 `/api/v1`). 다른 포트에서 확인해야
  하면 `vite.config.ts`의 `server.proxy`로 우회하거나(브라우저 기준 same-origin이 되어 CORS 자체가
  적용되지 않음), 5173에서만 테스트한다.
- 응답 포맷은 이미 `{ success, status, data, timestamp }`로 문서화된 그대로이므로 `src/lib/http.ts`의
  기존 언래핑 로직을 그대로 쓰면 된다.
- (2026-08-26 기준) 노출된 엔드포인트는 5개뿐 — `GET /api/v1/project`, `GET /api/v1/tasks`,
  `GET /api/v1/tasks/risks`, `PATCH /api/v1/tasks/{taskId}/done`, `GET /api/health`. 팀 생성/초대/멤버/
  채팅/독촉/퀵애드 관련 엔드포인트는 아직 없다 — 해당 기능은 백엔드가 추가되기 전까지 계속
  `teamStore.ts`/`nudgeStore.ts`(localStorage) mock으로 유지한다.
- 백엔드는 현재 프로젝트 1개(id=1, "B_LANK" 팀)만 하드코딩되어 있고, 로드맵 단계(stage) 자체의
  메타데이터(라벨/기한 등 5단계 뼈대)를 내려주는 엔드포인트가 없다 — `Task`마다 `stage`(숫자)+
  `stageName`(문자열)만 붙어서 온다. 5단계 로드맵 뼈대(`roadmapTemplates.ts`)는 계속 프론트에서
  구성해야 한다.
- 백엔드가 프로젝트를 1개만 지원하므로, 실서버 연동 화면은 `/team/live` 경로로 접근한다
  (`ProgressDashboard.tsx`의 `isLiveBackend` 분기). 로컬 mock 팀(`teamStore.ts`)이나 온보드 mock
  데모(`p-onboard`)와는 별개 경로이니 섞어 쓰지 않는다.

## 폴더 구조 (기능 단위)

```
src/
  api/            도메인별 API 함수 (project.ts, tasks.ts, messages.ts)
  components/ui/  범용 프리미티브 (Button, Card, Badge, Tag, Input, Avatar, ProgressBar, StatCard)
  components/layout/  AppShell, Sidebar 등 전역 레이아웃
  features/<도메인>/components/  화면·기능 단위 컴포넌트
    team-dashboard/
      invite/ common-info/ assignment/ roadmap/  → 초기 설정 1~4단계
      chat/     → F-23 팀 채팅 패널 (참여자+AI 공존)
      progress/ → 진행관리 모드 (F-14~F-21)
      nudge/    → F-24 독촉하기 (개인 전용, 아직 비어있음)
      shared/   → TeamDashboardPage(모드 전환 오케스트레이터), StepIndicator
  hooks/ lib/ mocks/ store/ types/
```

새 기능은 `features/<도메인>/components/`에 추가한다. 여러 화면에서 재사용하는 순수 UI는
`components/ui/`로 올린다. 도메인 타입은 `types/<도메인>.ts`에 정의하고 컴포넌트에서
`import type`으로 가져온다 (`verbatimModuleSyntax: true`이므로 타입 전용 import는 항상
`import type`을 명시해야 함).

## 코드 컨벤션 (기존 코드에서 관찰된 패턴 — 그대로 따를 것)

- 함수형 컴포넌트, named export만 사용 (`export function Foo()`, default export 없음 — `App.tsx` 제외)
- 스타일은 Tailwind 유틸리티 클래스 + `cn()` 헬퍼(`src/lib/cn.ts`)로 병합. `components/ui/Button.tsx`가
  variant 패턴의 기준: `type Variant = 'primary' | 'secondary' | 'ghost'` + `Record<Variant, string>` 맵
- 색상은 `index.css`의 `@theme` 토큰만 사용 (`brand-*`, `ink-*`, `surface-*`, `danger-*`). 임의 hex 값을
  Tailwind 클래스에 직접 넣지 않는다.
- API 호출은 `src/lib/http.ts`의 `http.get/post/patch`를 통해서만 수행. 백엔드 응답은
  `{ success, status, data, timestamp }` / `{ success:false, code, message, ... }` 포맷을 가정하고
  `http`가 이미 언래핑해서 `data`만 반환하므로, 호출부에서 `success` 필드를 다시 체크하지 않는다.
- `src/api/<도메인>.ts` 파일에 `// GET /api/v1/...` 같은 주석으로 실제 엔드포인트를 명시하고,
  함수 하나당 엔드포인트 하나로 얇게 감싼다 (`api/project.ts` 참고).
- Mock 데이터 전환은 `src/lib/env.ts`의 `USE_MOCKS`(`VITE_USE_MOCKS==='true'`) 플래그로 처리한다.
  더미 데이터를 화면에 하드코딩하지 말고 `src/mocks/*.ts`에 정의한 뒤 플래그로 분기한다.
- 브라우저 로컬 영속 상태(현재 팀 생성 흐름)는 `src/lib/teamStore.ts` 패턴처럼 `localStorage` +
  `STORAGE_KEY` 상수 + `readAll/writeAll` 헬퍼로 감싼다. 직접 `localStorage.getItem`을 컴포넌트에서
  호출하지 않는다.
- 도메인 로직에서 나오는 주석은 관련 기능 ID(F-XX)를 참조해 의도를 남긴다
  (예: `// F-27: 로드맵 확정 시 화면 전환 없이 진행관리 모드로 자동 전환`). 새 기능을 구현할 때도
  이 스펙 ID를 주석에 남기면 다음 작업자가 기능명세서와 대조하기 쉽다.
- UI 카피와 주석은 한국어. 식별자(변수/함수/타입명)는 영어.

## 스크린별 라우트 구조

`App.tsx`에 정의된 라우트 전체 (모두 `BrowserRouter` 하위, `AppShell`로 감싼 라우트는 로그인 후
공통 레이아웃 — 사이드바 등 — 적용됨을 의미):

| 경로 | 컴포넌트 | AppShell | 대응 화면(화면별 기능정리) | 관련 기능 ID |
|---|---|---|---|---|
| `/` | `LandingPage` | ✗ | 1. 랜딩 페이지 | 없음 |
| `/signup` | `SignupForm` | ✗ | 2. 회원가입 | F-01 |
| `/login` | `LoginForm` | ✗ | 3. 로그인 | F-04 |
| `/onboarding` | `OnboardingPage` | ✗ | 4. 온보딩 (최초 가입 후 1회) | F-02, F-05(안내 문구만) |
| `/home` | `HomePage` | ✓ | 5. 홈 (로그인 후 첫 진입) | F-06(진입점), F-15(요약형), F-16/F-26(미리보기) |
| `/todo` | `TodoListPage` | ✓ | 7. To Do List (개인 화면, 별도 유지) | F-13b, F-18b, F-19, F-20 |
| `/profile` | `ProfilePage` | ✓ | 8. 프로필 설정 | F-01(수정), F-03, F-05(안내 문구) |
| `/team/new` | `TeamDashboardPage` (setup phase) | ✓ | 6. 팀 대시보드 — 초기 설정 모드 1~4단계 | F-08, F-06b, F-28, F-09~F-11, F-07, F-12, F-23 |
| `/team/:teamId` (`teamId !== 'new'`) | `TeamDashboardPage` → `ProgressDashboard` | ✓ | 6. 팀 대시보드 — 진행관리 모드 | F-13~F-18, F-20, F-21, F-23, F-24 |
| `*` | → `/`로 redirect | — | — | — |

**라우팅 관련 규칙**

- 팀 대시보드는 **경로가 두 개가 아니라 하나의 동적 세그먼트**(`/team/:teamId`)이고,
  `teamId === 'new'`인지 여부로 setup/progress 두 모드를 가른다 (`TeamDashboardPage.tsx`).
  새 팀 생성 시 별도 `/team/create` 같은 경로를 만들지 않는다 — 홈 화면 "＋ 새 팀프로젝트 만들기"는
  `<Link to="/team/new">`로 이 라우트에 진입한다.
- setup phase 안의 4단계(초대/공동설정/역할분배/로드맵)는 **URL이 바뀌지 않는다** — 쿼리 파라미터나
  하위 경로(`/team/new/invite` 등)로 단계를 표현하지 않고, `TeamDashboardPage` 내부 state
  (`TeamDashboardMode`, `types/dashboard.ts`)로만 관리한다. F-27(자동 모드 전환) 역시 URL 변경 없이
  이 state 전환만으로 처리한다. 로드맵 확정 시에만 `createTeam()`으로 실제 팀 ID를 발급받아
  `navigate(/team/${team.id})`로 "새 팀 만들기" 세션을 실제 팀 화면으로 바꿔치기한다.
- 알림 센터(F-25/F-26)는 화면 미확정 상태 — 새 라우트를 임의로 만들지 말고, 필요하면 먼저 어디에
  배치할지 확인한다.
- 동료 리액션(F-22)도 화면 미확정 — To Do List 업무 카드에 추가 예정이라고만 기록되어 있고 아직
  라우트/컴포넌트 없음.

## 핵심 도메인 플로우 — 팀 대시보드 (가장 복잡한 화면)

`features/team-dashboard/shared/components/TeamDashboardPage.tsx`가 오케스트레이터다. **하나의
화면·URL(`/team/:teamId`)** 안에서 내부 상태(`TeamDashboardMode`, `types/dashboard.ts`)로 콘텐츠만
바꾼다 — 절대 별도 라우트/페이지로 쪼개지 않는다.

1. **초기 설정 모드** (`phase: 'setup'`), 4단계 순서 고정: `invite → common-info → assignment → roadmap`
   - 팀원 초대(F-08) → 공동 설정(F-06b, F-28) → 역할 분배(F-09~F-11) → 로드맵(F-07, F-12)
   - 각 단계는 상단 `StepIndicator`로 진행 상태 표시, 우측에는 **항상** 채팅 패널(F-23)이 함께 떠 있다
2. 4단계(로드맵) 확정 시 **F-27**: 화면 전환 없이 `phase: 'progress'`로 자동 전환
3. **진행관리 모드** — `ProgressDashboard`가 D-day/진행률/지연위험 카드(F-14), 지연 배너(F-16),
   참여자 현황(F-15), 내 할 일(F-13), 재분배 제안(F-17)을 렌더링

**F-23/F-28 채팅 규칙**: 참여자 메시지와 AI 메시지는 하나의 채팅창(`TeamChatPanel`)에 공존한다.
분리된 채팅창을 만들지 않는다. AI 메시지는 배지로만 구분한다(`ChatMessage.authorId === 'ai'`).
공동설정 단계에서 채팅에 자연어로 입력한 정보(팀명, 마감일 등)는 AI가 파싱해 좌측 폼에 자동
반영해야 한다(F-28) — 폼 직접 입력과 병행 가능해야 하며, 어느 한쪽만 지원하도록 구현하지 않는다.
`mocks/project.ts`의 `onboardChatMessages`에 `proposedAction` 필드로 AI가 제안하는 액션(재분배 등)의
모양이 정의되어 있으니 참고할 것 — AI 제안은 즉시 반영되지 않고 팀원 전원 확인 후 적용된다.

## 우선순위 스코프 (기능명세서 v0.5 기준)

- **P0** (해커톤 데모 필수, 항상 우선 구현): F-01~04, F-06, F-06b, F-07~09, F-11~16, F-18, F-20, F-21,
  F-23, F-24, F-27, F-13b, F-18b, F-19
- **P1** (여유 있으면 포함): F-10(이력 기반 매칭), F-17(다이나믹 리밸런싱), F-25/F-26(알림), F-28(AI 채팅 공동설정)
- **P2 / 이번 범위 제외** (요청 없이 구현하지 말 것): F-05(역할 세분화), F-22(동료 리액션)

작업 요청이 모호할 때는 P0 시나리오(회원가입 → 팀 생성 → 초기 설정 → 진행관리 → 완료 처리)를
기준으로 우선순위를 판단한다.

## 명시적으로 제외/보류된 기능 — 요청받지 않으면 만들지 말 것

- **팀플 온도**(상호 평가/비교 점수) — 무임승차 시비를 재생산할 위험으로 제외. 진행률(%)과
  참여자 현황으로 대체됨.
- **홈 화면의 "내 선호 역할" 카드** — 선호업무는 프로필 화면에서만 다룬다.
- **공통/세부 역할 구분** — 2차 로드맵. 현재는 단일 선호업무 태그 체계만 사용.
- **초기 설정을 별도 화면으로 분리** — 절대 하지 않는다. 팀 대시보드 하나로 통합(F-27 참고).
- **초기 설정 중 채팅 숨기기** — 하지 않는다. 전 단계 상시 노출이 요구사항.
- **역할 분배 방식(AI/수동) 선택 UI** — 배분은 항상 AI/랜덤 제안 + 팀원 확인 구조로 통일, 선택
  옵션을 만들지 않는다.
- **독촉 결과를 팀 채팅에 공개** — 절대 금지. 독촉하기는 개인 전용.
- 팀원평가, 팀플평가-마케팅 연계, 구독 전용 요약 보고서 — 이번 MVP 범위 밖.

## 참고 문서

세부 기능 명세(입출력, 우선순위)는 `~/Downloads/유니톤/NoBoss_기능명세서_v0.5.md`,
화면별 매핑은 `NoBoss_화면별_기능정리_v3.md`, 제품 배경은 `NoBoss_기획서.md` /
`NoBoss_unwork_기획정리.pdf` 참고 (레포 밖 파일).
