import { Delta } from 'jsondiffpatch'
import { Node as PMNode } from 'prosemirror-model'

import { ChangeTreeNode } from '../change-tree/types'

function createNode(
  node: PMNode,
  depth: number,
  path: number[],
  parent: string | null
): ChangeTreeNode {
  return {
    id: Math.random().toString(),
    node,
    depth: depth + 1,
    type: node.type.name,
    changes: [],
    path,
    parent,
    children: [],
  }
}

function isDelete(val: { [key: string]: any }) {
  return (
    Array.isArray(val) &&
    typeof val[0] === 'object' &&
    val[1] === 0 &&
    val[2] === 0
  )
}

function isMove(val: { [key: string]: any }) {
  return (
    Array.isArray(val) &&
    typeof val[0] === 'string' &&
    typeof val[1] === 'number' &&
    val[2] === 3
  )
}

function isTextDiff(val: { [key: string]: any }) {
  return (
    Array.isArray(val) &&
    typeof val[0] === 'string' &&
    val[1] === 0 &&
    val[2] === 2
  )
}

function isInsert(val: { [key: string]: any }) {
  return Array.isArray(val) && val.length === 1 && typeof val[0] === 'object'
}

function getArrayDeltaType(value: any) {
  if (!Array.isArray(value)) {
    return undefined
  } else if (isDelete(value)) {
    return 'delete'
  } else if (isMove(value)) {
    return 'move'
  } else if (isTextDiff(value)) {
    return 'text-diff'
  } else if (isInsert(value)) {
    return 'insert'
  }
  return 'unknown'
}

function getNode(node: PMNode, path: number[]): PMNode {
  return path.length === 0 ? node : getNode(node.child(path[0]), path.slice(1))
}

export function recurseDeltas(
  delta: Delta,
  pmNode: PMNode,
  depth: number,
  doc: PMNode,
  originalDoc: PMNode,
  path: number[],
  parent: string | null,
  treeMap: Map<ChangeTreeNode, ChangeTreeNode>
) {
  const treeNode = createNode(pmNode, depth, path, parent)
  treeMap.set(treeNode, treeNode)

  Object.entries(delta).forEach(([key, value]) => {
    const wasArrayDelta = Array.isArray(value)
    treeNode.changes.push({
      msg: `${pmNode.type.name} ${key} changed`,
      type: wasArrayDelta ? 'array-delta' : 'inner-change',
      key,
      value: wasArrayDelta ? value : undefined,
    })
  })

  const children = []
  for (const key in delta.content) {
    if (key === '_t') {
      continue
    }
    const wasMoveOrDelete = key.charAt(0) === '_'
    const val = delta.content[key]
    const index = wasMoveOrDelete ? parseInt(key.substr(1)) : parseInt(key)
    const arrayDelta = getArrayDeltaType(val)
    const childPath = path.concat(index)
    const foundNode =
      arrayDelta === 'delete'
        ? getNode(originalDoc, childPath)
        : getNode(doc, childPath)
    const childTreeNode = recurseDeltas(
      val,
      foundNode,
      depth + 1,
      doc,
      originalDoc,
      childPath,
      treeNode.id,
      treeMap
    )
    childTreeNode.changes.push({
      msg: `${foundNode.type.name} child node at ${index} changed`,
      type: arrayDelta ?? 'child-change',
      key,
      value: arrayDelta ?? undefined,
    })
    children.push(childTreeNode)
  }

  treeNode.children = children
  return treeNode
}

export function print(tree: ChangeTreeNode) {
  const recurse = (node: ChangeTreeNode): any => ({
    ...node,
    node: undefined,
    children: node.children.map((n) => recurse(n)),
  })
  const pruned = recurse(tree)
  console.log(JSON.stringify(pruned, null, 2))
}
