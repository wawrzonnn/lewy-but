interface ProgressStepsProps {
	currentStep: number
	totalSteps: number
	onStepClick?: (step: number) => void
	isStepValid?: (step: number) => boolean
}

export default function ProgressSteps({ currentStep, totalSteps, onStepClick, isStepValid }: ProgressStepsProps) {
	return (
		<div className='flex justify-center mb-8'>
			<div className='flex items-center space-x-4'>
				{Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => {
					const isClickable = onStepClick && isStepValid && isStepValid(step)
					return (
						<div key={step} className='flex items-center'>
							<div
								onClick={isClickable ? () => onStepClick(step) : undefined}
								className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors ${
									currentStep >= step ? 'bg-zus-green' : 'bg-zus-light-gray text-zus-black'
								} ${isClickable ? 'cursor-pointer hover:bg-opacity-80' : 'cursor-not-allowed'}`}
								title={isClickable ? `Przejdź do kroku ${step}` : `Najpierw wypełnij poprzednie kroki`}>
								{step}
							</div>
							{step < totalSteps && (
								<div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-zus-green' : 'bg-zus-light-gray'}`} />
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
