(function (d) {
  const l = (d['oc'] = d['oc'] || {});
  l.dictionary = Object.assign(l.dictionary || {}, {
    Bold: 'Gras',
    Cancel: 'Anullar',
    Italic: 'Italica',
    'Remove color': '',
    Save: 'Enregistrar',
    Strikethrough: '',
    Underline: '',
  });
  l.getPluralForm = function (n) {
    return n > 1;
  };
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}));
