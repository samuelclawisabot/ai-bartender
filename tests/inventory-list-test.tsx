import { InventoryItem } from '../pages/api/chat'

// This component can be added to pages/_app or tested manually
export async function listCurrentInventory(): Promise<InventoryItem[]> {
  // Server-side inventory loading
  const fs = await import('fs')
  const path = await import('path')
  
  const inventoryPath = path.join(process.cwd(), 'inventory.json')
  try {
    if (fs.existsSync(inventoryPath)) {
      const inventoryContent = fs.readFileSync(inventoryPath, 'utf8')
      return JSON.parse(inventoryContent)
    }
  } catch (e) {
    console.warn('Could not load inventory from file:', e)
  }
  
  // Fallback to localStorage for client-side testing
  try {
    const storedInventory = typeof window !== 'undefined' 
      ? localStorage.getItem('bartenderInventory')
      : null
    if (storedInventory) {
      return JSON.parse(storedInventory)
    }
  } catch (e) {
    console.warn('Could not load from localStorage:', e)
  }
  
  return []
}

// Test component for manual verification
export function InventoryListTest() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  
  useEffect(() => {
    listCurrentInventory().then(setInventory)
  }, [])
  
  if (inventory.length === 0) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
        ⚠️ No items currently in inventory. Please add spirits, bitters, chasers via /inventory page first.
      </div>
    )
  }
  
  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
      <h3 className="font-bold mb-2 text-green-800">Current Inventory ({inventory.length} items):</h3>
      <ul className="space-y-1">
        {inventory.map((item, index) => (
          <li key={index} className="text-sm">
            <span className="font-medium">{item.name}</span>: 
            <span className="ml-2 text-green-700">{item.quantity} {item.unit}</span> - 
            <span className="text-green-900 ml-1 italic">"{item.description || 'Premium quality spirit'}"</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
