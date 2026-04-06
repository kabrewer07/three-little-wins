import { supabase } from '../lib/supabase'

export default function Auth() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      // Send user back to wherever the app is running —
      // works for both localhost and production
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="text-center max-w-sm">

        {/* Birds logo */}
        <div className="flex justify-center mb-6">
          <svg width="64" height="28" viewBox="0 0 64 28" fill="none">
            <path d="M1 20 Q5 13 9 16 Q13 13 17 20" stroke="#1a237e" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M23 11 Q28 3 33 8 Q38 3 43 11" stroke="#1565a8" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <path d="M49 16 Q53 9 57 13 Q61 9 65 16" stroke="#3a8cc4" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl font-semibold text-action mb-3">
          Three Little Wins
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-primary mb-2 leading-relaxed">
          End each day by writing down three things that went well.
        </p>
        <p className="text-xs text-subtle mb-10">
          Small wins add up. This is proof.
        </p>

        {/* Sign in button */}
        <button
          onClick={handleGoogleLogin}
          className="bg-action text-white px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          Sign in with Google
        </button>

      </div>
    </div>
  )
}