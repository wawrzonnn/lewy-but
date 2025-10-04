interface Step2Props {
	formData: {
		name: string
		income: number | ''
	}
	onInputChange: (field: string, value: string | number) => void
}

export default function Step2({ formData, onInputChange }: Step2Props) {
	return (
		<div className='space-y-6'>
			<h2 className='text-xl font-bold text-zus-black mb-4'>Krok 2: Dane osobowe</h2>

			<div>
				<label htmlFor='name' className='block text-sm font-medium text-zus-black mb-2'>
					Imię i nazwisko:
				</label>
				<input
					type='text'
					id='name'
					value={formData.name}
					onChange={e => onInputChange('name', e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.preventDefault()
						}
					}}
					className='w-full px-4 py-3 border-2 border-zus-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-zus-green focus:border-transparent text-zus-black text-lg'
					placeholder='Wprowadź imię i nazwisko'
				/>
			</div>

			<div>
				<label htmlFor='income' className='block text-sm font-medium text-zus-black mb-2'>
					Miesięczny dochód (zł):
				</label>
				<input
					type='number'
					id='income'
					min='0'
					value={formData.income}
					onChange={e => onInputChange('income', e.target.value ? parseInt(e.target.value) : '')}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.preventDefault()
						}
					}}
					className='w-full px-4 py-3 border-2 border-zus-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-zus-green focus:border-transparent text-zus-black text-lg'
					placeholder='np. 5000'
				/>
			</div>
		</div>
	)
}
