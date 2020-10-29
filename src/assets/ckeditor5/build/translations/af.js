(function (d) {
  const l = (d['af'] = d['af'] || {});
  l.dictionary = Object.assign(l.dictionary || {}, {
    'Align center': 'Belyn in die middel',
    'Align left': 'Belyn links',
    'Align right': 'Belyn regs',
    'Block quote': 'Blok-aanhaling',
    Bold: 'Vetgedruk',
    Cancel: 'Kanselleer',
    Italic: 'Skuinsgedruk',
    Justify: 'Belyn beide kante',
    'Remove color': '',
    'Remove Format': 'Verwyder formatering',
    Save: 'Berg',
    Strikethrough: 'Deurgetrek',
    'Text alignment': 'Teksbelyning',
    'Text alignment toolbar': '',
    Underline: 'Onderstreep',
  });
  l.getPluralForm = function (n) {
    return n != 1;
  };
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}));
