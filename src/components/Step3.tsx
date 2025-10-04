interface Step3Props {
	formData: {
		gender: 'male' | 'female' | ''
		age: number | ''
		name: string
		income: number | ''
		workYears: number | ''
	}
	onInputChange: (field: string, value: string | number) => void
}

export default function Step3({ formData, onInputChange }: Step3Props) {
	return (
		<div className='space-y-6'>
			<h2 className='text-xl font-bold text-zus-black mb-4'>Krok 3: Informacje zawodowe</h2>

			<div>
				<label htmlFor='workYears' className='block text-sm font-medium text-zus-black mb-2'>
					Lata pracy (opcjonalne):
				</label>
				<input
					type='number'
					id='workYears'
					min='0'
					max='50'
					value={formData.workYears}
					onChange={e => onInputChange('workYears', e.target.value ? parseInt(e.target.value) : '')}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.preventDefault()
						}
					}}
					className='w-full px-4 py-3 border-2 border-zus-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-zus-green focus:border-transparent text-zus-black text-lg'
					placeholder='np. 15'
				/>
			</div>

			{/* Summary */}
			<div className='bg-zus-light-gray p-4 rounded-lg'>
				<h3 className='font-bold text-zus-black mb-2'>Podsumowanie:</h3>
				<p className='text-sm text-zus-black'>
					<strong>Płeć:</strong> {formData.gender === 'male' ? 'Mężczyzna' : 'Kobieta'} |<strong> Wiek:</strong>{' '}
					{formData.age} lat |<strong> Imię:</strong> {formData.name}
				</p>
				{formData.income && (
					<p className='text-sm text-zus-black'>
						<strong>Dochód:</strong> {formData.income} zł
					</p>
				)}
			</div>
		</div>
	)
}
