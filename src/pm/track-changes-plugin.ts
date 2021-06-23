import { EditorView } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { ChangeSet } from 'prosemirror-changeset'

import { ExampleSchema, schema } from './schema'

export interface PluginState {
  changeSet: ChangeSet
  decorationSet: DecorationSet<ExampleSchema>
  userColors: Map<string, [string, string]>
}

export const trackChangesPluginKey = new PluginKey<PluginState, ExampleSchema>('track-changes')

const colorScheme: [string, string][] = [
  ['greenyellow', '#ffa4a4'],
  ['#10c727', '#ff0707'],
  ['#7adcb8', '#f93aa2']
]

const deletedWidget = (content: string, style: string) => (view: EditorView, getPos: () => number) => {
  const element = document.createElement('span')
  element.textContent = content
  element.setAttribute('style', style)
  return element
}

export const trackChangesPlugin = () =>
  new Plugin({
    key: trackChangesPluginKey,
    state: {
      init(config, state) {
        return {
          changeSet: ChangeSet.create(state.doc),
          decorationSet: DecorationSet.empty,
          userColors: new Map(),
        }
      },

      apply(tr, value, oldState, newState) {
        const userID = 'current-user'
        if (!value.userColors.has(userID)) {
          value.userColors.set(userID, colorScheme[value.userColors.size])
        }
        const changeSet = value.changeSet.addSteps(tr.doc, tr.mapping.maps, { userID })
        const decorations: Decoration[] = []
        let allDeletionsLength = 0
        let allInsertsLength = 0

        changeSet.changes.forEach((change) => {
          let insertFrom = change.fromB
          change.inserted.forEach((span) => {
            const colors = value.userColors.get(span.data.userID)
            const style = `background: ${colors ? colors[0] : ''};`
            decorations.push(Decoration.inline(insertFrom, change.toB, { style }))
            // @ts-ignore
            insertFrom += span.length
            // @ts-ignore
            allInsertsLength += span.length
          })

          let deletionsLength = 0
          change.deleted.forEach((span) => {
            const start = change.fromA + deletionsLength
            // @ts-ignore
            const content = changeSet.startDoc.textBetween(start, start + span.length)
            const colors = value.userColors.get(span.data.userID)
            const style = `background: ${colors ? colors[1] : ''};`
            decorations.push(
              Decoration.widget(start + allDeletionsLength + allInsertsLength, deletedWidget(content, style), {
                side: 0,
                marks: [schema.marks.strikethrough.create()],
              })
            )
            // @ts-ignore
            allDeletionsLength -= span.length
            // @ts-ignore
            deletionsLength += span.length
          })
        })

        return {
          changeSet,
          decorationSet: DecorationSet.create(tr.doc, decorations),
          userColors: value.userColors,
        }
      },
    },
    props: {
      decorations(state) {
        return this.getState(state).decorationSet
      },
    },
  })

