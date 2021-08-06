
export interface TextChange {
  type: 'text-change'
  from: number
  to: number
  data: any
}
export interface NodeChange {
  type: 'node-change'
  from: number
  data: any
}

export class Changes {

  textChanges: TextChange[]
  nodeChanges: NodeChange[]
  // markChanges: MarkChange[]

  constructor(textChanges: TextChange[], nodeChanges: NodeChange[]) {
    this.textChanges = textChanges
    this.nodeChanges = nodeChanges
  }

  get isEmpty() {
    return this.textChanges.length === 0 && this.nodeChanges.length === 0
  }

  pushChange(change: TextChange | NodeChange) {
    if (change.type === 'text-change') {
      this.textChanges.push(change)
    } else {
      this.nodeChanges.push(change)
    }
  }
}
