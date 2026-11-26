import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Report, Task } from '../types'
import { formatLongDate, parseDateKey } from '../utils/date'
import { maskKeys } from '../utils/mask'
import MaskedText from './MaskedText'
import MaskField from './MaskField'

type Props = {
  /** 開くタスク。null のときはダイアログを閉じる */
  task: Task | null
  /** 保存せずに閉じたとき（Esc・背景クリック） */
  onDismiss: () => void
  /** 「閉じる」ボタン：保存して完了にする */
  onComplete: (id: number, report: Report, hours: number | undefined) => void
  /** 完了を取り消す */
  onReopen: (id: number) => void
}

const SECTIONS: { key: keyof Report; label: string; placeholder: string }[] = [
  { key: 'summary', label: '概要', placeholder: '例：VPCは、AWS上に作る自分専用の仮想ネットワーク。' },
  {
    key: 'explanation',
    label: '解説',
    placeholder: '例：サブネットをAZごとに作り、ルートテーブルで通信の行き先を決める。',
  },
  {
    key: 'example',
    label: '具体例',
    placeholder: '例：パブリックサブネットにWebサーバー、プライベートサブネットにDBを置く。',
  },
]

const EMPTY_REPORT: Report = { summary: '', explanation: '', example: '' }

const hasContent = (r: Report) => SECTIONS.some((s) => r[s.key].trim() !== '')

export default function TaskDialog({ task, onDismiss, onComplete, onReopen }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  // task の有無に合わせて、標準の <dialog> を開閉する
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (task && !dialog.open) dialog.showModal()
    if (!task && dialog.open) dialog.close()
  }, [task])

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onClose={onDismiss}
      onClick={(e) => {
        // 背景（::backdrop）をクリックしたときは保存せずに閉じる
        if (e.target === ref.current) ref.current?.close()
      }}
    >
      {task && <DialogBody key={task.id} task={task} onComplete={onComplete} onReopen={onReopen} />}
    </dialog>
  )
}

type BodyProps = Pick<Props, 'onComplete' | 'onReopen'> & { task: Task }
type ViewMode = 'edit' | 'review'

function DialogBody({ task, onComplete, onReopen }: BodyProps) {
  const initial = task.report ?? EMPTY_REPORT
  const [report, setReport] = useState<Report>(initial)
  const [hours, setHours] = useState(task.hours !== undefined ? String(task.hours) : '')
  const [error, setError] = useState('')
  // 完了済みで内容があるときは、復習モードから開く
  const [mode, setMode] = useState<ViewMode>(task.done && hasContent(initial) ? 'review' : 'edit')
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(new Set())

  const allKeys = SECTIONS.flatMap((s) => maskKeys(s.key, report[s.key]))

  const toggleMask = (key: string) =>
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const switchMode = (next: ViewMode) => {
    setMode(next)
    setRevealed(new Set()) // 復習に切り替えるたびに、すべて隠した状態に戻す
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()

    let value: number | undefined
    if (hours.trim() !== '') {
      const n = Number(hours)
      if (!Number.isFinite(n) || n < 0 || n > 24) {
        setError('学習時間は0〜24の数値で入力してください。')
        return
      }
      value = n
    }
    onComplete(
      task.id,
      {
        summary: report.summary.trim(),
        explanation: report.explanation.trim(),
        example: report.example.trim(),
      },
      value,
    )
  }

  return (
    <form className="dialog-body" onSubmit={submit} noValidate>
      <header className="dialog-head">
        <h2 id="dialog-title">{task.title}</h2>
        <p>
          {formatLongDate(parseDateKey(task.date))}
          {task.time ? ` ${task.time}` : ''}
        </p>
      </header>

      <div className="seg" role="group" aria-label="表示の切り替え">
        <button type="button" aria-pressed={mode === 'edit'} onClick={() => switchMode('edit')}>
          編集
        </button>
        <button type="button" aria-pressed={mode === 'review'} onClick={() => switchMode('review')}>
          復習
        </button>
      </div>

      {mode === 'edit' ? (
        <>
          <p className="hint hint-top">
            隠したい部分をドラッグで選んで「マスクする」を押すと、復習モードで隠れます。
          </p>
          {SECTIONS.map((s) => (
            <MaskField
              key={s.key}
              id={`report-${s.key}`}
              label={s.label}
              value={report[s.key]}
              placeholder={s.placeholder}
              onChange={(v) => setReport((prev) => ({ ...prev, [s.key]: v }))}
            />
          ))}
        </>
      ) : (
        <>
          <div className="review-tools">
            <button
              type="button"
              className="btn-mini"
              disabled={allKeys.length === 0}
              onClick={() => setRevealed(new Set(allKeys))}
            >
              すべて表示
            </button>
            <button type="button" className="btn-mini" onClick={() => setRevealed(new Set())}>
              すべて隠す
            </button>
            <span className="mask-count">マスク {allKeys.length}個</span>
          </div>

          {SECTIONS.map((s) => (
            <section key={s.key} className="review-section">
              <h3>{s.label}</h3>
              {report[s.key].trim() === '' ? (
                <p className="empty-note">（未入力）</p>
              ) : (
                <MaskedText
                  text={report[s.key]}
                  idPrefix={s.key}
                  revealed={revealed}
                  onToggle={toggleMask}
                />
              )}
            </section>
          ))}
        </>
      )}

      <div className="field">
        <label htmlFor="hours">学習時間</label>
        <div className="hours-input">
          <input
            id="hours"
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step={0.25}
            value={hours}
            onChange={(e) => {
              setHours(e.target.value)
              setError('')
            }}
            placeholder="1.5"
          />
          <span>時間</span>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <p className="hint">「閉じる」を押すと、入力内容を保存してタスクを完了にします。</p>

      <div className="dialog-actions">
        {task.done && (
          <button type="button" className="btn-ghost" onClick={() => onReopen(task.id)}>
            未完了に戻す
          </button>
        )}
        <button type="submit" className="btn-primary">
          閉じる
        </button>
      </div>
    </form>
  )
}
