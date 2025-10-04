interface Step1Props {
	formData: {
		gender: 'male' | 'female' | ''
		age: number | ''
	}
	onInputChange: (field: string, value: string | number) => void
}

export default function Step1({ formData, onInputChange }: Step1Props) {
	return (
		<div className='space-y-6'>
			<h2 className='text-xl font-bold text-zus-black mb-4'>Krok 1: Podstawowe informacje</h2>

			<div>
				<label className='block text-sm font-medium text-zus-black mb-3'>Wybierz płeć:</label>
				<div className='grid grid-cols-2 gap-4'>
					<label className='flex items-center p-4 border-2 border-zus-light-gray rounded-lg cursor-pointer hover:border-zus-green transition-colors'>
						<input
							type='radio'
							name='gender'
							value='male'
							checked={formData.gender === 'male'}
							onChange={e => onInputChange('gender', e.target.value)}
							className='mr-3 text-zus-green focus:ring-zus-green'
						/>
						<span className='text-zus-black font-medium'>Mężczyzna</span>
					</label>
					<label className='flex items-center p-4 border-2 border-zus-light-gray rounded-lg cursor-pointer hover:border-zus-green transition-colors'>
						<input
							type='radio'
							name='gender'
							value='female'
							checked={formData.gender === 'female'}
							onChange={e => onInputChange('gender', e.target.value)}
							className='mr-3 text-zus-green focus:ring-zus-green'
						/>
						<span className='text-zus-black font-medium'>Kobieta</span>
					</label>
				</div>
			</div>

			<div>
				<label htmlFor='age' className='block text-sm font-medium text-zus-black mb-2'>
					Wiek:
				</label>
				<input
					type='number'
					id='age'
					min='18'
					max='100'
					value={formData.age}
					onChange={e => onInputChange('age', e.target.value ? parseInt(e.target.value) : '')}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.preventDefault()
						}
					}}
					className='w-full px-4 py-3 border-2 border-zus-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-zus-green focus:border-transparent text-zus-black text-lg'
					placeholder='Wprowadź swój wiek'
				/>
			</div>
		</div>
	)
}
