import React from 'react'
import styled from 'styled-components'

import { useEditorContext } from 'pm/EditorContext'
import { usePluginState } from '../usePluginState'

import { markTrackChangesPluginKey, MarkTrackChangesState, TextChange, NodeChange } from 'pm/mark-track-changes'

interface IProps {
  className?: string
}

export function ChangesList(props: IProps) {
  const { className } = props
  const { viewProvider } = useEditorContext()
  const trackChangesState = usePluginState<MarkTrackChangesState>(markTrackChangesPluginKey)

  function handleAcceptChange(idx: number) {
    viewProvider.view.dispatch(viewProvider.view.state.tr.setMeta('accept-change', idx))
  }
  function handleRejectChange(idx: number) {
    viewProvider.view.dispatch(viewProvider.view.state.tr.setMeta('reject-change', idx))
  }
  function changeTitle(c: any) {
    return 'Insertion'
  }
  return (
    <List className={className}>
      { trackChangesState?.changes.textChanges.map((c: TextChange, i: number) =>
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
          <span className="msg">from: {c.from}</span>
          <span className="msg">to: {c.to}</span>
          <span className="msg">{JSON.stringify(c.data)}</span>
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
