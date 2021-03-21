import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { DOC_MODES } from '@writerey/shared/models/docModes.enum';
import { Subscription } from 'rxjs';
import { LabelStore } from 'src/app/stores/label.store';
import { MetaDatabaseService, ParagraphMetaEntry } from './../../services/meta-database.service';
import { DocumentModeStore } from './../../stores/documentMode.store';

@Directive({
  selector: '[wyParagraphAnnotator]',
})
export class ParagraphAnnotatorDirective implements OnInit, OnDestroy {
  @Input('wyParagraphAnnotator') document;

  private stylesheet;
  private styleElement;
  private mode;
  private paragraphMeta;
  private labelDefinitions;
  private subscription = new Subscription();

  constructor(
    private metaDb: MetaDatabaseService,
    private documentModeStore: DocumentModeStore,
    private labelStore: LabelStore
  ) {}

  async ngOnInit() {
    this.createStylesheet();
    this.annotateParagraphs();

    this.subscription.add(
      this.documentModeStore.mode$.subscribe(async newMode => {
        if (this.mode === newMode) return;

        if (newMode === DOC_MODES.READ) {
          this.clearStyles();
        } else if (this.mode === DOC_MODES.REVIEW) {
          await this.getParagraphMeta();
          this.annotateParagraphs();
        } else if (this.mode === DOC_MODES.READ) {
          this.annotateParagraphs();
        }

        this.mode = newMode;
      })
    );

    this.subscription.add(
      this.labelStore.labelDefinitions$.subscribe(labelDefs => {
        this.labelDefinitions = labelDefs;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async getParagraphMeta() {
    const pMeta = await this.metaDb.getParagraphMetaForDocument(this.document?.path, this.document?.name);
    this.paragraphMeta = pMeta;
  }

  async annotateParagraphs() {
    if (!this.paragraphMeta) await this.getParagraphMeta();
    this.clearStyles();
    this.paragraphMeta.forEach((meta: ParagraphMetaEntry) => {
      if (meta.pNoteCount > 0) {
        this.addNoteCountPseudoElement(meta);
      }

      if (meta.labels) {
        this.addLabelStyles(meta);
      }
    });
  }

  private addLabelStyles(meta: ParagraphMetaEntry) {
    const labelInfo = meta.labels.reduce((acc, label, index) => {
      const currentLabel = this.getHumanReadableLabel(label);
      if (index === 0) return `${currentLabel}`;

      return `${acc} | ${currentLabel}`;
    }, '');

    let rule = `p.${meta.pId}::before {
      content: "${labelInfo}";
      position: absolute;
      color: rgb(136, 180, 219);
      font-family: Ubuntu, sans-serif;
      top: -1.5em;
      left: 0;
      font-size: 7pt;
    }`;
    this.stylesheet.insertRule(rule);

    // display labels only on first paragraph with id
    rule = `p.${meta.pId} ~ p.${meta.pId}::before {
          position: inherit;
          display: none;
          content: '';
        }`;
    this.stylesheet.insertRule(rule);
  }

  private getHumanReadableLabel(label) {
    const labelDef = this.labelDefinitions.find(m => m.id === label.id);
    if (labelDef) {
      const value = labelDef.values.find(val => val.id === label.valueId);
      return `[${labelDef.name}] ${value?.name}`;
    } else {
      return '';
    }
  }

  private addNoteCountPseudoElement(meta: ParagraphMetaEntry) {
    let rule = `p.${meta.pId}::after {
      height: 14px;
      width: 14px;
      background-color: rgb(136, 180, 219);
      border-radius: 3px;
      content: "${meta.pNoteCount}";
      display: flex;
      position: absolute;
      font-family: Ubuntu, sans-serif;
      color: white;
      font-size: 8pt;
      top: -12px;
      right: -7px;
      justify-content: center;
      align-items: center;
    }`;
    this.stylesheet.insertRule(rule);

    rule = `p.${meta.pId} {
      position: relative;
    }`;
    this.stylesheet.insertRule(rule);

    // display badge only on first paragraph with id
    rule = `p.${meta.pId} ~ p.${meta.pId}::after {
      position: inherit;
      display: none;
      content: '';
    }`;
    this.stylesheet.insertRule(rule);
  }

  clearStyles() {
    document.head.removeChild(this.styleElement);
    this.createStylesheet();
  }

  private createStylesheet() {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    this.stylesheet = style.sheet;
    this.styleElement = style;
  }
}
