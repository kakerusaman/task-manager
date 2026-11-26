import type { Task } from '../types'
import { toDateKey } from '../utils/date'

// 今日からの相対日付にして、いつ開いても「今日のタスク」が表示されるようにする
const day = (offset: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return toDateKey(d)
}

// レイアウト確認用のダミーデータ（のちにAPIから取得する想定）
export const createSampleTasks = (): Task[] => [
  {
    id: 1,
    title: '週次ミーティングの資料を作る',
    date: day(0),
    time: '10:00',
    done: true,
    hours: 1.5,
    report: {
      summary: '週次報告の資料は{{目的・結果・次の一手}}の3点で構成すると伝わりやすい。',
      explanation: '結論を先に示し、根拠は後から添える。聞き手が{{最初の30秒}}で全体像をつかめるようにする。',
      example: '例：「今週は3件完了。来週は{{AWSの構成図作成}}に着手します。」',
    },
  },
  { id: 2, title: 'ログイン処理の動作を確認する', date: day(0), time: '13:30', done: false },
  { id: 3, title: 'PostgreSQLのテーブル設計を見直す', date: day(0), done: false },
  { id: 4, title: 'AWS Skill Builderを1レッスン進める', date: day(0), time: '21:00', done: false },
  { id: 5, title: 'READMEを更新する', date: day(1), done: false },
  { id: 6, title: 'APIの設計をまとめる', date: day(2), time: '11:00', done: false },
  {
    id: 7,
    title: '技術記事を1本書く',
    date: day(-1),
    done: true,
    hours: 2,
    report: {
      summary: '技術記事は{{結論から先に書く}}と読みやすくなる。',
      explanation: '読者が知りたいのは{{何ができるようになるか}}なので、背景説明は短くする。',
      example: '',
    },
  },
  { id: 8, title: 'Reactのコンポーネント設計を学ぶ', date: day(4), done: false },
]
