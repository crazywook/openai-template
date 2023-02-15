export function checkOnlyEnter (e: React.KeyboardEvent) {
  return e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey
}
export function checkEnter (e: React.KeyboardEvent) {
  return e.key === 'Enter'
}
