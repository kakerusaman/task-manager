import type { Mode } from '../types'

type Props = {
  mode: Mode
  onChange: (mode: Mode) => void
}

const ITEMS: { mode: Mode; label: string }[] = [
  { mode: 'add', label: 'タスク入力' },
  { mode: 'manage', label: '今日のタスク' },
]

export default function SideNav({ mode, onChange }: Props) {
  return (
    <nav className="side-nav" aria-label="表示の切り替え">
      {ITEMS.map((item) => (
        <button
          key={item.mode}
          type="button"
          aria-current={mode === item.mode ? 'page' : undefined}
          onClick={() => onChange(item.mode)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
