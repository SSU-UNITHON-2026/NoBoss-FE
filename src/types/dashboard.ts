export type TeamDashboardSetupStep = 'invite' | 'common-info' | 'assignment' | 'roadmap'

export type TeamDashboardMode =
  | { phase: 'setup'; step: TeamDashboardSetupStep }
  | { phase: 'progress' }
