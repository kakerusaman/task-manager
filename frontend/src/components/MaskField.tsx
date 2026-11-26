import { useRef, useState } from 'react'
import { countMasks, unwrapSelection, wrapSelection } from '../utils/mask'
import type { EditResult } from '../utils/mask'

type Props = {
  id: string
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}

export default function MaskField({ id, label, value, placeholder, onChange }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [message, setMessage] = useState('')

  const apply = (edit: (text: string, start: number, end: number) => EditResult) => {
    const el = ref.current
    if (!el) return

    const result = edit(value, el.selectionStart, el.selectionEnd)
    if ('error' in result) {
      setMessage(result.error)
      return
    }
    setMessage('')
    onChange(result.text)
    // 変更後も、対象の部分を選択したままにする
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(result.start, result.end)
    })
  }

  const count = countMasks(value)

  return (
    <div className="field report-field">
      <div className="field-head">
        <label htmlFor={id}>{label}</label>
        <div className="mask-tools">
          {count > 0 && <span className="mask-count">マスク {count}個</span>}
          <button type="button" className="btn-mini" onClick={() => apply(wrapSelection)}>
            マスクする
          </button>
          <button type="button" className="btn-mini" onClick={() => apply(unwrapSelection)}>
            マスクを外す
          </button>
        </div>
      </div>
      <textarea
        id={id}
        ref={ref}
        rows={3}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setMessage('')
        }}
        placeholder={placeholder}
      />
      {message && (
        <p className="mask-msg" role="alert">
          {message}
        </p>
      )}
    </div>
  )
}
