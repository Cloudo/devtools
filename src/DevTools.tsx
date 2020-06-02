import React, { ReactNode } from 'react'

import {
  Flex,
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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/core'
import { useDevToolsConfig } from './const'

const DevToolsWrapper = (props: {
  isOpen: boolean
  position: 'left' | 'bottom'
  children: ReactNode
}) => {
  const { isOpen, children, position } = props

  let positionProps = {}

  if (position === 'bottom') {
    positionProps = {
      width: '100%',
      height: '30vh',
      mb: isOpen ? 0 : '-30vh',
    }
  } else if (position === 'left') {
    positionProps = {
      width: '400px',
      height: '100%',
      ml: isOpen ? 0 : '-400px',
      left: 0,
    }
  }

  return (
    <Box
      position="fixed"
      bottom="0"
      zIndex={9990}
      boxShadow="0 0 20px rgba(0,0,0,.3)"
      transition="all 0.3s"
      bg="gray.50"
      data-devtools
      {...positionProps}
    >
      {children}
    </Box>
  )
}

export const DevTools = ({
  plugins = [],
}: {
  plugins?: Array<{ name: string; component: ReactNode }>
}) => {
  const {
    isOpen,
    setIsOpen,
    tabIndex,
    setTabIndex,
    position,
    setPosition,
  } = useDevToolsConfig()

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <DevToolsWrapper isOpen={isOpen} position={position}>
        <Tabs index={tabIndex} onChange={setTabIndex}>
          <TabList>
            {plugins.map((plugin, index) => (
              <Tab key={index}>{plugin.name}</Tab>
            ))}

            <Flex flex={1} />

            <Menu>
              {/*  
                // @ts-ignore */}
              <MenuButton as={IconButton} icon="settings" />

              <MenuList>
                <MenuOptionGroup
                  defaultValue={position}
                  type="radio"
                  onChange={(position: any) => setPosition(position)}
                >
                  <MenuItemOption value="left"> Dock to left</MenuItemOption>
                  <MenuItemOption value="bottom">Dock to bottom</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </TabList>

          <TabPanels p={4}>
            {plugins.map((plugin, index) => (
              <TabPanel key={index}>{plugin.component}</TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </DevToolsWrapper>

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
