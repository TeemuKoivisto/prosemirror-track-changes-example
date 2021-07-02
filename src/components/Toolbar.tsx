import React from 'react'
import styled from 'styled-components'
import { toggleMark } from 'prosemirror-commands'

import {
  FiBold, FiItalic
} from 'react-icons/fi'
import { GrBlockQuote } from 'react-icons/gr'

import { useEditorContext } from 'pm/EditorContext'
import { usePluginStateProvider } from './usePluginStateProvider'
import { activeNodesMarksPluginKey, ActiveNodesMarksState } from 'pm/active-nodes-marks'

type IconType = 'bold' | 'italic' | 'toggle-blockquote'

const marksIcons: {
  title: IconType
  icon: React.ReactNode
}[] = [
  {
    title: 'bold',
    icon: <FiBold size={16} />
  },
  {
    title: 'italic',
    icon: <FiItalic size={16}/>
  },
]

const commandIcons: {
  title: IconType
  icon: React.ReactNode
}[] = [
  {
    title: 'toggle-blockquote',
    icon: <GrBlockQuote size={16}/>
  },
]

export function Toolbar() {
  const { viewProvider } = useEditorContext()
  const activeNodesMarksPlugin = usePluginStateProvider<ActiveNodesMarksState>(activeNodesMarksPluginKey)

  function handleIconClick(title: IconType) {
    switch (title) {
      case 'bold':
        viewProvider.execCommand(toggleMark(viewProvider.view.state.schema.marks.bold))
        return
      case 'italic':
        viewProvider.execCommand(toggleMark(viewProvider.view.state.schema.marks.italic))
        return
      case 'toggle-blockquote':
        return
    }
  }
  return (
    <Container>
      <IconList>
        {marksIcons.map(item =>
          <IconItem key={item.title}>
            <IconButton
              className={`${activeNodesMarksPlugin?.activeMarks.includes(item.title) ? 'active' : ''}`}
              onClick={() => handleIconClick(item.title)}
            >
              {item.icon}
            </IconButton>
          </IconItem>
        )}
        {commandIcons.map(item =>
          <IconItem key={item.title}>
            <IconButton onClick={() => handleIconClick(item.title)}>
              {item.icon}
            </IconButton>
          </IconItem>
        )}
      </IconList>
    </Container>
  )
}

const Container = styled.div`
  background: var(--color-primary-lighter);
  padding: 1rem;
`
const IconList = styled.ul`
  align-items: center;
  color: #fff;
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`
const IconItem = styled.li`
  & + & {
    margin-left: 1rem;
  }
`
const IconButton = styled.button`
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  padding: 0.25rem;
  &:hover {
    background: rgba(255, 255, 255, 0.7);
    opacity: 0.7;
  }
  &.active {
    background: rgb(215 227 255);
    box-shadow: 0 0 2px 2px rgb(0 0 0 / 18%);
  }
`
