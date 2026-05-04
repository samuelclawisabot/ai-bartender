import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Save } from 'lucide-react'

type Category = 'spirits' | 'liqueurs' | 'mixers' | 'garnishes'

interface ItemType {
  id: number
  name: string
  description?: string
  quantity: number
  unit: string
  category?: Category
}

const categories: Category[] = ['spirits', 'liqueurs', 'mixers', 'garnishes']

const categoryNames: Record<Category, { label: string; icon: string }> = {
  spirits: { label: 'Spirits', icon: '🥃' },
  liqueurs: { label: 'Liqueurs', icon: '🍋' },
  mixers: { label: 'Mixers', icon: '🧊' },
  garnishes: { label: 'Garnishes', icon: '🌿' }
}

interface AddItemFormProps {
  onAddItem: (item: ItemType) => void
}

export function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [newItemName, setNewItemName] = useState('')
  const [newItemDesc, setNewItemDesc] = useState('')
  const [quantityInput, setQuantityInput] = useState('')
  const [category, setCategory] = useState<Category>('spirits')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName.trim() || !quantityInput) return
    
    const newItem: ItemType = {
      id: Date.now(),
      name: newItemName,
      description: newItemDesc,
      quantity: parseFloat(quantityInput),
      unit: 'ml',
      category
    }
    
    onAddItem(newItem)
    setNewItemName('')
    setNewItemDesc('')
    setQuantityInput('')
  }

  return (
    <div className="mb-8 p-4 bg-gradient-to-br from-noir-700/50 to-noir-900/30 backdrop-blur-sm rounded-2xl border border-neon-cyan/20">
      <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-neon-lime" />
        Add New Item
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          type="text"
          placeholder="Item name (e.g., Gin)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="bg-noir-800/50 border border-neon-cyan/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-lime/50 transition-colors"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newItemDesc}
          onChange={(e) => setNewItemDesc(e.target.value)}
          className="bg-noir-800/50 border border-neon-cyan/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-lime/50 transition-colors"
        />
        <input
          type="number"
          placeholder="Quantity (e.g., 750)"
          value={quantityInput}
          onChange={(e) => setQuantityInput(e.target.value)}
          className="bg-noir-800/50 border border-neon-cyan/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-lime/50 transition-colors"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="bg-noir-800/50 border border-neon-cyan/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-lime/50 transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryNames[cat].icon} {categoryNames[cat].label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!newItemName.trim() || !quantityInput}
          className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-lime hover:to-neon-magenta text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <Save className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

export default function Inventory() {
  const [activeCategory, setActiveCategory] = useState<Category>('spirits')
  const [items, setItems] = useState<ItemType[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    // Load from session storage (persists across navigation)
    try {
      const stored = sessionStorage.getItem('bartenderInventory')
      if (stored) {
        const parsed: ItemType[] = JSON.parse(stored)
        setItems(parsed)
      }
    } catch (e) {
      console.error('Failed to parse inventory:', e)
    }
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem('bartenderInventory', JSON.stringify(items))
    } catch (e) {
      console.warn('Could not persist inventory:', e)
    }
  }, [items])

  const handleAddItem = (newItem: ItemType) => {
    setItems(prev => [...prev, newItem])
  }

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  // Filter items by active category
  const getCategoryItems = () => {
    return items.filter(item => ['spirits', 'liqueurs', 'mixers', 'garnishes'].includes(item.category!))
  }

  // Get items for display (filtered by active category)
  const getCategoryItemsForDisplay = () => {
    return items.filter(item => item.category === activeCategory)
  }

  const getItemsByCategory = (category: Category) => {
    return items.filter(item => item.category === category)
  }

  // Determine which categories to show based on what exists in inventory
  const availableCategories: Category[] = ['spirits', 'liqueurs', 'mixers', 'garnishes']

  return (
    <div className="min-h-screen bg-noir-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-noir-800/50 backdrop-blur-xl rounded-3xl border border-neon-cyan/20 overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header with Category Filter */}
        <div className="p-6 bg-gradient-to-r from-noir-900 via-noir-800 to-noir-900 border-b border-neon-cyan/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-wider text-white mb-2">
                📦 Inventory <span className="font-mono text-neon-lime/80">M A N A G E R</span> <span className="text-sm bg-neon-cyan/10 px-2 py-1 rounded-full ml-2">{activeCategory.toUpperCase()}</span>
              </h1>
              <p className="text-gray-400 text-sm">Manage your bar supplies in real-time</p>
            </div>
          </div>
        </div>

        {/* Navigation Bar with Category Tabs */}
        <div className="flex flex-wrap gap-2 px-6 bg-noir-900 border-b border-neon-cyan/10 overflow-x-auto">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-neon-lime/20 text-neon-lime border border-neon-lime/50 shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                  : 'bg-noir-700 text-gray-400 hover:bg-noir-600 hover:text-gray-200'
              }`}
            >
              {categoryNames[cat].icon} {categoryNames[cat].label} ({getItemsByCategory(cat).length})
            </button>
          ))}
        </div>

        {/* Add Item Card */}
        <div className="px-6 pb-4">  
          <AddItemForm onAddItem={handleAddItem} />
        </div>

        {/* Items Grid - Filtered by Active Category */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCategoryItemsForDisplay().map((item) => (
              <div
                key={item.id}
                className={`p-4 backdrop-blur-sm rounded-xl border transition-all hover:border-neon-lime/50 ${
                  editingId === item.id
                    ? 'bg-neon-purple/10 border-neon-purple/50'
                    : 'bg-noir-700/50 border-neon-cyan/20'
                }`}
              >
                {editingId === item.id ? (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? {...i, name: e.target.value} : i))}
                        className="bg-transparent border-b border-neon-purple/50 rounded px-1 py-1 text-white focus:outline-none"
                      />
                      <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">
                        <span className="text-xs">✕ Cancel</span>
                      </button>
                    </div>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => setItems(prev => prev.map(i => i.id === item.id ? {...i, quantity: parseFloat(e.target.value || '0')} : i))}
                      className="w-full bg-noir-800/50 border border-neon-purple/40 rounded px-3 py-2 text-white focus:outline-none focus:border-neon-lime/50"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-400">{item.unit}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-white px-3 py-1 rounded-lg text-sm font-medium">
                          Delete
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-neon-lime hover:text-white px-3 py-1 rounded-lg text-sm font-medium">
                          Save
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-white">{item.name}</h3>
                      <span className="text-xs text-neon-cyan/60 bg-neon-cyan/10 px-2 py-1 rounded-full">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{item.description || 'No description'}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mb-3">
                      <button 
                        onClick={() => setItems(prev => prev.map(i => i.id === item.id ? {...i, quantity: Math.max(0, i.quantity - 1)} : i))}
                        className="w-8 h-8 rounded-full bg-noir-600 text-gray-300 hover:bg-neon-cyan/20 hover:text-neon-cyan transition-colors"
                      >-</button>
                      <span className="text-sm font-medium text-white min-w-[4rem] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => setItems(prev => prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))}
                        className="w-8 h-8 rounded-full bg-noir-600 text-gray-300 hover:bg-neon-lime/20 hover:text-neon-lime transition-colors"
                      >+</button>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingId(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-noir-600 hover:bg-neon-purple/20 text-gray-300 hover:text-neon-purple px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {getCategoryItemsForDisplay().length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-neon-cyan/20 rounded-xl">
              <p className="text-gray-500 text-lg">No items in {categoryNames[activeCategory].label} yet</p>
              <p className="text-gray-600 text-sm mt-2">Use the form above to add your first {categoryNames[activeCategory].label.toLowerCase()}!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
