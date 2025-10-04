'use client'

import { useState } from 'react'
import { db } from '@/lib/db'
import Step1 from '@/components/Step1'
import Step2 from '@/components/Step2'
import Step3 from '@/components/Step3'
import ProgressSteps from '@/components/ProgressSteps'

export default function Home() {
	const [currentStep, setCurrentStep] = useState(1)
	const [formData, setFormData] = useState({
		gender: '' as 'male' | 'female' | '',
		age: '' as number | '',
		name: '',
		income: '' as number | '',
		workYears: '' as number | '',
	})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleInputChange = (field: string, value: string | number) => {
		setFormData(prev => ({ ...prev, [field]: value }))
	}

	const nextStep = () => {
		if (currentStep < 3) setCurrentStep(currentStep + 1)
	}

	const prevStep = () => {
		if (currentStep > 1) setCurrentStep(currentStep - 1)
	}

	const handleStepClick = (step: number) => {
		if (isStepValid(step)) {
			setCurrentStep(step)
		}
	}

	const handleSubmit = async () => {
		if (formData.gender && formData.age && formData.name) {
			setIsSubmitting(true)
			try {
				await db.userData.add({
					gender: formData.gender,
					age: formData.age,
					name: formData.name,
					income: formData.income || 0,
					workYears: formData.workYears || 0,
					createdAt: new Date(),
				})
				// Reset formularza
				setFormData({
					gender: '',
					age: '',
					name: '',
					income: '',
					workYears: '',
				})
				setCurrentStep(1)
			} catch (error) {
				// Error handling
			} finally {
				setIsSubmitting(false)
			}
		}
	}

	const isStepValid = (step: number) => {
		switch (step) {
			case 1:
				return !!(formData.gender && formData.age)
			case 2:
				return !!(formData.gender && formData.age && formData.name)
			case 3:
				return !!(formData.gender && formData.age && formData.name)
			default:
				return false
		}
	}

	const renderCurrentStep = () => {
		switch (currentStep) {
			case 1:
				return <Step1 formData={formData} onInputChange={handleInputChange} />
			case 2:
				return <Step2 formData={formData} onInputChange={handleInputChange} />
			case 3:
				return <Step3 formData={formData} onInputChange={handleInputChange} />
			default:
				return null
		}
	}

	return (
		<div className='min-h-screen bg-zus-light-gray flex items-center justify-center p-4'>
			<div className='bg-zus-white border-2 border-zus-green rounded-lg shadow-xl p-8 w-full max-w-2xl'>
				{/* Header */}
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-bold text-zus-black mb-2'>Kalkulator Emerytalny ZUS</h1>
					<p className='text-zus-dark-green'>Sprawdź informacje o swojej przyszłej emeryturze</p>
				</div>

				{/* Progress Steps */}
				<ProgressSteps
					currentStep={currentStep}
					totalSteps={3}
					onStepClick={handleStepClick}
					isStepValid={isStepValid}
				/>

				<form className='space-y-6'>
					{/* Render Current Step */}
					{renderCurrentStep()}

					{/* Navigation Buttons */}
					<div className='flex justify-between pt-6'>
						<button
							type='button'
							onClick={prevStep}
							disabled={currentStep === 1}
							className='px-6 py-3 bg-zus-light-gray hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-zus-black font-medium rounded-lg transition-colors'>
							← Poprzedni
						</button>

						{currentStep < 3 ? (
							<button
								type='button'
								onClick={nextStep}
								disabled={!isStepValid(currentStep)}
								className='px-6 py-3 bg-zus-green hover:bg-zus-dark-green disabled:bg-zus-light-gray disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors'>
								Następny →
							</button>
						) : (
							<button
								type='button'
								onClick={handleSubmit}
								disabled={!formData.gender || !formData.age || !formData.name || isSubmitting}
								className='px-6 py-3 bg-zus-green hover:bg-zus-dark-green disabled:bg-zus-light-gray disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors'>
								{isSubmitting ? 'Zapisywanie...' : 'Zakończ'}
							</button>
						)}
					</div>
				</form>

				{/* Link to database */}
				<div className='mt-6 text-center'>
					<a href='/db' className='text-zus-dark-green hover:underline text-sm'>
						Zobacz zapisane dane →
					</a>
				</div>
			</div>
		</div>
	)
}
