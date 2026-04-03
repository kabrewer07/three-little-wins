import { supabase } from '../lib/supabase'

export default function Auth() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      // Send user back to where they came from after auth
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-action mb-2">Three Little Wins</h1>
        <p className="text-primary mb-8">Track your daily wins, one day at a time.</p>
        <button
          onClick={handleGoogleLogin}
          className="bg-action text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}