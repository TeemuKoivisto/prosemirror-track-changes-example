import { Node as PMNode } from 'prosemirror-model'

export interface ChangeTreeNode {
  id: string
  node: PMNode
  depth: number
  type: string
  changes: Change[]
  path: number[]
  parent: string | null
  children: ChangeTreeNode[]
}

export interface Change {
  msg: string
  type: string
  key: string
  value: any
}
