import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { editorWyNotesModules } from '@writerey/shared/utils/editor.utils';
import * as DecoupledEditor from 'src/assets/ckeditor5/build/ckeditor';
@Component({
  selector: 'wy-upsert-label-value',
  templateUrl: './upsertLabelValue.component.html',
  styleUrls: ['./upsertLabelValue.component.scss'],
})
export class UpsertLabelValueComponent implements OnInit {
  @Input() parentForm;

  @Output() valueRemoved = new EventEmitter();

  @ViewChild('toolbar') toolbarElement;

  Editor = DecoupledEditor;
  editorConfig;

  private editorInstance;
  private visibleClass = 'visible';
  private initialToolbarClasses = '';

  constructor(private translocoService: TranslocoService) {}

  ngOnInit() {
    this.editorConfig = {
      ...editorWyNotesModules,
      placeholder: this.translocoService.translate('labelDetails.labelInfoPlaceholder'),
    };
  }

  removeValue() {
    this.valueRemoved.emit();
  }

  focus() {
    this.toolbarElement.nativeElement.appendChild(this.editorInstance.ui.view.toolbar.element);
    if (this.toolbarElement.nativeElement.className.indexOf(this.visibleClass) === -1) {
      this.toolbarElement.nativeElement.className = this.initialToolbarClasses + ' ' + this.visibleClass;
    }
  }

  blur() {
    this.toolbarElement.nativeElement.className = this.initialToolbarClasses;
  }

  onReady(editor) {
    this.editorInstance = editor;
    this.initialToolbarClasses = this.toolbarElement.nativeElement.className;
  }
}
