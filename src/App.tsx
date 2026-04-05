import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import WinsForm from './components/WinsForm'
import PastEntries from './components/PastEntries'
import Calendar from './components/Calendar'

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
console.log(session.user.user_metadata.full_name)
  const handleSignOut = async () => {
    // Clears the session from Supabase and local storage —
    // onAuthStateChange fires automatically and sets session to null
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-[780px] mx-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
              <path d="M1 14 Q4 9 7 11 Q10 9 13 14" stroke="#1a237e" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <path d="M17 8 Q21 2 25 6 Q29 2 33 8" stroke="#1565a8" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M36 12 Q39 7 42 9 Q45 7 48 12" stroke="#3a8cc4" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
            </svg>
            <span className="font-serif text-action font-semibold text-sm">Three Little Wins</span>
          </div>

          {/* User avatar + sign out */}
          <div className="flex items-center gap-3">
            {session.user.user_metadata.avatar_url ? (
              <img
                src={session.user.user_metadata.avatar_url}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-action flex items-center justify-center text-white text-xs font-bold">
                {session.user.user_metadata.full_name?.[0].toUpperCase() ?? session.user.email?.[0].toUpperCase()}
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="text-xs font-semibold text-primary border border-subtle rounded-full px-3 py-1.5 hover:border-primary hover:text-action transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Main grid — form + sidebar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start mb-6">

          {/* Left column */}
          <div className="w-full sm:flex-1 min-w-0">
            <WinsForm session={session} />
          </div>

          {/* Right column */}
          <div className="hidden sm:block w-full sm:w-[200px] sm:flex-shrink-0">
            <Calendar />
          </div>

        </div>

        {/* Past entrie */}
        <p className="text-xs font-bold uppercase tracking-widest text-subtle px-1 mb-3">
          Past entries
        </p>
        <PastEntries />

      </div>
    </div>
  )
}

export default App