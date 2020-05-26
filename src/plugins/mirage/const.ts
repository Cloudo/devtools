import { createLocalStorageStateHook } from 'use-local-storage-state'

export const useDevSpec = createLocalStorageStateHook<string>(
  'devtools-spec',
  'app'
)
