'use client'

import { useState, useEffect } from 'react'
import { peopleTable, Person } from '../../../lib/db'

export default function DatabasePage() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = async () => {
    try {
      const allPeople = await peopleTable.toArray()
      setPeople(allPeople)
    } catch (error) {
      console.error('Error loading people:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePerson = async (id: number) => {
    try {
      await peopleTable.delete(id)
      loadPeople()
    } catch (error) {
      console.error('Error deleting person:', error)
    }
  }

  const clearAll = async () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie dane?')) {
      try {
        await peopleTable.clear()
        loadPeople()
      } catch (error) {
        console.error('Error clearing data:', error)
      }
    }
  }

  const getGenderText = (gender: string) => {
    return gender === 'male' ? 'Mężczyzna' : 'Kobieta'
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <div className="text-gray-600 ml-4">Ładowanie danych...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="db-container">
        <div className="header-actions">
          <h1>Baza danych osób</h1>
          <a href="/" className="back-btn">
            ← Powrót do formularza
          </a>
        </div>

        {people.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <div className="empty-title">Brak danych w bazie</div>
            <div className="empty-description">
              Dodaj pierwszą osobę używając formularza na stronie głównej
            </div>
            <a href="/" className="link">
              Dodaj pierwszą osobę
            </a>
          </div>
        ) : (
          <>
            {/* Statystyki */}
            <div className="stats-grid">
              <div className="stat-card total">
                <div className="stat-number">{people.length}</div>
                <div className="stat-label">Łącznie osób</div>
              </div>
              <div className="stat-card male">
                <div className="stat-number">
                  {people.filter(p => p.gender === 'male').length}
                </div>
                <div className="stat-label">Mężczyzn</div>
              </div>
              <div className="stat-card female">
                <div className="stat-number">
                  {people.filter(p => p.gender === 'female').length}
                </div>
                <div className="stat-label">Kobiet</div>
              </div>
            </div>

            {/* Tabela z danymi */}
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Płeć</th>
                    <th>Wiek</th>
                    <th>Data dodania</th>
                    <th>Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((person) => (
                    <tr key={person.id}>
                      <td>{person.id}</td>
                      <td>
                        <span className={`gender-badge ${person.gender}`}>
                          {getGenderText(person.gender)}
                        </span>
                      </td>
                      <td>{person.age} lat</td>
                      <td>{person.createdAt.toLocaleString('pl-PL')}</td>
                      <td>
                        <button
                          onClick={() => deletePerson(person.id!)}
                          className="delete-btn"
                        >
                          Usuń
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Przycisk wyczyść wszystko */}
            <button onClick={clearAll} className="clear-btn">
              Wyczyść wszystkie dane
            </button>
          </>
        )}
      </div>
    </div>
  )
}
