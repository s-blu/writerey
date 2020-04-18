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
