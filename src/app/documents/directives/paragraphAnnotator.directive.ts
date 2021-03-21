import { Directive, Input, OnInit, Renderer2 } from '@angular/core';
import { MetaDatabaseService } from './../../services/meta-database.service';

@Directive({
  selector: '[wyParagraphAnnotator]',
})
export class ParagraphAnnotatorDirective implements OnInit {
  @Input('wyParagraphAnnotator') document;

  constructor(private renderer: Renderer2, private metaDb: MetaDatabaseService) {}

  ngOnInit() {
    this.annotateParagraphs();
  }

  async annotateParagraphs() {
    console.log('annotateParagraph', this.document);
    const paragraphMetaInfo = await this.metaDb.getParagraphMetaForDocument(this.document?.path, this.document?.name);
    console.log('annotateParagraph paragraphMetaInfo', paragraphMetaInfo);
    const container = document.querySelector('#ckeditor-container');

    paragraphMetaInfo.forEach(meta => {
      const paragraphObj = container.querySelector(`p.${meta.pId}`); // document.querySelector(`p.${meta.pId}`);
      const annotator = document.createElement('p'); // this.renderer.createElement('p');

      annotator.textContent = meta.pNoteCount + 'HALLO HIER BIN ICH';
      annotator.className = `p-annotator annotator-${meta.pId}`;
      // this.renderer.setProperty(annotator, 'style', `color: red;background-color: grey;`);
      console.log(paragraphObj, annotator);
      // Append the created div to the body element
      container.insertBefore(annotator, paragraphObj);
      console.log(container);
    });
  }
}
