// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export function sanitizeName(name) {
  if (!name) return '';
  name = name.trim();
  return name.replace(/([/\\<>\*\?:\'"])/g, '_');
}

export function ensureFileEnding(filename) {
  if (!/\.html$/.test(name)) filename += '.html';
  return filename;
}
