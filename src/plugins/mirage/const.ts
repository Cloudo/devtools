import { createLocalStorageStateHook } from 'use-local-storage-state'

export const useDevSpec = createLocalStorageStateHook<string>(
  'devtools-spec',
  'app'
)

export const useDevToolsOpen = createLocalStorageStateHook<boolean>(
  'devtools-open',
  false
)
