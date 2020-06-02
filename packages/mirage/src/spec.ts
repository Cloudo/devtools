import { Server } from 'miragejs'

type SpecOptions = {
  group: string
  url?: string
}

export type Spec = {
  id: string
  name: string
  callback: (server: Server) => void
} & SpecOptions

const specs: Spec[] = []

export const getSpecs = () => {
  return specs
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
