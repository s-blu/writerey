import { ChooseFileForLinkDialogComponent } from './../chooseFileForLinkDialog/chooseFileForLinkDialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReturnStatement } from '@angular/compiler';
import { DocumentService } from 'src/app/services/document.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'wy-create-new-link',
  templateUrl: './createNewLink.component.html',
  styleUrls: ['./createNewLink.component.scss'],
})
export class CreateNewLinkComponent implements OnInit, OnChanges, OnDestroy {
  @Input() contexts: Array<string> = [];
  @Input() contextNames: any = {};
  @Output() linkCreated = new EventEmitter<any>();

  createNewForm;
  link;
  maxLength = 100;
  currentLength = 0;
  quillConfig = {
    modules: {
      toolbar: [['bold', 'italic', 'underline', 'strike'], ['link']],
    },
    styles: {
      'font-family': 'Roboto, "Helvetica Neue", sans-serif',
      'font-size': '14px',
    },
  };
  private subscription = new Subscription();
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog, private documentService: DocumentService) {
    this.createNewForm = this.formBuilder.group({
      context: this.contexts[0] || null,
      text: ' \n',
    });
  }

  ngOnChanges() {
    this.createNewForm.patchValue({ context: this.contexts[0] });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(data) {
    this.linkCreated.emit(data);
    this.createNewForm.patchValue({ text: '' });
  }

  getCurrentLength(event) {
    this.currentLength = event?.text?.length || '?';
  }

  chooseDocument() {
    const dialogRef = this.dialog.open(ChooseFileForLinkDialogComponent);

    this.subscription.add(
      dialogRef.afterClosed()
      .pipe(map(node => {
        return this.documentService.generateLinkForDocument(node);
      }))
      .subscribe(link => {
        if (!link) return;
        this.link = link; 
        console.log('got a link back', link);
      })
    );
  }
}
