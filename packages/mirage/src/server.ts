import { Server } from 'miragejs'
import { Config } from './types'

export function makeServerDefault(options: {
  environment?: 'test' | 'development'
}) {
  const { environment = 'test' } = options || {}

  return new Server({
    environment,
  })
}

let server: Server

export const devServer = (config?: Config) => {
  const { makeServer = makeServerDefault } = config || {}
  if (server) server.shutdown()
  server = makeServer({ environment: 'development' })
  return server
}
