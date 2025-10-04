import Dexie, { Table } from 'dexie'

export interface UserData {
	id?: number
	gender: 'male' | 'female'
	age: number
	name: string
	income: number
	workYears: number
	createdAt: Date
}

export class MyDatabase extends Dexie {
	userData!: Table<UserData>

	constructor() {
		super('ZUSCalculatorDB')
		this.version(1).stores({
			userData: '++id, gender, age, name, income, workYears, createdAt',
		})
	}
}

export const db = new MyDatabase()
