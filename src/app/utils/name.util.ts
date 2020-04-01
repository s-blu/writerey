export function sanitizeName(name) {
  if (!name) return '';
  return name.replace(/([/\\<>\*\?:\'"])/g, '_');
}
