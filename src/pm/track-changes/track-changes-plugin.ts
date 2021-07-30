import { DecorationSet } from 'prosemirror-view'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { DOMSerializer } from 'prosemirror-model'
// import { Change, ChangeSet } from 'prosemirror-changeset'
import { Change, ChangeSet } from 'custom-changeset'

import { acceptChange } from './acceptChange' 
import { renderCommentPopUp } from './CommentPopUp'
import { renderDecorations } from './renderDecorations'

import { ExampleSchema } from '../schema'
import { TrackedChangeType } from './types'

export interface TrackChangesState {
  startState: EditorState
  changeSet: ChangeSet
  decorationSet: DecorationSet<ExampleSchema>
  userColors: Map<string, [string, string]>
  userID: string
}

export const trackChangesPluginKey = new PluginKey<TrackChangesState, ExampleSchema>('track-changes')

const colorScheme: [string, string][] = [
  ['greenyellow', '#ffa4a4'],
  ['#10c727', '#ff0707'],
  ['#7adcb8', '#f93aa2']
]

export const trackChangesPlugin = () => {

  const popUpElement = document.createElement('div')
  popUpElement.id = 'track-changes-comment-pop-up'
  document.querySelector('body')?.appendChild(popUpElement)
  let renderedPopper: {
    destroy: () => void
  } | undefined
  let domSerializer: DOMSerializer<ExampleSchema>

  return new Plugin<TrackChangesState, ExampleSchema>({
    key: trackChangesPluginKey,
    state: {
      init(config, state) {
        domSerializer = state.schema.cached?.domSerializer || DOMSerializer.fromSchema(state.schema)
        return {
          startState: state,
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
        const { changeSet: oldChangeSet, startState: oldStartState, userColors, userID } = value
        let changeSet: ChangeSet
        let startState = oldStartState
        const changeIndex = Number(tr.getMeta('accept-change'))
        if (!Number.isNaN(changeIndex)) {
          changeSet = acceptChange(changeIndex, oldChangeSet, startState, oldState)
        } else {
          changeSet = oldChangeSet.addSteps(tr.doc, tr.mapping.maps, { userID })
          // changeSet = oldChangeSet.addSteps2(tr.doc, tr.steps, { userID })
        }

        if (!userColors.has(userID)) {
          userColors.set(userID, colorScheme[userColors.size])
        }
        const decorations = renderDecorations(changeSet, userColors, domSerializer, startState)
        return {
          startState,
          changeSet,
          decorationSet: DecorationSet.create(tr.doc, decorations),
          userColors,
          userID,
        }
      },
    },
    props: {
      decorations(state) {
        return this.getState(state).decorationSet
      },
      handleClickOn(view, _pos, _node, _nodePos, event, _direct) {
        const el = event.target ? event.target as HTMLElement : undefined
        const dataChangeIndex = el?.getAttribute('data-change-index')
        const dataChangeType = el?.getAttribute('data-change-type')

        if (el && dataChangeIndex && dataChangeType) {
          const changeSet = this.getState(view.state).changeSet
          const changeIndex = Number(dataChangeIndex)
          const change = changeSet.changes[changeIndex]
          const changeType = dataChangeType as TrackedChangeType
          const inserted = (changeType === 'insert' || changeType === 'insert+delete') ?
            view.state.doc.textBetween(change.fromB, change.toB) : undefined
          const deleted = (changeType === 'delete' || changeType === 'insert+delete') ?
            changeSet.startDoc.textBetween(change.fromA, change.toA) : undefined

          const props = {
            change: {
              type: changeType,
              timeStr: '02-13-2019 11:20AM',
              inserted,
              deleted,
              author: {
                name: 'John Doe'
              }
            },
            comments: [],
            onClose: () => {
              renderedPopper?.destroy()
            },
            onAccept: () => {
              view.dispatch(view.state.tr.setMeta('accept-change', changeIndex))
              renderedPopper?.destroy()
            },
            onReject: () => {
              const slice = changeSet.startDoc.slice(change.fromA, change.toA)
              view.dispatch(view.state.tr.replaceWith(change.fromB, change.toB, slice.content))
              renderedPopper?.destroy()
            },
            onSubmitReply: (text: string) => {
              console.log('submitted', text)
              return Promise.resolve()
            }
          }
          renderedPopper = renderCommentPopUp(el, popUpElement, props)
        }
        return false
      }
    },
  })
}