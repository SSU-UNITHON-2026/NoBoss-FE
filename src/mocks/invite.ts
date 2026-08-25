export interface InviteMember {
  id: string
  name: string
  department: string
  isMe: boolean
  joined: boolean
}

export const inviteMembers: InviteMember[] = [
  { id: 'u-yunseah', name: '윤세아', department: '서비스디자인학과', isMe: true, joined: true },
  { id: 'u-jeongharam', name: '정하람', department: '컴퓨터공학과', isMe: false, joined: true },
  { id: 'u-otaeyun', name: '오태윤', department: '경영학과', isMe: false, joined: false },
  { id: 'u-baesihyun', name: '배시현', department: '산업공학과', isMe: false, joined: false },
]

export const inviteCode = 'NB-7K42-ONBD'
