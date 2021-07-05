import { EditorState } from 'prosemirror-state'
import { Change, ChangeSet } from 'custom-changeset'

export function acceptChange(
  changeIndex: number,
  oldChangeSet: ChangeSet,
  startState: EditorState,
  currentState: EditorState
) {
  const acceptedChange = oldChangeSet.changes[changeIndex]
  const slice = currentState.doc.slice(acceptedChange.fromB, acceptedChange.toB)
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
  return new ChangeSet({ ...oldChangeSet.config, doc: startState.doc }, changes)
}