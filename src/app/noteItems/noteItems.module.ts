import { NoteItemColorChooserComponent } from './components/noteItemColorChooser/noteItemColorChooser.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WyCkeditorModule } from '@writerey/ckeditor/wyCkeditor.module';
import { SharedModule } from '@writerey/shared/shared.module';
import { ChooseFileForLinkDialogComponent } from './components/chooseFileForLinkDialog/chooseFileForLinkDialog.component';
import { ExplorerModule } from '@writerey/explorer/explorer.module';
import { MatButtonModule } from '@angular/material/button';
import { DocumentLinkComponent } from './components/documentLink/documentLink.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateNewLinkComponent } from './components/createNewLink/createNewLink.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpsertNoteComponent } from './components/upsertNote/upsertNote.component';
import { CreateNewNotesItemComponent } from './components/createNewNotesItem/createNewNotesItem.component';
import { NotesItemComponent } from './components/notesItem/notesItem.component';
import { NoteComponent } from './components/note/note.component';
import { NoteItemsComponent } from './noteItems.component';
import { MatExpansionModule } from '@angular/material/expansion';

const materialModules = [
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatSelectModule,
  MatInputModule,
  MatExpansionModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    WyCkeditorModule,
    CKEditorModule,
    ExplorerModule,
    ReactiveFormsModule,
    ...materialModules,
  ],
  declarations: [
    CreateNewNotesItemComponent,
    DocumentLinkComponent,
    ChooseFileForLinkDialogComponent,
    CreateNewLinkComponent,
    UpsertNoteComponent,
    NotesItemComponent,
    NoteComponent,
    NoteItemsComponent,
    NoteItemColorChooserComponent,
  ],
  exports: [NoteItemsComponent],
})
export class NoteItemsModule {}
