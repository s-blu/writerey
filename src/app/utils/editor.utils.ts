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