import { Server } from 'miragejs'
import { getConfig } from '../../config'

export function makeServerDefault(options: {
  environment?: 'test' | 'development'
}) {
  const { environment = 'test' } = options || {}

  return new Server({
    environment,
  })
}

let server: Server

export const devServer = () => {
  const { makeServer = makeServerDefault } = getConfig()
  if (server) server.shutdown()
  server = makeServer({ environment: 'development' })
  return server
}
