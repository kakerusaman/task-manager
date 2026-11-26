import type { Task } from '../types'

type Props = {
  title: string
  tasks: Task[]
  onOpen: (id: number) => void
}

export default function TaskList({ title, tasks, onOpen }: Props) {
  const doneCount = tasks.filter((t) => t.done).length
  const percent = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100)

  return (
    <section className="panel tasks" aria-labelledby="tasks-title">
      <h2 id="tasks-title">{title}</h2>

      <div className="progress">
        <p className="progress-text">
          {tasks.length === 0 ? 'タスクなし' : `${tasks.length}件中 ${doneCount}件が完了`}
        </p>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="完了率"
        >
          <span style={{ width: `${percent}%` }} />
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="empty">この日のタスクはありません。</p>
      ) : (
        <>
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.done ? 'task done' : 'task'}>
                <button type="button" className="task-row" onClick={() => onOpen(task.id)}>
                  <span className="check" aria-hidden="true">
                    ✓
                  </span>
                  <span className="task-title">
                    <span className="sr-only">{task.done ? '完了：' : '未完了：'}</span>
                    {task.title}
                  </span>
                  <span className="task-meta">
                    {task.hours !== undefined && <span>{task.hours}時間</span>}
                    {task.time && <time>{task.time}</time>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="hint">タスクを押すと、学んだことと学習時間を記録できます。</p>
        </>
      )}
    </section>
  )
}
