import { useMemo, useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import SideNav from './components/SideNav'
import TaskAddPanel from './components/TaskAddPanel'
import TaskDialog from './components/TaskDialog'
import TaskList from './components/TaskList'
import type { Mode, Report, Task } from './types'
import { formatLongDate, parseDateKey, toDateKey } from './utils/date'
import './App.css'

export default function App() {
  const todayKey = toDateKey(new Date())
  const [tasks, setTasks] = useState<Task[]>([]) // ← 初期値を空配列に
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedKey, setSelectedKey] = useState(todayKey)
  const [mode, setMode] = useState<Mode>('manage')
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/task')
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data: Task[] = await res.json()
        setTasks(data)
      } catch (e) {
        setError('タスクの取得に失敗しました')
        console.error('エラー:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // 日付ごとのタスク件数（カレンダーの印に使う）
  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach((t) => {
      counts[t.date] = (counts[t.date] ?? 0) + 1
    })
    return counts
  }, [tasks])

  // 選択中の日のタスク（時間ありを時刻順に、時間なしを後ろに）
  const selectedTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.date === selectedKey)
        .sort((a, b) => (a.time ?? '99:99').localeCompare(b.time ?? '99:99')),
    [tasks, selectedKey],
  )

  // ↓ フック（useState / useEffect / useMemo）はここまでで終わり
  //   早期returnは、すべてのフックの「後」に置く
  if (loading) return <p>読み込み中...</p>
  if (error) return <p>{error}</p>

  const openTask = tasks.find((t) => t.id === openId) ?? null

  // タスクを選択中の日に追加する（idはDB連携までの仮採番）
  const addTask = (title: string, time: string | undefined) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((t) => t.id)) + 1,
        title,
        date: selectedKey,
        time,
        done: false,
      },
    ])
  }

  const deleteTask = (id: number) => setTasks((prev) => prev.filter((t) => t.id !== id))

  // 「閉じる」：学習報告・学習時間を保存して、タスクを完了にする
  const completeTask = (id: number, report: Report, hours: number | undefined) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: true, report, hours } : t)))
    setOpenId(null)
  }

  const reopenTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: false } : t)))
    setOpenId(null)
  }

  const selectedDate = parseDateKey(selectedKey)
  const listTitle =
    selectedKey === todayKey
      ? '今日のタスク'
      : `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日のタスク`

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Task Manager</span>
        </div>
        <p className="today-label">{formatLongDate(new Date())}</p>
      </header>

      <div className="shell">
        <SideNav mode={mode} onChange={setMode} />

        <main className="layout">
          <Calendar
            selectedKey={selectedKey}
            todayKey={todayKey}
            taskCounts={taskCounts}
            onSelect={setSelectedKey}
          />
          {mode === 'add' ? (
            <TaskAddPanel
              dateKey={selectedKey}
              todayKey={todayKey}
              tasks={selectedTasks}
              onAdd={addTask}
              onDelete={deleteTask}
            />
          ) : (
            <TaskList title={listTitle} tasks={selectedTasks} onOpen={setOpenId} />
          )}
        </main>
      </div>

      <TaskDialog
        task={openTask}
        onDismiss={() => setOpenId(null)}
        onComplete={completeTask}
        onReopen={reopenTask}
      />
    </div>
  )
}