import { EditorState, Transaction } from 'prosemirror-state'
import { AddMarkStep, RemoveMarkStep, ReplaceAroundStep, ReplaceStep, Step, StepMap } from 'prosemirror-transform'

import { schema, ExampleSchema } from 'pm/schema'

export function trackTransaction(tr: Transaction<ExampleSchema>, newTr: Transaction<ExampleSchema>, userId: string) {
  const trackAttrs = {
    dataTracked: {
      userId,
      time: tr.time,
    }
  }
  // text_changes, node_changes, mark_changes
  const changes: {
    ranges: any[],
    nodes: any[]
  } = {
    ranges: [],
    nodes: [],
  }
  const insertMark = schema.marks.insertion.create(trackAttrs)

  tr.steps.forEach((step, idx) => {
    if (step instanceof ReplaceStep) {
      step.getMap().forEach((fromA: number, toA: number, fromB: number, toB: number) => {
        if (fromB === toB) return
        // console.log(`changed ${fromA} ${toA} ${fromB} ${toB}`)
        newTr.addMark(fromB, toB, insertMark)
        changes.ranges.push([fromB, toB, trackAttrs])
        newTr.doc.nodesBetween(fromB, toB, (node, pos) => {
          if (node.isBlock) {
            newTr.setNodeMarkup(pos, undefined, Object.assign({}, node.attrs, trackAttrs), node.marks)
            changes.nodes.push([pos, trackAttrs])
          }
        })
      })
    } else if (step instanceof ReplaceAroundStep) {
      
    }
  })
  // console.log(newTr)
  return newTr.setMeta('tracked-tr', true).setMeta('track-changes', changes)
}
