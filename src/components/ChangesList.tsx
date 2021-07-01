import React from 'react'
import styled from 'styled-components'
import { Change } from 'prosemirror-changeset'

import { useEditorContext } from 'pm/EditorContext'
import { usePluginState } from './usePluginState'

import { TrackChangesState, trackChangesPluginKey } from 'pm/track-changes/track-changes-plugin'

interface IProps {
  className?: string
}

export function ChangesList(props: IProps) {
  const { className } = props
  const { viewProvider } = useEditorContext()
  const trackChangesState: TrackChangesState = usePluginState(trackChangesPluginKey)

  function handleAcceptChange(idx: number) {
    viewProvider.view.dispatch(viewProvider.view.state.tr.setMeta('accept-change', idx))
  }

  function handleRejectChange(idx: number) {
    const changeSet = trackChangesState.changeSet
    const change = changeSet.changes[idx]
    const slice = changeSet.startDoc.slice(change.fromA, change.toA)
    viewProvider.view.dispatch(viewProvider.view.state.tr.replaceWith(change.fromB, change.toB, slice.content))
  }

  return (
    <List className={className}>
      { trackChangesState?.changeSet.changes.map((c: Change, i: number) =>
      <CommitItem
        key={i}
      >
        <TitleWrapper>
          <h4>{ c.deleted.length > 0 ? c.inserted.length > 0 ? 'Insertion + Deletion' : 'Deletion' : 'Insertion'}</h4>
          <Buttons>
            <button onClick={() => handleAcceptChange(i)}>
              Accept
            </button>
            <button onClick={() => handleRejectChange(i)}>
              Reject
            </button>
          </Buttons>
        </TitleWrapper>
        <Ranges>
          <span className="msg">fromA: {c.fromA}</span>
          <span className="msg">toA: {c.toA}</span>
          <span className="msg">fromB: {c.fromB}</span>
          <span className="msg">toB: {c.toB}</span>
        </Ranges>
      </CommitItem>
      )}
    </List>
  )
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  & > li + li {
    margin-top: 1rem;
  }
`
const CommitItem = styled.li`
`
const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  & > h4 {
    margin: 0;
    margin-right: 1rem;
  }
`
const Buttons = styled.div`
  display: flex;
  margin: 0.25rem 0;
  button + button {
    margin-left: 0.5rem;
  }
`
const Ranges = styled.div`
  align-items: center;
  display: flex;
  & > .msg {
    margin-right: 1rem;
  }
`
