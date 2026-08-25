interface DelayBannerProps {
  count: number
  onReview: () => void
}

// F-16: 상단에서 지연 위험을 한눈에 알리는 배너. 특정 팀원을 지목하지 않고 건수만
// 요약해 보여준다 — 개인을 공개 지적하지 않는다는 원칙은 DelayRiskPanel에서 유지한다.
export function DelayBanner({ count, onReview }: DelayBannerProps) {
  if (count === 0) return null

  return (
    <div className="mt-6 flex items-center justify-between rounded-lg border border-danger-500/40 bg-danger-50/60 px-5 py-3.5">
      <p className="text-sm font-medium text-danger-600">지연 위험 작업이 {count}건 있습니다. 재분배를 검토해보세요.</p>
      <button type="button" onClick={onReview} className="text-sm font-semibold text-danger-600 hover:underline">
        지금 확인하기
      </button>
    </div>
  )
}
