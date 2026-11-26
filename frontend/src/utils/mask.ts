/**
 * マスク記法：隠したい部分を {{ }} で囲む（例: VPCは{{仮想ネットワーク}}）
 * 文字列のまま保存しておき、表示するときにだけ解釈する。
 */

export type Segment = {
  text: string
  masked: boolean
  /** マスクの通し番号（マスクでなければ -1） */
  maskIndex: number
}

type MaskRange = { start: number; end: number; inner: string } // end は含まない

export type EditResult = { text: string; start: number; end: number } | { error: string }

const MARK = 2 // "{{" と "}}" の長さ

const findMasks = (text: string): MaskRange[] => {
  const result: MaskRange[] = []
  for (const m of text.matchAll(/\{\{([\s\S]+?)\}\}/g)) {
    const start = m.index ?? 0
    result.push({ start, end: start + m[0].length, inner: m[1] })
  }
  return result
}

/** 文章を「普通の部分」と「マスク部分」に分ける */
export const splitMasked = (text: string): Segment[] => {
  const segments: Segment[] = []
  let last = 0
  findMasks(text).forEach((m, i) => {
    if (m.start > last) segments.push({ text: text.slice(last, m.start), masked: false, maskIndex: -1 })
    segments.push({ text: m.inner, masked: true, maskIndex: i })
    last = m.end
  })
  if (last < text.length) segments.push({ text: text.slice(last), masked: false, maskIndex: -1 })
  return segments
}

export const countMasks = (text: string): number => findMasks(text).length

/** マスク1つ1つを区別するためのキー */
export const maskKeys = (prefix: string, text: string): string[] =>
  Array.from({ length: countMasks(text) }, (_, i) => `${prefix}-${i}`)

/** 選択範囲を {{ }} で囲む */
export const wrapSelection = (text: string, start: number, end: number): EditResult => {
  // 選択範囲の前後の空白は、マスクに含めない
  const selected = text.slice(start, end)
  const s = start + (selected.length - selected.trimStart().length)
  const e = end - (selected.length - selected.trimEnd().length)

  if (e <= s) return { error: 'マスクしたい部分を、ドラッグで選択してください。' }
  if (findMasks(text).some((m) => s < m.end && e > m.start)) {
    return { error: 'すでにマスクされている部分は、重ねてマスクできません。' }
  }
  const target = text.slice(s, e)
  if (target.includes('{{') || target.includes('}}')) {
    return { error: '「{{」「}}」を含む部分はマスクできません。' }
  }
  return {
    text: text.slice(0, s) + '{{' + target + '}}' + text.slice(e),
    start: s,
    end: e + MARK * 2,
  }
}

/** 選択範囲（またはカーソル位置）にあるマスクを外す */
export const unwrapSelection = (text: string, start: number, end: number): EditResult => {
  const hits = findMasks(text).filter((m) =>
    start === end ? start >= m.start && start <= m.end : start < m.end && end > m.start,
  )
  if (hits.length === 0) {
    return {
      error:
        start === end
          ? 'マスクの中にカーソルを置くか、外したい部分を選択してください。'
          : '選択範囲にマスクがありません。',
    }
  }
  let result = text
  for (const m of [...hits].reverse()) {
    result = result.slice(0, m.start) + m.inner + result.slice(m.end)
  }
  return {
    text: result,
    start: hits[0].start,
    end: hits[hits.length - 1].end - hits.length * MARK * 2,
  }
}
