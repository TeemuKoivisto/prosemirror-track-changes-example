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

const deletedWidget = (span: Span) => (view: EditorView, getPos: () => number) => {
  const element = document.createElement('span')
  element.textContent = span.data
  element.classList.add('deleted')
  return element
}

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

        changeSet.changes.forEach((change) => {
          let insertFrom = change.fromB
          change.inserted.forEach((span) => {
            decorations.push(Decoration.inline(insertFrom, change.toB, { class: 'inserted' }))
            // @ts-ignore
            insertFrom += span.length
          })

          change.deleted.forEach((span) => {
            // debugger
            decorations.push(
              Decoration.widget(change.fromA + allDeletionsLength, deletedWidget(span), {
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

