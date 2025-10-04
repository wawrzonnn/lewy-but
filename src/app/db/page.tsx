'use client'

import { useState, useEffect } from 'react'
import { db, UserData } from '@/lib/db'

export default function DatabasePage() {
	const [userData, setUserData] = useState<UserData[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		loadData()
	}, [])

	const loadData = async () => {
		try {
			const data = await db.userData.orderBy('createdAt').reverse().toArray()
			setUserData(data)
		} catch (error) {
			// Error handling
		} finally {
			setIsLoading(false)
		}
	}

	const deleteRecord = async (id: number) => {
		try {
			await db.userData.delete(id)
			loadData() // Odśwież dane
		} catch (error) {
			// Error handling
		}
	}

	const clearAllData = async () => {
		if (confirm('Czy na pewno chcesz usunąć wszystkie dane?')) {
			try {
				await db.userData.clear()
				loadData()
			} catch (error) {
				// Error handling
			}
		}
	}

	if (isLoading) {
		return (
			<div className='min-h-screen bg-zus-white flex items-center justify-center'>
				<div className='text-zus-black'>Ładowanie danych...</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-zus-white p-4'>
			<div className='max-w-4xl mx-auto'>
				<div className='flex justify-between items-center mb-6'>
					<h1 className='text-2xl font-bold text-zus-black'>Baza Danych</h1>
					<div className='space-x-4'>
						<a
							href='/'
							className='bg-zus-light-gray hover:bg-gray-300 text-zus-black px-4 py-2 rounded-md transition-colors'>
							← Powrót
						</a>
						{userData.length > 0 && (
							<button
								onClick={clearAllData}
								className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors'>
								Usuń wszystkie
							</button>
						)}
					</div>
				</div>

				{userData.length === 0 ? (
					<div className='text-center py-12'>
						<p className='text-zus-black text-lg mb-4'>Brak danych w bazie</p>
						<a href='/' className='text-zus-dark-green hover:underline'>
							Dodaj pierwsze dane →
						</a>
					</div>
				) : (
					<div className='space-y-4'>
						<p className='text-zus-black mb-4'>
							Liczba rekordów: <strong>{userData.length}</strong>
						</p>

						{userData.map(record => (
							<div key={record.id} className='bg-white border border-zus-light-gray rounded-lg p-4 shadow-sm'>
								<div className='flex justify-between items-start'>
									<div className='flex-1'>
										<div className='grid grid-cols-2 gap-4 mb-3'>
											<div>
												<p className='text-zus-black'>
													<strong>Imię:</strong> {record.name}
												</p>
												<p className='text-zus-black'>
													<strong>Płeć:</strong> {record.gender === 'male' ? 'Mężczyzna' : 'Kobieta'}
												</p>
												<p className='text-zus-black'>
													<strong>Wiek:</strong> {record.age} lat
												</p>
											</div>
											<div>
												<p className='text-zus-black'>
													<strong>Dochód:</strong> {record.income} zł
												</p>
												<p className='text-zus-black'>
													<strong>Lata pracy:</strong> {record.workYears || 'Nie podano'}
												</p>
											</div>
										</div>
										<p className='text-zus-dark-green text-sm'>
											<strong>Dodano:</strong> {new Date(record.createdAt).toLocaleString('pl-PL')}
										</p>
									</div>
									<button
										onClick={() => record.id && deleteRecord(record.id)}
										className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors ml-4'>
										Usuń
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
