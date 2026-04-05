import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import WinsForm from './components/WinsForm'
import PastEntries from './components/PastEntries'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on load — handles page refreshes
    // where the user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Keep session in sync if user logs in/out in another tab
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Prevent memory leak in case user navigates away mid-authentication process
    return () => subscription.unsubscribe()
  }, [])

  // Avoid flashing login screen while we check auth status
  if (loading) return null

  if (!session) return <Auth />

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-lg mx-auto flex flex-col gap-6">
        <WinsForm session={session} />
        <p className="text-xs font-bold uppercase tracking-widest text-subtle px-1">
          Past entries
        </p>
        <PastEntries />
      </div>
    </div>
  )
}

export default App