import { Server } from 'miragejs'

export type Spec = {
  id: string
  name: string
  group: string
  callback: (server: Server) => void
}

const specs: Spec[] = []

export const getSpecs = () => {
  return specs
}

type SpecOptions = {
  group: string
  url?: string
}
export const getSpec = (options: SpecOptions) => (
  name: string,
  callback: (server: Server) => void
) => {
  const id = [options.group, name].join('/')

  specs.push({
    id,
    ...options,
    name,
    callback,
  })
}
