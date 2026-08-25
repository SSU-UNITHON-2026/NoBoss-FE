import type { InviteMember } from '@/mocks/invite'
import type { PreferredTaskTag } from '@/types/user'

export const STAGE_COUNT = 5

// F-10 라이트 버전: 백엔드에 팀원 프로필 API가 없어 다른 팀원의 선호 업무 태그는 알 수 없고,
// 지금 로그인한 "나"의 태그(프로필에서 저장한 값)만 안다. 그래서 이력 기반 최적화가 아니라
// 5단계 각각을 대표하는 태그와 "나"의 선호 태그가 겹칠 때만 그 단계를 우선 배정하는 가벼운
// 가중치만 반영한다. 인원별 총 배정 수(공정성)는 순수 라운드로빈과 항상 동일하게 유지하고,
// "어느 단계를 누가 맡는지"만 태그에 맞춰 살짝 조정한다.
const STAGE_TAGS: Record<number, PreferredTaskTag[]> = {
  1: ['기획·PM', '리서치'],
  2: ['리서치', '디자인'],
  3: ['디자인', '개발·구현'],
  4: ['글쓰기·보고서', '개발·구현'],
  5: ['발표·커뮤니케이션', '편집·검토'],
}

export interface AssignmentSlot {
  stage: number
  owner: string
  /** 선호 태그가 겹쳐서 라운드로빈 순서 대신 우선 배정된 경우 true */
  matchedPreference: boolean
}

export function joinedOwnerNames(members: InviteMember[]): string[] {
  const joinedNames = members.filter((m) => m.joined).map((m) => m.name)
  return joinedNames.length > 0 ? joinedNames : ['나']
}

export function buildAssignmentSlots(
  members: InviteMember[],
  preferredTagsByName: Record<string, PreferredTaskTag[]> = {},
): AssignmentSlot[] {
  const owners = joinedOwnerNames(members)

  // 순수 라운드로빈과 인원별 총 배정 수가 같도록 몫을 먼저 계산해둔다
  const quota: Record<string, number> = {}
  for (let i = 0; i < STAGE_COUNT; i++) {
    const owner = owners[i % owners.length]
    quota[owner] = (quota[owner] ?? 0) + 1
  }

  const slots: AssignmentSlot[] = []
  for (let stage = 1; stage <= STAGE_COUNT; stage++) {
    const stageTags = STAGE_TAGS[stage] ?? []
    const preferredOwner = owners.find(
      (name) => (quota[name] ?? 0) > 0 && stageTags.some((tag) => preferredTagsByName[name]?.includes(tag)),
    )

    let owner = preferredOwner
    if (!owner) {
      // 겹치는 태그가 없으면 원래 라운드로빈 순서에서 가장 가까운, 아직 몫이 남은 사람을 찾는다
      for (let k = 0; k < owners.length; k++) {
        const candidate = owners[(stage - 1 + k) % owners.length]
        if ((quota[candidate] ?? 0) > 0) {
          owner = candidate
          break
        }
      }
    }
    // owners.length > 0이고 quota 총합이 STAGE_COUNT이므로 owner는 항상 찾아진다
    owner = owner as string

    quota[owner] -= 1
    slots.push({ stage, owner, matchedPreference: owner === preferredOwner })
  }
  return slots
}
