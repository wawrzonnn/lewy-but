'use client'

import { useState, useEffect } from 'react'
import { db, Todo } from '../../lib/db'

export default function CrudApp() {
  const [items, setItems] = useState<Todo[]>([])
  const [newItem, setNewItem] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')

  // Load items from IndexedDB
  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      const allItems = await db.todos.toArray()
      setItems(allItems)
    } catch (error) {
      console.error('Error loading items:', error)
    }
  }

  // CREATE
  const createItem = async () => {
    if (!newItem.trim()) return

    try {
      await db.todos.add({
        title: newItem.trim(),
        completed: false,
        createdAt: new Date()
      })
      setNewItem('')
      loadItems()
    } catch (error) {
      console.error('Error creating item:', error)
    }
  }

  // READ - already handled by loadItems and useEffect

  // UPDATE
  const startEdit = (item: Todo) => {
    setEditingId(item.id!)
    setEditingText(item.title)
  }

  const updateItem = async () => {
    if (!editingText.trim() || !editingId) return

    try {
      await db.todos.update(editingId, { title: editingText.trim() })
      setEditingId(null)
      setEditingText('')
      loadItems()
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  // DELETE
  const deleteItem = async (id: number) => {
    try {
      await db.todos.delete(id)
      loadItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  // Clear all
  const clearAll = async () => {
    try {
      await db.todos.clear()
      loadItems()
    } catch (error) {
      console.error('Error clearing items:', error)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Prosty CRUD z Dexie</h1>

      {/* CREATE */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && createItem()}
          placeholder="Dodaj nowy element..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={createItem}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Dodaj
        </button>
      </div>

      {/* READ / LIST */}
      <div className="space-y-3 mb-6">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Brak elementów. Dodaj pierwszy powyżej!</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-md">
              {editingId === item.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateItem()}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={updateItem}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Zapisz
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    Anuluj
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-gray-800">{item.title}</span>
                  <button
                    onClick={() => startEdit(item)}
                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => deleteItem(item.id!)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Usuń
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats and Clear All */}
      {items.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-sm text-gray-600">
            Łącznie elementów: {items.length}
          </span>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Wyczyść wszystko
          </button>
        </div>
      )}
    </div>
  )
}
