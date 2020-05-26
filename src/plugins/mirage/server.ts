import { Server } from 'miragejs'

export function makeServerDefault(options: {
  environment?: 'test' | 'development'
}) {
  const { environment = 'test' } = options || {}

  return new Server({
    environment,
  })
}

export let makeServer = makeServerDefault
let server: Server

export const setMakeServer = (
  makeServerFn: (options: { environment?: 'test' | 'development' }) => Server
) => {
  makeServer = makeServerFn
}

export const devServer = () => {
  if (server) server.shutdown()
  server = makeServer({ environment: 'development' })
  return server
}
