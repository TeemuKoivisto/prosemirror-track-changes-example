import React from 'react'
import styled from 'styled-components'

import { ChangeNode } from './ChangeNode'
import { ChangeTreeNode } from './types'

interface Props {
  className?: string
  changeTree: ChangeTreeNode | null
}

export const ChangeSummary = (props: Props) => {
  const { className = '', changeTree } = props
  return (
    <Container className={className}>
      {changeTree && <ChangeNode node={changeTree} />}
    </Container>
  )
}

const Container = styled.ul`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  list-style: none;
  margin: 0 0 1rem 0;
  padding: 0;
  & > li + li {
    margin-top: 0.5rem;
  }
`
