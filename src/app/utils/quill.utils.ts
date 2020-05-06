export default class QuillUtils {
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

export const quillWyStyles = {
  'font-family': 'Roboto, "Helvetica Neue", sans-serif',
  'font-size': '14px',
  'min-height': '7em',
};

export const quillWyNotesModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'code-block', 'link', 'image'],
    ['clean'],
  ],
};
