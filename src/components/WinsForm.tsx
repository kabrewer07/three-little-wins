import type { Session } from '@supabase/supabase-js'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface Props {
  session: Session
}

export default function WinsForm({ session }: Props) {
  const [wins, setWins] = useState(['', '', ''])
  const [improvement, setImprovement] = useState('')
  const [saving, setSaving] = useState(false)

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  const improvementPrompts = [
    "Start work earlier instead of spiraling in the morning",
    "Reply to that email instead of putting it off again",
    "Don't skip lunch when I'm in the zone",
    "Be less hard on myself when something takes longer than expected",
    "Actually close Slack when I need to focus",
    "Go outside before looking at my phone",
    "Drink water before coffee",
    "Take a real break instead of doom scrolling",
    "Say no to something that doesn't serve me",
    "Write down what's worrying me instead of carrying it",
  ]
  
  const dayOfYear = Math.floor(
    (Number(new Date()) - Number(new Date(new Date().getFullYear(), 0, 0))) / 86400000
  )
  
  const todaysPrompt = improvementPrompts[dayOfYear % improvementPrompts.length]

  const handleWinChange = (index: number, value: string) => {
    const updated = [...wins]
    updated[index] = value
    setWins(updated)
  }

  const handleAddWin = () => {
    setWins([...wins, ''])
  }

  const handleSave = async () => {
    // Filter out empty wins before saving
    const filteredWins = wins.filter(w => w.trim() !== '')
  
    if (filteredWins.length === 0) return
  
    setSaving(true)
  
    const { error } = await supabase.from('wins').insert({
      user_id: session.user.id,
      date: new Date().toISOString().split('T')[0],
      wins: filteredWins,
      improvement: improvement.trim() || null
    })
  
    if (error) {
      console.error(error)
    }
  
    setSaving(false)
  }
    
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-action mb-1">Three Little Wins</h1>
        <p className="text-sm text-primary mb-6">{today}</p>
  
        <p className="text-xs font-bold uppercase tracking-widest text-subtle mb-3">Your wins</p>
  
        <div className="flex flex-col gap-3 mb-2">
          {wins.map((win, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {index + 1}
              </div>
              <input
                type="text"
                value={win}
                onChange={e => handleWinChange(index, e.target.value)}
                placeholder="What went well today?"
                className="flex-1 bg-input border border-subtle rounded-xl px-4 py-2 text-sm text-ink placeholder:text-subtle outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
        </div>
  
        <button
          onClick={handleAddWin}
          className="text-primary text-sm font-semibold ml-9 mb-6 hover:text-action transition-colors"
        >
          + add another win
        </button>
  
        <div className="h-px bg-input mb-6" />
  
        <p className="text-xs font-bold uppercase tracking-widest text-subtle mb-3">One thing to improve</p>
  
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">↑</div>
          <input
            type="text"
            value={improvement}
            onChange={e => setImprovement(e.target.value)}
            placeholder={`e.g. ${todaysPrompt}`}
            className="flex-1 bg-input border border-subtle rounded-xl px-4 py-2 text-sm text-ink placeholder:text-subtle outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-action text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save today\'s wins ✦'}
          </button>
        </div>
  
      </div>
    </div>
  )
}