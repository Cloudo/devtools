import { getSpec } from '../../packages/mirage/dist'

const spec = getSpec({
  group: 'github reppos',
})

spec('normal', (server) => {
  server.get('https://api.github.com/users/Cloudo/repos', () => [
    {
      id: 53617392,
      name: 'redux',
      html_url: 'https://github.com/Cloudo/redux',
      description: 'redux fake description',
      stargazers_count: 666,
    },
  ])
})
