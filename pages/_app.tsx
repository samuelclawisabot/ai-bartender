import '../styles/_globals.css'
import { useState, useEffect } from 'react'

interface AppProps {
  Component: any;
  pageProps: any;
}

// Session storage key to track current active tab across sessions
const ACTIVE_TAB_KEY = 'bartenderActiveTab';

export default function App({ Component, pageProps }: AppProps) {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const stored = sessionStorage.getItem(ACTIVE_TAB_KEY)
      return stored || (pageProps.activeTab as string) || 'chat'
    } catch {
      return 'chat'
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(ACTIVE_TAB_KEY, activeTab)
    } catch (e) {
      console.warn('Could not persist active tab:', e)
    }
  }, [activeTab])

  const ChatComponent = pageProps.activeTab === 'chat' ? Component : () => null
  const InventoryComponent = pageProps.activeTab === 'inventory' ? Component : () => null

  return <ChatComponent {...pageProps} activeTab={activeTab} />
}
