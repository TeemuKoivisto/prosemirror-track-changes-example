import React, { useState } from 'react'
import styled from 'styled-components'

import { useEditorContext } from 'pm/EditorContext'

interface IProps {
  className?: string
}

export function SelectUser(props: IProps) {
  const { className } = props
  const [userID, setUserID] = useState('1')
  const { viewProvider } = useEditorContext()

  function handleSelectUser(id: string) {
    const view = viewProvider.view
    view.dispatch(view.state.tr.setMeta('set-userID', id))
    setUserID(id)
  }
  return (
    <Container className={className}>
      <div className="current-user">
        Current user: {userID}
      </div>
      <div>
        <Button onClick={() => handleSelectUser('1')}>User 1</Button>
        <Button onClick={() => handleSelectUser('2')}>User 2</Button>
        <Button onClick={() => handleSelectUser('3')}>User 3</Button>
      </div>
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  .current-user {
    margin: 0.25rem 1rem 0.25rem 0;
  }
`
const Button = styled.button`
  cursor: pointer;
  & + & {
    margin-left: 0.5rem;
  }
`