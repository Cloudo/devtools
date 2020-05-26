import { install } from './install'
import { load } from './load'
export { getSpec } from './plugins/mirage/spec'

export { useDevSpec } from './plugins/mirage/const'
export { setMakeServer } from './plugins/mirage/server'

export default { load, install }
