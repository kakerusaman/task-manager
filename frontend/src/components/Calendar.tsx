import { useState } from 'react'
import { WEEKDAYS, toDateKey } from '../utils/date'

type Props = {
  selectedKey: string
  todayKey: string
  /** 日付ごとのタスク件数 */
  taskCounts: Record<string, number>
  onSelect: (key: string) => void
}

export default function Calendar({ selectedKey, todayKey, taskCounts, onSelect }: Props) {
  // 表示中の月（その月の1日で持つ）
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  // 月初の曜日ぶんだけ前月にさかのぼり、6週間（42日）分のマスを作る
  const cells = Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - cursor.getDay() + i))

  const moveMonth = (diff: number) => setCursor(new Date(year, month + diff, 1))

  const goToday = () => {
    const now = new Date()
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
    onSelect(todayKey)
  }

  return (
    <section className="panel calendar" aria-labelledby="calendar-title">
      <div className="calendar-head">
        <h2 id="calendar-title">
          {year}年{month + 1}月
        </h2>
        <div className="calendar-nav">
          <button type="button" className="btn-ghost" onClick={goToday}>
            今日
          </button>
          <button type="button" className="btn-icon" onClick={() => moveMonth(-1)} aria-label="前の月">
            ‹
          </button>
          <button type="button" className="btn-icon" onClick={() => moveMonth(1)} aria-label="次の月">
            ›
          </button>
        </div>
      </div>

      <div className="calendar-weekdays" aria-hidden="true">
        {WEEKDAYS.map((w, i) => (
          <span key={w} className={i === 0 ? 'sun' : i === 6 ? 'sat' : ''}>
            {w}
          </span>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((date) => {
          const key = toDateKey(date)
          const count = taskCounts[key] ?? 0
          const dow = date.getDay()
          const classes = ['cell']
          if (date.getMonth() !== month) classes.push('outside')
          if (key === todayKey) classes.push('today')
          if (key === selectedKey) classes.push('selected')
          if (dow === 0) classes.push('sun')
          if (dow === 6) classes.push('sat')

          return (
            <button
              key={key}
              type="button"
              className={classes.join(' ')}
              aria-pressed={key === selectedKey}
              aria-label={`${date.getMonth() + 1}月${date.getDate()}日、タスク${count}件`}
              onClick={() => onSelect(key)}
            >
              <span className="cell-num">{date.getDate()}</span>
              {count > 0 && (
                <span className="cell-marks" aria-hidden="true">
                  {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <i key={i} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
