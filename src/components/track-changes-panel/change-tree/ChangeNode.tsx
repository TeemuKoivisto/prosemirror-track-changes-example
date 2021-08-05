import React from 'react'
import styled from 'styled-components'

import { Change, ChangeTreeNode } from './types'

interface IProps {
  className?: string
  node: ChangeTreeNode
}

export const ChangeNode = (props: IProps) => {
  const { className = '', node } = props
  function handleChangeClick(change: Change) {
    console.log(change)
  }
  function stringifyValue(v: any) {
    if (typeof v === 'object') {
      return JSON.stringify(v)
    }
    return v
  }
  return (
    <>
      <Container className={className} depth={node.depth}>
        <ChangesList>
          {node.changes.map((c: Change, i: number) => (
            <ChangeItem key={i}>
              <span className="msg">{c.msg}</span>
              <span className="msg">{c.type}</span>
              <span className="msg">{c.key}</span>
              <span className="msg">{stringifyValue(c.value)}</span>
              <ShowBtn onClick={() => handleChangeClick(c)}>Show</ShowBtn>
            </ChangeItem>
          ))}
        </ChangesList>
      </Container>
      {node.children.map((n) => (
        <ChangeNode key={n.id} node={n} />
      ))}
    </>
  )
}

const Container = styled.li<{ depth: number }>`
  padding-left: ${({ depth }) => depth * 8}px;
`
const ChangesList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  & > li + li {
    margin-top: 0.5rem;
  }
`
const ChangeItem = styled.li`
  align-items: center;
  display: flex;
  & > .date {
    background: var(--color-primary-lighter);
    border: 4px;
    margin-right: 1rem;
    padding: 0.1rem 0.25rem;
  }
  & > .msg {
    margin-right: 1rem;
  }
`
const ShowBtn = styled.button<{ active?: boolean }>`
  background: ${({ active }) => active && 'pink'};
`
