import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  success: boolean
  message?: string
}

interface InventoryItem {
  name: string
  description?: string
  quantity: number
  unit: string
}

const STANDARD_KIT = [
  { name: 'Shaker', description: 'Boston shaker set', quantity: 1, unit: 'set' },
  { name: 'Jigger', description: 'Double-sided jigger (1.5oz/1oz)', quantity: 1, unit: 'pcs' },
  { name: 'Strainer', description: 'Hawthorne strainer', quantity: 1, unit: 'pcs' },
  { name: 'Bar Spoon', description: 'Long-handled bar spoon', quantity: 1, unit: 'pcs' }
]

const createStrictPrompt = (inventory: InventoryItem[], userMessage: string) => {
  const inventoryString = `Available Inventory:\n${inventory.map((item: InventoryItem) => `- ${item.name}: ${item.quantity} ${item.unit}`).join('\n')}`
  
  return `You are an elite AI mixologist working at Speakeasy Noir bar. You MUST only use items from the Available Inventory above to suggest drinks.

Standard Kit (always available): Shaker, Jigger, Strainer, Bar Spoon

User Message: "${userMessage}"

IMPORTANT RULES FOR STRICT MODE:
1. NEVER suggest drinks requiring ingredients not in the inventory
2. If a drink requires more of an ingredient than available, skip it
3. Always be creative with what you have
4. Respond professionally but with personality
5. Format responses clearly with sections

Format your response as follows:
### The Selection
[Drink names and brief descriptions]

---

### Mixologist's Note
[Brief note about the experience or any limitations]`
}

const createDiscoveryPrompt = (inventory: InventoryItem[], userMessage: string) => {
  const inventoryString = `Available Inventory:\n${inventory.map((item: InventoryItem) => `- ${item.name}: ${item.quantity} ${item.unit}`).join('\n')}`
  
  return `You are an elite AI mixologist working at Speakeasy Noir bar. You can suggest drinks from the Available Inventory, but you're allowed to suggest drinks requiring 1-2 items NOT in the inventory.

Standard Kit (always available): Shaker, Jigger, Strainer, Bar Spoon

User Message: "${userMessage}"

IMPORTANT RULES FOR DISCOVERY MODE:
1. Prioritize suggestions that use what we have first
2. For drinks requiring missing ingredients (1-2 max), clearly mark them as "MISSING - Recommended to Buy"
3. Never suggest drinks requiring 3+ missing items
4. Be creative and adventurous
5. Respond professionally but with personality and flair

Format your response as follows:

### From Our Bar
[Drinks using only available inventory]

---

### Missing Item Adventures
[Drinks that would be amazing if we had 1-2 ingredients, mark with "MISSING - Recommended to Buy" tag]

---

### Mixologist's Note
[Brief note about the experience]`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { message, mode = 'strict', inventory = [] as InventoryItem[] } = req.body

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      })
    }

    let GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY not set in environment - using mock response')
      
      // Mock response for development without API key
      const lowerMsg = message.toLowerCase()
      
      if (lowerMsg.includes('margarita')) {
        const msg = `🍸 *Tequila Sunset*\n\nA classic margarita with a twist of lime.\n\n**Ingredients:**\n- Tequila: 2 oz\n- Lime juice: 1 oz\n- Simple syrup: 0.5 oz\n- Salt (for rim)\n\n*Note: I'm using the standard kit tools to craft this for you.*`
        return res.status(200).json({ success: true, message: msg })
      }
      
      if (lowerMsg.includes('old fashioned') || lowerMsg.includes('whiskey')) {
        const msg = `🥃 *The Speakeasy Old Fashioned*\n\nSmoked and sophisticated, perfect for a rainy evening.\n\n**Ingredients:**\n- Whiskey: 2 oz\n- Angostura bitters: 2 dashes\n- Sugar cube\n- Orange peel\n\n*Enjoy your whiskey experience.*`
        return res.status(200).json({ success: true, message: msg })
      }
      
      if (lowerMsg.includes('highball') || lowerMsg.includes('gin')) {
        const msg = `🧊 *Gin & Tonic*\n\nClean, crisp, and refreshing.\n\n**Ingredients:**\n- Gin: 1.5 oz\n- Tonic water: 4 oz\n- Lime wedge\n- Ice\n\n*Perfect for a relaxed afternoon.*`
        return res.status(200).json({ success: true, message: msg })
      }
      
      if (lowerMsg.includes('sour') || lowerMsg.includes('lemon')) {
        const msg = `🍋 *Lemon Drop Sour*\n\nCocktail party favorite with a zesty kick.\n\n**Ingredients:**\n- Gin: 1.5 oz\n- Lemon juice: 0.75 oz\n- Simple syrup: 0.75 oz\n- Egg white (optional)\n\n*Shake hard, strain fine!*`
        return res.status(200).json({ success: true, message: msg })
      }

      const available = inventory.slice(0, 3).map((item: InventoryItem) => item.name).join(', ')
      const mockResponse = mode === 'strict' 
        ? `🍸 *Speakeasy Selection*\n\nBased on our current inventory: ${available}\n\n**I've curated a few options for you:**\n\n1. *Something Classic* - Using our house spirits and mixers\n2. *Citrus Splash* - If we have citrus available\n3. *Smooth & Clean* - Our signature highball option\n\n*What would you like to explore first?*`
        : `🍸 *Speakeasy Adventures*\n\n**From Our Bar:**\n- Classic cocktails with what we have\n\n**Missing Item Adventures:**\n*(I can suggest some amazing drinks if we grab these 1-2 items)*\n- A proper martini (needs vermouth)\n- Old fashioned (needs bitters)\n\n*Let me know what you'd like to try!*`
      
      return res.status(200).json({ success: true, message: mockResponse })
    }

    const systemMode = mode === 'strict' ? createStrictPrompt(inventory, message) : createDiscoveryPrompt(inventory, message)

    // Gemini API call - Using gemini-3-flash-preview (available model in v1beta)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: systemMode }]
        }]
      })
    })

    const data = await response.json()

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return res.status(200).json({ 
        success: true, 
        message: data.candidates[0].content.parts[0].text 
      })
    } else if (data.error) {
      console.error('Gemini API Error:', data.error)
      return res.status(500).json({ 
        success: false, 
        message: `API Error: ${data.error.message}` 
      })
    }

    return res.status(500).json({ success: false, message: 'No response from Gemini API' })

  } catch (error) {
    console.error('Chat API Error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again.' 
    })
  }
}
