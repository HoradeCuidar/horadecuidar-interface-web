type Step = {
  id: string
  label: string
}

type StepsProps = {
  steps: Step[]
  currentStepId: string
}

export function Steps({ steps, currentStepId }: StepsProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId)

  return (
    <nav aria-label="Etapas do formulário" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        {steps.map((step, index) => {
          const isActive = index === currentIndex
          const isCompleted = index < currentIndex

          return (
            <li key={step.id} className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 rounded-full bg-surface-100 px-2.5 py-1">
                <span
                  className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                    isActive || isCompleted
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-200 text-text-muted'
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`whitespace-nowrap text-xs font-medium ${
                    isActive ? 'text-text' : 'text-text-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <span
                  className={`hidden h-px w-4 sm:block ${
                    isCompleted ? 'bg-brand-500' : 'bg-surface-200'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}