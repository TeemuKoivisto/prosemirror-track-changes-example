export interface Comment {
  id: string
  user: {
    name: string
  }
  timeStr: string
  text: string
}
export type TrackedChangeType = 'insert' | 'delete' | 'insert+delete'
export interface TrackedChange {
  type: TrackedChangeType
  timeStr: string
  content: string
  author: {
    name: string
  }
}
