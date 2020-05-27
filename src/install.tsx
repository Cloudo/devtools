import React from 'react'
import ReactDOM from 'react-dom'

import {
  Button,
  ThemeProvider,
  theme,
  CSSReset,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
} from '@chakra-ui/core'
import { useMirageDevTools, MirageToogle } from './plugins/mirage'
import { useDevToolsOpen } from './plugins/mirage/const'

function install() {
  function DevTools() {
    const [isOpen, setIsOpen] = useDevToolsOpen()

    const devTools = useMirageDevTools()
    return (
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Box
          position="fixed"
          bottom="0"
          right="0"
          zIndex={9990}
          width="100%"
          height="500px"
          mb={isOpen ? 0 : '-500px'}
          boxShadow="0 0 20px rgba(0,0,0,.3)"
          transition="all 0.3s"
          bg="gray.50"
        >
          <Tabs>
            <TabList>
              <Tab>mirage</Tab>
              <Tab>cypress</Tab>
            </TabList>

            <TabPanels p={4}>
              <TabPanel>
                <MirageToogle {...devTools} />
              </TabPanel>
              <TabPanel>
                <p>cypress!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          position="fixed"
          bottom={0}
          right={0}
          padding={4}
          margin={2}
          height="40px"
          width="40px"
          transition="all 0.3s"
          zIndex={9999}
        >
          🛠
        </Button>
      </ThemeProvider>
    )
  }

  const devToolsRoot = document.createElement('div')
  document.body.appendChild(devToolsRoot)
  ReactDOM.render(<DevTools />, devToolsRoot)
}

export { install }
