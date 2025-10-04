import Dexie, { Table } from 'dexie'

export interface Person {
	id?: number
	name: string
	gender: 'male' | 'female'
	age: number
	education: 'podstawowe' | 'zawodowe' | 'srednie' | 'wyzsze'
	profession: string
	monthlyIncome: number
	workExperience: number
	retirementGoals: string[]
	createdAt: Date
}

export const db = new Dexie('PersonDatabase')

db.version(2).stores({
	people: '++id, name, gender, age, education, profession, monthlyIncome, workExperience, retirementGoals, createdAt',
})

export const peopleTable = db.table('people') as Table<Person>
