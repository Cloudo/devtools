import { Server } from 'miragejs'

export type Spec = {
  id: string
  name: string
  group: string
  callback: (server: Server) => void
}

const specs: Spec[] = []

export const getSpecs = () => {
  console.log('specs', specs)
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
  console.log('add spec', id)

  specs.push({
    id,
    ...options,
    name,
    callback,
  })
}
