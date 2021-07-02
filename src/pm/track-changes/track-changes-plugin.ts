import { EditorView, Decoration, DecorationSet } from 'prosemirror-view'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
// import { Change, ChangeSet } from 'prosemirror-changeset'
import { Change, ChangeSet } from 'custom-changeset'

import { renderCommentPopUp } from './CommentPopUp'

import { ExampleSchema } from '../schema'
import { TrackedChangeType } from './types'

export interface TrackChangesState {
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

const deletedWidget = (content: string, attrs: {[key: string]: string}) => (view: EditorView, getPos: () => number) => {
  const element = document.createElement('span')
  element.textContent = content
  Object.keys(attrs).forEach((key) => {
    element.setAttribute(key, attrs[key])
  })
  return element
}

export const trackChangesPlugin = () => {

  const popUpElement = document.createElement('div')
  popUpElement.id = 'track-changes-comment-pop-up'
  document.querySelector('body')?.appendChild(popUpElement)
  let renderedPopper: {
    destroy: () => void
  } | undefined

  return new Plugin<TrackChangesState, ExampleSchema>({
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
        const { changeSet: oldChangeSet, userColors, userID } = value
        let changeSet: ChangeSet
        const changeIndex = Number(tr.getMeta('accept-change'))
        if (!Number.isNaN(changeIndex)) {
          const acceptedChange = oldChangeSet.changes[changeIndex]
          const slice = oldState.doc.slice(acceptedChange.fromB, acceptedChange.toB)
          let startState = EditorState.create({
            schema: oldState.schema,
            doc: oldChangeSet.startDoc,
          })
          startState = startState.apply(startState.tr.replaceWith(acceptedChange.fromA, acceptedChange.toA, slice.content))
          // The changes before the accepted change stay as previously, only the changes afterwards must be updated
          // to account for the changed startDoc
          const beforeChanges = oldChangeSet.changes.slice(0, changeIndex)
          const afterChanges = oldChangeSet.changes.slice(changeIndex + 1).map(c => {
            const fromA = c.fromA - acceptedChange.lenA + slice.content.size
            const toA = c.toA - acceptedChange.lenA + slice.content.size
            return new Change(fromA, toA, c.fromB, c.toB, c.deleted, c.inserted)
          })
          const changes = [...beforeChanges, ...afterChanges]
          // @ts-ignore
          changeSet = new ChangeSet({ ...oldChangeSet.config, doc: startState.doc }, changes)
        } else {
          changeSet = oldChangeSet.addSteps(tr.doc, tr.mapping.maps, { userID })
        }

        if (!userColors.has(userID)) {
          userColors.set(userID, colorScheme[userColors.size])
        }
        const decorations: Decoration[] = []
        let allDeletionsLength = 0
        let allInsertsLength = 0

        changeSet.changes.forEach((change, index) => {
          let insertFrom = change.fromB
          const { inserted, deleted } = change
          const changeType = change.deleted.length > 0 ? change.inserted.length > 0 ? 'insert+delete' : 'delete' : 'insert'
          inserted.forEach((span) => {
            const colors = value.userColors.get(span.data.userID)
            const style = `background: ${colors ? colors[0] : ''};`
            decorations.push(Decoration.inline(insertFrom, change.toB, {
              style,
              'data-change-type': changeType,
              'data-change-index': index.toString(),
            }))
            // @ts-ignore
            insertFrom += span.length
            // @ts-ignore
            allInsertsLength += span.length
          })

          let deletionsLength = 0
          deleted.forEach((span) => {
            const start = change.fromA + deletionsLength
            // @ts-ignore
            const content = changeSet.startDoc.textBetween(start, start + span.length)
            const colors = value.userColors.get(span.data.userID)
            const style = `background: ${colors ? colors[1] : ''};`
            const attrs = {
              style,
              'data-change-type': changeType,
              'data-change-index': index.toString(),
            }
            decorations.push(
              Decoration.widget(start + allDeletionsLength + allInsertsLength, deletedWidget(content, attrs), {
                side: 0,
                marks: [oldState.schema.marks.strikethrough.create()],
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