import { EditorView } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Change, ChangeSet } from 'prosemirror-changeset'

import { ExampleSchema } from './schema'

export interface PluginState {
  changeSet: ChangeSet
  decorationSet: DecorationSet<ExampleSchema>
  userColors: Map<string, [string, string]>
  userID: string
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
  new Plugin<PluginState, ExampleSchema>({
    key: trackChangesPluginKey,
    state: {
      init(config, state) {
        return {
          changeSet: ChangeSet.create(state.doc),
          decorationSet: DecorationSet.empty,
          userColors: new Map(),
          userID: '1',
        }
      },

      apply(tr, value, oldState, newState) {
        if (tr.getMeta('set-userID')) {
          return { ...value, userID: tr.getMeta('set-userID') }
        }
        const { userColors, userID } = value
        let { changeSet } = value
        if (tr.getMeta('revert-change') !== undefined) {
          const removedIndex = tr.getMeta('revert-change')
          let removedChange: Change | undefined
          let updatedChanges = changeSet.changes.reduce((acc, cur, i) => {
            if (i === removedIndex) {
              removedChange = cur
            } else if (removedChange) {
              const fromA = cur.fromA - removedChange.lenA
              const toA = cur.toA - removedChange.lenA
              const fromB = cur.fromB + removedChange.lenA
              const toB = cur.toB + removedChange.lenA
              acc.push(new Change(fromA, toA, fromB, toB, cur.deleted, cur.inserted))
            } else {
              acc.push(cur)
            }            
            return acc
          }, [] as Change[])
          // @ts-ignore
          changeSet = new ChangeSet({ ...changeSet.config, doc: tr.doc }, updatedChanges)
        } else {
          changeSet = changeSet.addSteps(tr.doc, tr.mapping.maps, { userID })
        }
        if (!userColors.has(userID)) {
          userColors.set(userID, colorScheme[userColors.size])
        }
        const decorations: Decoration[] = []
        let allDeletionsLength = 0
        let allInsertsLength = 0
        console.log('changed changeset', changeSet)
        changeSet.changes.forEach((change) => {
          let insertFrom = change.fromB
          change.inserted.forEach((span) => {
            const colors = value.userColors.get(span.data.userID)
            const style = `background: ${colors ? colors[0] : ''};`
            decorations.push(Decoration.inline(insertFrom, change.toB, { style }))
            console.log(`push insert from ${insertFrom} to ${change.toB}`)
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
                marks: [oldState.schema.marks.strikethrough.create()],
              })
            )
            console.log(`push delete at ${start + allDeletionsLength + allInsertsLength} ${content}`)
            // @ts-ignore
            allDeletionsLength -= span.length
            // @ts-ignore
            deletionsLength += span.length
          })
        })
        const val = {
          changeSet,
          decorationSet: DecorationSet.create(tr.doc, decorations),
          userColors,
          userID,
        }
        console.log('decorations', val.decorationSet)
        return val
      },
    },
    props: {
      decorations(state) {
        return this.getState(state).decorationSet
      },
    },
  })
