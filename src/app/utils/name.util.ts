export function sanitizeName(name) {
  if (!name) return '';
  name = name.trim();
  return name.replace(/([/\\<>\*\?:\'"])/g, '_');
}
