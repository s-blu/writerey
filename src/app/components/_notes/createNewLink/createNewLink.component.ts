import { ProjectStore } from './../../../stores/project.store';
import { LinkService } from './../../../services/link.service';
import { ChooseFileForLinkDialogComponent } from './../chooseFileForLinkDialog/chooseFileForLinkDialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, take, flatMap } from 'rxjs/operators';
import { Link } from 'src/app/models/notesItems.interface';

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
  selectedDocument;
  project;
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
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private linkService: LinkService,
    private projectStore: ProjectStore
  ) {
    this.createNewForm = this.formBuilder.group({
      context: this.contexts[0] || null,
      linkId: [null, [Validators.required]],
      text: ' \n',
    });
  }

  ngOnChanges() {
    this.createNewForm.patchValue({ context: this.contexts[0] });
  }

  ngOnInit() {
    this.subscription.add(this.projectStore.project$.pipe(take(1)).subscribe(res => (this.project = res)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(data) {
    this.linkCreated.emit(data);
    this.createNewForm.patchValue({ text: '', linkId: null });
  }

  getCurrentLength(event) {
    this.currentLength = event?.text?.length || '?';
  }

  chooseDocument() {
    const dialogRef = this.dialog.open(ChooseFileForLinkDialogComponent);

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(
          flatMap(node => {
            return this.linkService.getLinkForDocument(node.name, node.path, this.project);
          })
        )
        .subscribe((link: Link) => {
          if (!link) return;
          console.log('got link obj in createNewLink', link);
          this.selectedDocument = link;
          this.createNewForm.patchValue({ linkId: link.linkId });
        })
    );
  }
}
