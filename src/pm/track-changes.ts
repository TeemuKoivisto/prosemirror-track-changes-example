import { EditorView } from 'prosemirror-view'
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { ChangeSet, Span } from 'prosemirror-changeset'
import { ReplaceStep } from 'prosemirror-transform'

import { ExampleSchema, schema } from './schema'

import './track-changes.css'

export interface PluginState {
  changeSet: ChangeSet
  decorationSet: DecorationSet<ExampleSchema>
}

export const trackChangesPluginKey = new PluginKey<PluginState, ExampleSchema>('track-changes')

const deletedWidget = (content: string) => (view: EditorView, getPos: () => number) => {
  const element = document.createElement('span')
  element.textContent = content
  element.classList.add('deleted')
  return element
}

/**
 * Not in use anymore as the content is now derived from doc (which makes joinChanges possible)
 * @param tr 
 * @param oldState 
 * @returns 
 */
function spanData(tr: Transaction, oldState: EditorState) {
  return tr.steps.map(s => {
    if (s instanceof ReplaceStep) {
      // @ts-ignore
      const noContent = s.slice.size === 0
      if (noContent) {
        // @ts-ignore
        return oldState.doc.textBetween(s.from, s.to)
      }
      // @ts-ignore
      return s.slice.content.textBetween(0, s.slice.size)
    }
  })
}

/**
 * Combines changes into one change, basically needed for deletions only since they behave weirdly
 * when the deletions are adjacent (probably a thing with adjacent decorations rather)
 * @param changes 
 * @returns 
 */
const joinChanges = (changes: Span[]) => changes.reduce((acc, cur, idx) => {
  if (idx === 0) return [cur]
  return Span.join([cur], acc, (a: any, b: any) => {
    // Should combine the metadatas, usernames and timestamps et cetera
    return b + a
  })
}, [] as Span[])

export const trackChangesPlugin = () =>
  new Plugin({
    key: trackChangesPluginKey,
    state: {
      init(config, state) {
        return {
          changeSet: ChangeSet.create(state.doc),
          decorationSet: DecorationSet.empty,
        }
      },

      apply(tr, value, oldState, newState) {
        const changeSet = value.changeSet.addSteps(tr.doc, tr.mapping.maps, spanData(tr, oldState))
        const decorations: Decoration[] = []
        let allDeletionsLength = 0
        let allInsertsLength = 0

        changeSet.changes.forEach((change) => {
          let insertFrom = change.fromB
          change.inserted.forEach((span) => {
            decorations.push(Decoration.inline(insertFrom, change.toB, { class: 'inserted' }))
            // @ts-ignore
            insertFrom += span.length
            // @ts-ignore
            allInsertsLength += span.length
          })

          joinChanges(change.deleted).forEach((span) => {
            // @ts-ignore
            const content = changeSet.startDoc.textBetween(change.fromA, change.fromA + span.length)
            decorations.push(
              Decoration.widget(change.fromA + allDeletionsLength + allInsertsLength, deletedWidget(content), {
                side: -1,
                marks: [schema.marks.strikethrough.create()],
              })
            )
            // @ts-ignore
            allDeletionsLength -= span.length
          })
        })

        return {
          changeSet,
          decorationSet: DecorationSet.create(tr.doc, decorations)
        }
      },
    },
    props: {
      decorations(state) {
        return this.getState(state).decorationSet
      },
    },
  })

