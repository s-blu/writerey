// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export default class EditorUtils {
  static calculateWordCount(text: string) {
    if (!text) return 0;
    try {
      text = text.trim();
      return text.split(/\s+/).length;
    } catch (err) {
      console.error('Not able to calculate word count, returning 0', err);
      return 0;
    }
  }
}

export const editorWyNotesModules = {
  toolbar: [
    'alignment',
    '|',
    'bold',
    'italic',
    'strikethrough',
    'underline',
    '|',
    'link',
    'numberedList',
    'bulletedList',
    '|',
    'fontColor',
    'fontBackgroundColor',
    'insertTable',
  ],
};

export function setDecoupledToolbar(editor) {
  editor.ui
    .getEditableElement()
    .parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement());
}
