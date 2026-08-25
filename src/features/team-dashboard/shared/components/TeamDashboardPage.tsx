import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AssignmentStep } from '@/features/team-dashboard/assignment/components/AssignmentStep'
import { CommonInfoStep } from '@/features/team-dashboard/common-info/components/CommonInfoStep'
import { InviteStep } from '@/features/team-dashboard/invite/components/InviteStep'
import { ProgressDashboard } from '@/features/team-dashboard/progress/components/ProgressDashboard'
import { TemplateRoadmapStep } from '@/features/team-dashboard/roadmap/components/TemplateRoadmapStep'
import type { TeamDashboardMode, TeamDashboardSetupStep } from '@/types/dashboard'
import { StepIndicator } from './StepIndicator'

const setupOrder: TeamDashboardSetupStep[] = ['invite', 'common-info', 'assignment', 'roadmap']

export function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const [mode, setMode] = useState<TeamDashboardMode>({ phase: 'setup', step: 'invite' })

  // 이미 초기 설정을 마친 팀은 바로 진행관리 모드로 진입한다.
  if (teamId !== 'new') {
    return <ProgressDashboard />
  }

  function goToNextStep() {
    if (mode.phase !== 'setup') return
    const index = setupOrder.indexOf(mode.step)
    const next = setupOrder[index + 1]
    if (next) {
      setMode({ phase: 'setup', step: next })
    } else {
      // F-27: 로드맵 확정 시 화면 전환 없이 진행관리 모드로 자동 전환
      navigate('/team/p-onboard')
    }
  }

  return (
    <div>
      <StepIndicator current={mode.phase === 'setup' ? mode.step : 'progress'} />
      <div className="mt-8">
        {mode.phase === 'setup' && mode.step === 'invite' && <InviteStep onComplete={goToNextStep} />}
        {mode.phase === 'setup' && mode.step === 'common-info' && <CommonInfoStep onComplete={goToNextStep} />}
        {mode.phase === 'setup' && mode.step === 'assignment' && <AssignmentStep onComplete={goToNextStep} />}
        {mode.phase === 'setup' && mode.step === 'roadmap' && <TemplateRoadmapStep onComplete={goToNextStep} />}
      </div>
    </div>
  )
}
