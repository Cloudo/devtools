import { createLocalStorageStateHook } from 'use-local-storage-state'

export type DevToolsPosition = 'left' | 'bottom'
export type DevtoolsConfig = {
  tabIndex: number
  isOpen: boolean
  position: DevToolsPosition
}

const useDevToolsStorage = createLocalStorageStateHook<DevtoolsConfig>(
  'devtools-config',
  {
    tabIndex: 0,
    isOpen: false,
    position: 'bottom',
  }
)

export const useDevToolsConfig = () => {
  const [config, setConfig] = useDevToolsStorage()

  return {
    ...config,
    setTabIndex: (tabIndex: number) => setConfig({ ...config, tabIndex }),
    setIsOpen: (isOpen: boolean) => setConfig({ ...config, isOpen }),
    setPosition: (position: DevToolsPosition) =>
      setConfig({ ...config, position }),
  }
}
