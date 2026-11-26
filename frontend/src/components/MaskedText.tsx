import { splitMasked } from '../utils/mask'

type Props = {
  text: string
  /** マスクを区別するためのキーの接頭辞（欄ごとに変える） */
  idPrefix: string
  /** 表示中（開いている）マスクのキー */
  revealed: ReadonlySet<string>
  onToggle: (key: string) => void
}

export default function MaskedText({ text, idPrefix, revealed, onToggle }: Props) {
  return (
    <p className="masked-text">
      {splitMasked(text).map((seg, i) => {
        if (!seg.masked) return <span key={i}>{seg.text}</span>

        const key = `${idPrefix}-${seg.maskIndex}`
        const open = revealed.has(key)
        return (
          <button
            key={i}
            type="button"
            className={open ? 'mask open' : 'mask'}
            aria-pressed={open}
            onClick={() => onToggle(key)}
          >
            {open ? (
              seg.text
            ) : (
              <>
                {/* 文字数が答えのヒントにならないよう、長さは固定 */}
                <span aria-hidden="true">■■■</span>
                <span className="sr-only">（隠れています。押すと表示します）</span>
              </>
            )}
          </button>
        )
      })}
    </p>
  )
}
