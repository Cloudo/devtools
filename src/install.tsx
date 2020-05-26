import React from 'react'
import ReactDOM from 'react-dom'

import {
  Button,
  ThemeProvider,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  theme,
  CSSReset,
} from '@chakra-ui/core'
import styled from '@emotion/styled'
import { useMirageDevTools, MirageToogle } from './plugins/mirage'

const DevToolsButton = styled(Button)`
  /* z-index: 9999; */
  position: fixed;
  top: 80px;
  left: 0;
  background: white;
  color: black;
  padding: 20px;
  margin: 10px;
  height: 60px;
  width: 60px;
  transition: all 0.3s;
`

function install() {
  function DevTools() {
    const { isOpen, onClose, onToggle } = useDisclosure()
    const devTools = useMirageDevTools()
    return (
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerContent w="30vw">
            <DrawerCloseButton />
            <DrawerHeader>🛠 Dev tools 🛠</DrawerHeader>

            <DrawerBody>
              <MirageToogle {...devTools} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <DevToolsButton onClick={onToggle} variant="outline">
          🛠
        </DevToolsButton>
      </ThemeProvider>
    )
  }

  const devToolsRoot = document.createElement('div')
  document.body.appendChild(devToolsRoot)
  ReactDOM.render(<DevTools />, devToolsRoot)
}

export { install }
