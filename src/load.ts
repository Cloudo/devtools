export function load(callback: () => void) {
  if (typeof window === 'undefined') {
    callback()
    return
  }

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
