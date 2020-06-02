import { Server } from 'miragejs'

export type Config = {
  onUrlChange?: (url: string) => void
  makeServer?: (options: { environment?: 'test' | 'development' }) => Server
}
