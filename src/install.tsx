import React from 'react'
import ReactDOM from 'react-dom'
import { DevTools } from './DevTools'

export const install = () => {
  const devToolsRoot = document.createElement('div')
  document.body.appendChild(devToolsRoot)
  ReactDOM.render(<DevTools />, devToolsRoot)
}
