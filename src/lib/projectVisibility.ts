// 실서버(noboss-api)에 쌓인 테스트용 빈 프로젝트(예: "테스트팀", "ㅁ")를 홈/투두 목록에서 가리기
// 위한 임시 데모 큐레이션 필터. 백엔드에 DELETE /projects가 없어 완전히 지울 수 없어서 프론트에서만
// 숨긴다. 실제 팀 생성 플로우(`/team/new` → `POST /projects`)로 새로 만든 프로젝트도 이 배열에
// id가 없으면 안 보이니, 데모 이후 실사용을 열려면 이 필터 자체를 지우거나 새 id를 추가할 것.
export const VISIBLE_BACKEND_PROJECT_IDS = [1]

export function isVisibleBackendProject(id: number): boolean {
  return VISIBLE_BACKEND_PROJECT_IDS.includes(id)
}
