export function sanitizeName(name) {
  if (!name) return '';
  name = name.trim();
  return name.replace(/([/\\<>\*\?:\'"])/g, '_');
}

export function ensureFileEnding(filename) {
  if (!/\.html$/.test(name)) filename += '.html';
  return filename;
}
