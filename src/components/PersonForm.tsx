'use client'

import { useState } from 'react'
import { peopleTable, Person } from '../../lib/db'

interface FormData {
	name: string
	gender: 'male' | 'female'
	age: string
	education: 'podstawowe' | 'zawodowe' | 'srednie' | 'wyzsze'
	profession: string
	monthlyIncome: string
	workExperience: string
	retirementGoals: string[]
}

const RETIREMENT_GOALS = [
	'Podróże i zwiedzanie świata',
	'Więcej czasu z rodziną',
	'Hobby i pasje',
	'Wolontariat i działalność społeczna',
	'Rozwój osobisty',
	'Spokojne życie na wsi',
	'Aktywność fizyczna i sport',
]

const PROFESSIONS = [
	'Nauczyciel/ka',
	'Lekarz/Lekarka',
	'Inżynier/ka',
	'Księgowy/a',
	'Sprzedawca/czyni',
	'Kierowca',
	'Pielęgniarz/ka',
	'Programista/ka',
	'Mechanik',
	'Inne',
]

export default function PersonForm() {
	const [formData, setFormData] = useState<FormData>({
		name: '',
		gender: 'male',
		age: '',
		education: 'srednie',
		profession: '',
		monthlyIncome: '',
		workExperience: '',
		retirementGoals: [],
	})
	const [step, setStep] = useState(1)
	const [message, setMessage] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleInputChange = (field: keyof FormData, value: string | string[]) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
	}

	const handleGoalToggle = (goal: string) => {
		setFormData(prev => ({
			...prev,
			retirementGoals: prev.retirementGoals.includes(goal)
				? prev.retirementGoals.filter(g => g !== goal)
				: [...prev.retirementGoals, goal],
		}))
	}

	const validateStep = (stepNumber: number): boolean => {
		switch (stepNumber) {
			case 1:
				return formData.name.trim() !== '' && parseInt(formData.age) >= 18 && parseInt(formData.age) <= 67
			case 2:
				return (
					formData.profession.trim() !== '' &&
					parseInt(formData.monthlyIncome) > 0 &&
					parseInt(formData.workExperience) >= 0
				)
			case 3:
				return formData.retirementGoals.length > 0
			default:
				return true
		}
	}

	const nextStep = () => {
		if (validateStep(step)) {
			setStep(prev => Math.min(prev + 1, 4))
			setMessage('')
		} else {
			setMessage('Wypełnij wszystkie wymagane pola poprawnie')
		}
	}

	const prevStep = () => {
		setStep(prev => Math.max(prev - 1, 1))
		setMessage('')
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateStep(3)) {
			setMessage('Wybierz przynajmniej jeden cel emerytalny')
			return
		}

		setIsLoading(true)
		try {
			const person: Omit<Person, 'id'> = {
				name: formData.name.trim(),
				gender: formData.gender,
				age: parseInt(formData.age),
				education: formData.education,
				profession: formData.profession.trim(),
				monthlyIncome: parseInt(formData.monthlyIncome),
				workExperience: parseInt(formData.workExperience),
				retirementGoals: formData.retirementGoals,
				createdAt: new Date(),
			}

			await peopleTable.add(person)
			setMessage('Twoja postać została utworzona! Możesz teraz sprawdzić swoje perspektywy emerytalne.')
			setTimeout(() => {
				// Przejście do następnego kroku aplikacji (kalkulacja emerytalna)
				window.location.href = '/db'
			}, 2000)
		} catch (error) {
			console.error('Error saving person:', error)
			setMessage('Błąd podczas zapisywania danych. Spróbuj ponownie.')
		} finally {
			setIsLoading(false)
		}
	}

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<div className='zus-step'>
						<h3>Podstawowe informacje</h3>
						<p>Opowiedz nam o sobie</p>

						<div className='zus-form-group'>
							<label htmlFor='name'>Imię i nazwisko *</label>
							<input
								type='text'
								id='name'
								value={formData.name}
								onChange={e => handleInputChange('name', e.target.value)}
								placeholder='Wprowadź swoje imię i nazwisko'
								className='zus-input'
							/>
						</div>

						<div className='zus-form-group'>
							<label>Płeć *</label>
							<div className='zus-radio-group'>
								<label className='zus-radio-label'>
									<input
										type='radio'
										name='gender'
										value='male'
										checked={formData.gender === 'male'}
										onChange={e => handleInputChange('gender', e.target.value)}
									/>
									<span>Mężczyzna</span>
								</label>
								<label className='zus-radio-label'>
									<input
										type='radio'
										name='gender'
										value='female'
										checked={formData.gender === 'female'}
										onChange={e => handleInputChange('gender', e.target.value)}
									/>
									<span>Kobieta</span>
								</label>
							</div>
						</div>

						<div className='zus-form-group'>
							<label htmlFor='age'>Wiek *</label>
							<input
								type='number'
								id='age'
								value={formData.age}
								onChange={e => handleInputChange('age', e.target.value)}
								min='18'
								max='67'
								placeholder='Wprowadź swój wiek'
								className='zus-input'
							/>
							<small>Wiek musi być między 18 a 67 lat</small>
						</div>

						<div className='zus-form-group'>
							<label htmlFor='education'>Wykształcenie</label>
							<select
								id='education'
								value={formData.education}
								onChange={e => handleInputChange('education', e.target.value as any)}
								className='zus-select'>
								<option value='podstawowe'>Podstawowe</option>
								<option value='zawodowe'>Zawodowe</option>
								<option value='srednie'>Średnie</option>
								<option value='wyzsze'>Wyższe</option>
							</select>
						</div>
					</div>
				)

			case 2:
				return (
					<div className='zus-step'>
						<h3>Sytuacja zawodowa</h3>
						<p>Informacje o Twojej pracy i dochodach</p>

						<div className='zus-form-group'>
							<label htmlFor='profession'>Zawód *</label>
							<select
								id='profession'
								value={formData.profession}
								onChange={e => handleInputChange('profession', e.target.value)}
								className='zus-select'>
								<option value=''>Wybierz zawód</option>
								{PROFESSIONS.map(prof => (
									<option key={prof} value={prof}>
										{prof}
									</option>
								))}
							</select>
						</div>

						<div className='zus-form-group'>
							<label htmlFor='monthlyIncome'>Miesięczny dochód netto (zł) *</label>
							<input
								type='number'
								id='monthlyIncome'
								value={formData.monthlyIncome}
								onChange={e => handleInputChange('monthlyIncome', e.target.value)}
								min='0'
								placeholder='np. 4500'
								className='zus-input'
							/>
						</div>

						<div className='zus-form-group'>
							<label htmlFor='workExperience'>Staż pracy (lata) *</label>
							<input
								type='number'
								id='workExperience'
								value={formData.workExperience}
								onChange={e => handleInputChange('workExperience', e.target.value)}
								min='0'
								max='50'
								placeholder='np. 15'
								className='zus-input'
							/>
						</div>
					</div>
				)

			case 3:
				return (
					<div className='zus-step'>
						<h3>Cele emerytalne</h3>
						<p>Co chcesz robić na emeryturze? (wybierz przynajmniej jeden)</p>

						<div className='zus-goals-grid'>
							{RETIREMENT_GOALS.map(goal => (
								<label key={goal} className='zus-goal-card'>
									<input
										type='checkbox'
										checked={formData.retirementGoals.includes(goal)}
										onChange={() => handleGoalToggle(goal)}
									/>
									<span>{goal}</span>
								</label>
							))}
						</div>
					</div>
				)

			case 4:
				return (
					<div className='zus-step zus-summary'>
						<h3>Podsumowanie Twojej postaci</h3>
						<p>Sprawdź czy wszystkie dane są poprawne</p>

						<div className='zus-summary-grid'>
							<div className='zus-summary-item'>
								<strong>Imię:</strong> {formData.name}
							</div>
							<div className='zus-summary-item'>
								<strong>Płeć:</strong> {formData.gender === 'male' ? 'Mężczyzna' : 'Kobieta'}
							</div>
							<div className='zus-summary-item'>
								<strong>Wiek:</strong> {formData.age} lat
							</div>
							<div className='zus-summary-item'>
								<strong>Wykształcenie:</strong> {formData.education}
							</div>
							<div className='zus-summary-item'>
								<strong>Zawód:</strong> {formData.profession}
							</div>
							<div className='zus-summary-item'>
								<strong>Miesięczny dochód:</strong> {formData.monthlyIncome} zł
							</div>
							<div className='zus-summary-item'>
								<strong>Staż pracy:</strong> {formData.workExperience} lat
							</div>
							<div className='zus-summary-item'>
								<strong>Cele emerytalne:</strong>
								<ul>
									{formData.retirementGoals.map(goal => (
										<li key={goal}>{goal}</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<div className='zus-container'>
			<div className='zus-form-container'>
				<header className='zus-header'>
					<h1>Kreator postaci emerytalnej</h1>
					<p>Stwórz swoją postać i poznaj perspektywy emerytalne</p>
				</header>

				<div className='zus-progress'>
					<div className='zus-progress-bar'>
						<div className='zus-progress-fill' style={{ width: `${(step / 4) * 100}%` }}></div>
					</div>
					<div className='zus-progress-text'>Krok {step} z 4</div>
				</div>

				<form onSubmit={handleSubmit}>
					{renderStep()}

					{message && (
						<div
							className={`zus-message ${message.includes('utworzona') || message.includes('zapisane') ? 'success' : 'error'}`}>
							{message}
						</div>
					)}

					<div className='zus-form-actions'>
						{step > 1 && (
							<button type='button' onClick={prevStep} className='zus-btn zus-btn-secondary' disabled={isLoading}>
								← Wstecz
							</button>
						)}

						{step < 4 ? (
							<button type='button' onClick={nextStep} className='zus-btn zus-btn-primary'>
								Dalej →
							</button>
						) : (
							<button type='submit' className='zus-btn zus-btn-success' disabled={isLoading}>
								{isLoading ? 'Zapisywanie...' : 'Utwórz postać'}
							</button>
						)}
					</div>
				</form>

				<div className='zus-gamification-hint'>
					🎮 <em>Wkrótce: System punktów i osiągnięć!</em>
				</div>
			</div>
		</div>
	)
}
