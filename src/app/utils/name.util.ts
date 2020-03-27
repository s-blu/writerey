export function sanitizeName(name) {
  return name.replace(/([/\\<>\*\?:\'"])/g, '_')
}