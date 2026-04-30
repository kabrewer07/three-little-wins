import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getLocalDate } from '../lib/utils'

interface Entry {
  id: string
  date: string
  wins: string[]
  improvement: string | null
  created_at: string
}

const formatDate = (dateStr: string) => {
  // Parse as local date to avoid timezone shifting the day
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

interface Props {
  /** Bumped after a save in WinsForm so this list refetches. */
  refreshTrigger?: number
}

export default function PastEntries({ refreshTrigger = 0 }: Props) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const initialLoad = useRef(true)

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('wins')
        .select('*')
        .neq('date', getLocalDate())
        .order('date', { ascending: false })

      if (error) {
        console.error(error)
      } else {
        setEntries(data ?? [])
      }

      if (initialLoad.current) {
        setLoading(false)
        initialLoad.current = false
      }
    }

    void fetchEntries()
  }, [refreshTrigger])
  
  if (loading) return <p className="text-sm text-subtle">Loading...</p>

  if (entries.length === 0) return <p className="text-sm text-subtle">No entries yet.</p>

  return (
    <div className="flex flex-col gap-3">
      {entries.map(entry => (
        <div key={entry.id} className="bg-white rounded-xl border-l-4 border-subtle p-4 shadow-sm">
          <div className="flex items-baseline justify-between mb-2">
            <p className="font-serif font-semibold text-action text-sm">{formatDate(entry.date)}</p>
            <p className="text-xs text-subtle">{entry.wins.length} {entry.wins.length === 1 ? 'win' : 'wins'}</p>
          </div>
          <div className="flex flex-col gap-1">
            {entry.wins.map((win, index) => (
              <div key={index} className="flex gap-2 text-sm text-primary">
                <span className="text-subtle text-xs font-bold flex-shrink-0 mt-0.5">{index + 1}</span>
                <span>{win}</span>
              </div>
            ))}
          </div>
          {entry.improvement && (
            <div className="mt-2 pt-2 border-t border-input flex gap-2 text-sm text-accent">
              <span className="text-xs font-bold flex-shrink-0 mt-0.5">↑</span>
              <span>{entry.improvement}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}