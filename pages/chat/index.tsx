import { useState, useEffect } from 'react'

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [mode, setMode] = useState<'strict' | 'discovery'>('strict')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load initial messages if needed
    const stored = localStorage.getItem('bartenderMessages')
    if (stored) {
      setMessages(JSON.parse(stored))
    } else {
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        text: "🍸 *Welcome to Speakeasy*, I'm your AI mixologist.\n\nI can suggest cocktails based on what's in our bar.\n\n*Current Mode*: **Strict** (I'll only use what we have)\n\nType a drink idea or ask for suggestions!",
        timestamp: new Date().toISOString()
      }])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('bartenderMessages', JSON.stringify(messages))
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const userMsg: any = {
      id: Date.now(),
      role: 'user',
      text: inputText,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setLoading(true)

    // Load inventory from localStorage (simpler than file system in client-side)
    let inventory = []
    try {
      const storedInventory = localStorage.getItem('bartenderInventory')
      if (storedInventory) {
        inventory = JSON.parse(storedInventory)
      }
    } catch (e) {
      console.warn('Could not load inventory from localStorage:', e)
    }

    // Call the API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: inputText, mode, inventory })
    })

    const data = await response.json()
    
    if (data.success && data.message) {
      const botMsg: any = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.message,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, botMsg])
    }

    setLoading(false)
  }

  const userClasses = "bg-neon-cyan/10 border border-neon-cyan/20"
  const botClasses = "bg-noir-700/50 border border-neon-purple/20"
  const submitBtnClasses = loading 
    ? "opacity-50 cursor-not-allowed transform scale-100" 
    : "hover:scale-105"

  return (
    <div className="min-h-screen bg-noir-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-noir-800/50 backdrop-blur-xl rounded-3xl border border-neon-purple/20 overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-noir-900 via-noir-800 to-noir-900 p-6 border-b border-neon-purple/10">
          <h1 className="text-3xl font-light tracking-wider text-white mb-2">
            🍸 Speakeasy <span className="font-mono text-neon-cyan/80">N O I R</span>
          </h1>
          <div className="flex gap-4">
            <button 
              onClick={() => setMode('strict')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'strict' 
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,245,255,0.3)]' 
                  : 'bg-noir-700 text-gray-400 hover:bg-noir-600'
              }`}
            >
              🔒 Strict Mode
            </button>
            <button 
              onClick={() => setMode('discovery')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'discovery' 
                  ? 'bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/50 shadow-[0_0_15px_rgba(255,0,255,0.3)]' 
                  : 'bg-noir-700 text-gray-400 hover:bg-noir-600'
              }`}
            >
              🔍 Discovery Mode
            </button>
          </div>
        </div>

        {/* Messages Area - Fixed height with scroll for long conversations */}
        <div className="flex-1 max-h-[60vh] overflow-y-auto overflow-x-hidden p-6 space-y-4"/>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 backdrop-blur-sm ${msg.role === 'user' ? userClasses : botClasses}`}
              >
                <p className="text-gray-100 whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <span className="text-xs text-neon-purple/40 mt-2 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-6 bg-noir-900 border-t border-neon-purple/10">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What would you like to drink?"
              disabled={loading}
              className="flex-1 bg-noir-800/50 border border-neon-purple/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className={`bg-gradient-to-r from-neon-purple to-neon-magenta hover:from-neon-magenta hover:to-neon-cyan text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all flex items-center gap-2 ${submitBtnClasses}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.062 2.581 5.5 5.69 5.85" />
                  </svg>
                  <span>Crafting...</span>
                </>
              ) : (
                <>Send <span className="ml-2">→</span></>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
