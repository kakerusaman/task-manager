/** 学習報告（マスク用の {{ }} を含んだ文字列のまま保存する） */
export type Report = {
  /** 概要 */
  summary: string
  /** 解説 */
  explanation: string
  /** 具体例 */
  example: string
}

export type Task = {
  id: number
  title: string
  /** YYYY-MM-DD（ローカル日付） */
  date: string
  /** HH:mm（任意） */
  time?: string
  done: boolean
  /** 完了時に記録する学習報告 */
  report?: Report
  /** 学習時間（時間単位。例: 1.5） */
  hours?: number
}

/** 画面の表示モード（左の切り替えで選ぶ） */
export type Mode = 'add' | 'manage'
