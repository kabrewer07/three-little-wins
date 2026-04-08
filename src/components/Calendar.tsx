import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getLocalDate, calculateStreak } from '../lib/utils'

export default function Calendar() {
  const [loggedDates, setLoggedDates] = useState<string[]>([])
  const streak = calculateStreak(loggedDates)

  useEffect(() => {
    const fetchDates = async () => {
      const { data, error } = await supabase
        .from('wins')
        .select('date')
  
      if (error) {
        console.error(error)
        return
      }
  
      // Extract just the date strings from the response objects
      setLoggedDates(data.map(entry => entry.date))
    }
  
    fetchDates()
  }, [])

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  // First day of the month and total days in the month
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const todayDate = getLocalDate()

  return (
    <>
      {streak >= 2 && (
        <div className="bg-action text-white rounded-2xl p-4 text-center mb-4 shadow-sm">
          <p className="font-serif text-3xl font-semibold leading-none mb-1">{streak}</p>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">day streak</p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
          {monthName}
        </p>

        {/* Day of week labels */}
        <div className="grid grid-cols-7 mb-1">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} className="text-center text-xs font-bold text-subtle py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array(firstDayOfMonth).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const day = i + 1
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isToday = dateStr === todayDate
            const isLogged = loggedDates.includes(dateStr)

            return (
              <div
                key={day}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-xs font-semibold
                  ${isToday ? 'bg-action text-white' : ''}
                  ${isLogged && !isToday ? 'bg-input text-primary' : ''}
                  ${!isLogged && !isToday ? 'text-subtle' : ''}
                `}
              >
                {day}
              </div>
            )
          })}
        </div>

        <p className="text-xs text-subtle mt-3 text-right">
          {loggedDates.length} days logged
        </p>
      </div>
    </>
  )
}