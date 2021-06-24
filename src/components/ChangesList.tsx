import React from 'react'
import styled from 'styled-components'
import { Change } from 'prosemirror-changeset'

import { useEditorContext } from 'pm/EditorContext'
import { usePluginState } from './usePluginState'

import { trackChangesPluginKey } from 'pm/track-changes-plugin'

interface IProps {
  className?: string
}

export function ChangesList(props: IProps) {
  const { className } = props
  const { viewProvider } = useEditorContext()
  const trackChangesState = usePluginState(trackChangesPluginKey)

  function handleRevertChangeClick(idx: number) {
    viewProvider.view.dispatch(viewProvider.view.state.tr.setMeta('revert-change', idx))
  }

  return (
    <List className={className}>
      { trackChangesState?.changeSet.changes.map((c: Change, i: number) =>
      <CommitItem
        key={i}
      >
        <TitleWrapper>
          <h4>{ c.deleted.length > 0 ? c.inserted.length > 0 ? 'Insertion + Deletion' : 'Deletion' : 'Insertion'}</h4>
          <RevertBtn
            onClick={() => handleRevertChangeClick(i)}
          >
            Revert
          </RevertBtn>
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
  display: flex;
  justify-content: space-between;
  & > h4 {
    margin: 0;
    margin-right: 1rem;
  }
  & > button {
    margin-right: 0.5rem;
  }
`
const Ranges = styled.div`
  align-items: center;
  display: flex;
  & > .msg {
    margin-right: 1rem;
  }
`
const RevertBtn = styled.button<{ active?: boolean }>`
  background: ${({ active }) => active && 'pink'};
`
