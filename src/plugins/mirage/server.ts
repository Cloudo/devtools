import { Server } from 'miragejs'

export function makeServer(options: { environment?: 'test' | 'development' }) {
  const { environment = 'test' } = options || {}

  return new Server({
    environment,
  })
}

let server: Server

export const devServer = () => {
  if (server) server.shutdown()
  server = makeServer({ environment: 'development' })
  return server
}
