import { Server } from 'miragejs'

type Config = {
  makeServer?: (options: { environment?: 'test' | 'development' }) => Server
  onUrlChange?: (url: string) => void
}

let config: Config = {}

export const getConfig = () => config

export const setConfig = (nextConfig: Partial<Config>) => {
  Object.assign(config, nextConfig)
}
