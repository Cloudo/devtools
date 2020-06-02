import { createLocalStorageStateHook } from 'use-local-storage-state'

export type DevtoolsConfig = {
  spec: string
}

const useDevToolsStorage = createLocalStorageStateHook<DevtoolsConfig>(
  'devtools-config-mirage',
  {
    spec: 'app',
  }
)

export const useDevToolsConfig = () => {
  const [config, setConfig] = useDevToolsStorage()

  return {
    ...config,
    setSpec: (spec: string) => setConfig({ ...config, spec }),
  }
}

export const useDevSpec = () => {
  const devTools = useDevToolsConfig()
  return [devTools.spec, devTools.setSpec] as const
}
