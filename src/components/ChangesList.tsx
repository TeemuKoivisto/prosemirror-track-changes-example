import React from 'react'
import styled from 'styled-components'
// import { Change } from 'prosemirror-changeset'
import { IChange } from 'custom-changeset'

import { useEditorContext } from 'pm/EditorContext'
import { usePluginState } from './usePluginState'

import { TrackChangesState, trackChangesPluginKey } from 'pm/track-changes/track-changes-plugin'

interface IProps {
  className?: string
}

export function ChangesList(props: IProps) {
  const { className } = props
  const { viewProvider } = useEditorContext()
  const trackChangesState = usePluginState<TrackChangesState>(trackChangesPluginKey)

  function handleAcceptChange(idx: number) {
    viewProvider.view.dispatch(viewProvider.view.state.tr.setMeta('accept-change', idx))
  }
  function handleRejectChange(idx: number) {
    viewProvider.view.dispatch(viewProvider.view.state.tr.setMeta('reject-change', idx))
  }
  function changeTitle(c: IChange) {
    if (c.isBlockChange() && c.inserted.length > 0) {
      return `Insert ${c.nodeType}`
    } else if (c.isBlockChange() && c.deleted.length > 0) {
      return `Delete ${c.nodeType}`
    }
    return c.deleted.length > 0 ? c.inserted.length > 0 ? 'Insertion + Deletion' : 'Deletion' : 'Insertion'
  }
  // const changes = trackChangesState?.changeSet.changes.filter((c: Change) => c.blockChange !== 'end') || []
  const changes = trackChangesState?.changeSet.changes || []
  return (
    <List className={className}>
      { changes.map((c: IChange, i: number) =>
      <CommitItem
        key={i}
      >
        <TitleWrapper>
          <h4>{ changeTitle(c) }</h4>
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
