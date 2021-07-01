import React, { useState } from 'react'
import styled from 'styled-components'
import { render, unmountComponentAtNode } from 'react-dom'
import { createPopper } from '@popperjs/core'

import { FiCheck, FiX } from 'react-icons/fi'

import { Comment, TrackedChange } from './types'

export function renderCommentPopUp(target: HTMLElement, container: HTMLElement, props: Props) {
  render(<CommentPopUp {...props}/>, container)
  const popper = createPopper(target, container, {
    placement: 'bottom',
  })
  return {
    destroy() {
      unmountComponentAtNode(container)
      popper.destroy()
    }
  }
}

interface Props {
  change: TrackedChange
  comments: Comment[]
  onClose: () => void
  onAccept: () => void
  onReject: () => void
  onSubmitReply: (text: string) => Promise<void>
}

function CommentPopUp(props: Props) {
  const { change, comments, onClose, onAccept, onReject, onSubmitReply } = props
  const [reply, setReply] = useState('')
  function handleKeyPress(e: React.KeyboardEvent) {

  }
  return (
    <Container>
      <CornerX>
        <CloseIconBtn onClick={() => onClose()}><FiX size={14}/></CloseIconBtn>
      </CornerX>
      <List>
        <Item>
          <UserInfo>
            <Name>{change.author.name}</Name>
            <Time>{change.timeStr}</Time>
          </UserInfo>
          { change.inserted && <div>inserted: "{change.inserted}"</div>}
          { change.deleted && <div>deleted: "{change.deleted}"</div>}
        </Item>
        { comments.map(c =>          
        <Item key={c.id}>
          <UserInfo>
            <Name>{c.user.name}</Name>
            <Time>{c.timeStr}</Time>
          </UserInfo>
          <div>
            {c.text}
          </div>
        </Item>
        )}
      </List>
      <ReplyInput placeholder="Reply..." value={reply} onChange={e => setReply(e.target.value)}/>
      <Buttons>
        <AcceptBtn className="accept" onClick={() => onAccept()}>
          <FiCheck size={14}/>
        </AcceptBtn>
        <AcceptBtn className="reject" onClick={() => onReject()}>
          <FiX size={14}/>
        </AcceptBtn>
      </Buttons>
    </Container>
  )
}

const Container = styled.div`
  background: #333;
  color: white;
  padding: 1rem;
  position: relative;
  font-size: 13px;
  border-radius: 4px;
`
const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`
const Item = styled.li`
  & > div {
    display: flex;
    margin-bottom: 0.25rem;
  }
`
const CornerX = styled.div`
  position: absolute;
  right: -6px;
  top: -6px;
`
const CloseIconBtn = styled.button`
  align-items: center;
  background: #333;
  border: 0;
  border-radius: 100%;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0.25rem;
`
const UserInfo = styled.div`
  display: flex;
`
const Name = styled.div`
  margin-right: 1rem;
`
const Time = styled.time``
const ReplyInput = styled.input`
  background: #e4e4e4;
  border: 0;
  border-radius: 2px;
  color: #222;
  height: 1rem;
  margin-top: 0.5rem;
  padding: 0.75rem 0.5rem;
  width: 100%;
`
const Buttons = styled.div`
  display: flex;
  margin-top: 1rem;
  & > button + button {
    margin-left: 1rem;
  }
`
const AcceptBtn = styled.button`
  align-items: center;
  border: 0;
  border-radius: 2px;
  color: #222;
  cursor: pointer;
  display: flex;
  padding: 0.25rem 0.75rem;
  justify-content: center;
  &.accept {
    background: #16d816;
  }
  &.reject {
    background: #ff3c3c;
  }
`
