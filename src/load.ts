export function load(callback: () => void) {
  const explicitlyEnabled =
    window.location.search.includes('dev-tools=true') ||
    window.localStorage.getItem('dev-tools') === 'true'

  if (process.env.NODE_ENV === 'development' && explicitlyEnabled) {
    import('./install')
      .then((devTools) => devTools.install())
      .finally(callback)
  } else {
    callback()
  }
}
