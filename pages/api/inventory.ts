import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

type Data = {
  success: boolean
  message?: string
  data?: any
}

const INVENTORY_FILE = path.join(process.cwd(), 'inventory.json')

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed - use POST' 
    })
  }

  try {
    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid inventory data - provide array of items' 
      })
    }

    // Write to inventory.json file
    fs.writeFileSync(INVENTORY_FILE, JSON.stringify(items, null, 2))

    // Also save as localStorage for frontend persistence
    const storedItems = JSON.parse(fs.readFileSync(
      path.join(process.cwd(), 'inventory_local.json'),
      'utf8'
    ) || '[]')
    
    fs.writeFileSync(
      path.join(process.cwd(), 'inventory_local.json'),
      JSON.stringify(items, null, 2)
    )

    return res.status(200).json({ 
      success: true, 
      message: 'Inventory saved successfully!',
      data: items.length
    })

  } catch (error) {
    console.error('Inventory save error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to save inventory' 
    })
  }
}
