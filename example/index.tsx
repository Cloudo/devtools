import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useQuery, ReactQueryConfigProvider } from 'react-query'
import DevTools from '../dist'
import MirageDevTools, { useDevSpec } from '../packages/mirage/dist'
import CypressRecorder from '../packages/cypress-recorder/dist'
import { FormExample } from './FormExample'
import './devtools'

const fetchRepos = () => {
  return fetch(`https://api.github.com/users/Cloudo/repos`).then((res) =>
    res.json()
  )
}

const Repos = () => {
  const reposRequest = useQuery('repos', fetchRepos)

  if (reposRequest.isFetching) return <>Loading...</>

  const repos = reposRequest.data || []

  return (
    <ul style={{ margin: '30px 50px' }}>
      {repos.map((repo) => (
        <li key={repo.id}>
          <a href={repo.html_url} title={repo.description}>
            {repo.name} ({repo.stargazers_count} ⭐)
          </a>
        </li>
      ))}
    </ul>
  )
}

const queryConfig = {
  refetchAllOnWindowFocus: false,
}

const plugins = [
  { name: 'MirageJs', component: <MirageDevTools /> },
  { name: 'Cypress recorder', component: <CypressRecorder /> },
]

const App = () => {
  const [specName] = useDevSpec()
  const appKey = specName || 'app'

  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <div key={appKey}>
        <Repos />

        <FormExample />

        <DevTools plugins={plugins} />
      </div>
    </ReactQueryConfigProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
