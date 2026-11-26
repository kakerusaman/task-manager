import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Task } from '../types'
import { formatLongDate, parseDateKey } from '../utils/date'

type Props = {
  /** 追加先の日付（カレンダーで選んだ日） */
  dateKey: string
  todayKey: string
  /** その日に登録済みのタスク */
  tasks: Task[]
  onAdd: (title: string, time: string | undefined) => void
  onDelete: (id: number) => void
}

export default function TaskAddPanel({ dateKey, todayKey, tasks, onAdd, onDelete }: Props) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [error, setError] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (trimmed === '') {
      setError('タスク名を入力してください。')
      titleRef.current?.focus()
      return
    }
    onAdd(trimmed, time === '' ? undefined : time)
    setTitle('')
    setTime('')
    setError('')
    titleRef.current?.focus() // 続けて入力できるようにする
  }

  const dateLabel = formatLongDate(parseDateKey(dateKey))

  return (
    <section className="panel add-panel" aria-labelledby="add-title">
      <h2 id="add-title">タスクを追加</h2>
      <p className="add-date">
        {dateLabel}
        {dateKey === todayKey ? '（今日）' : ''}
      </p>

      <form className="add-form" onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="new-title">タスク名</label>
          <input
            id="new-title"
            ref={titleRef}
            type="text"
            maxLength={255}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError('')
            }}
            placeholder="例：VPCの構成図を書く"
          />
        </div>

        <div className="add-row">
          <div className="field">
            <label htmlFor="new-time">時刻（任意）</label>
            <input id="new-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary">
            追加
          </button>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>

      <div className="added">
        <h3>
          この日のタスク <span className="added-count">{tasks.length}件</span>
        </h3>

        {tasks.length === 0 ? (
          <p className="empty">まだタスクがありません。上のフォームから追加してください。</p>
        ) : (
          <ul className="added-list">
            {tasks.map((task) => (
              <li key={task.id} className="added-item">
                <span className="added-time">{task.time ?? '時刻なし'}</span>
                <span className="added-title">
                  {task.title}
                  {task.done && <span className="badge">完了</span>}
                </span>
                {/* 学習記録のある完了済みタスクは、ここからは削除できない */}
                {!task.done && (
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => onDelete(task.id)}
                    aria-label={`「${task.title}」を削除`}
                  >
                    削除
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
