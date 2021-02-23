import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { WyCkeditorModule } from '@writerey/ckeditor/wyCkeditor.module';
import { ExplorerModule } from '@writerey/explorer/explorer.module';
import { SharedModule } from '@writerey/shared/shared.module';
import { ChooseFileForLinkDialogComponent } from './components/chooseFileForLinkDialog/chooseFileForLinkDialog.component';
import { CreateNewLinkComponent } from './components/createNewLink/createNewLink.component';
import { CreateNewNotesItemComponent } from './components/createNewNotesItem/createNewNotesItem.component';
import { DocumentLinkComponent } from './components/documentLink/documentLink.component';
import { NoteComponent } from './components/note/note.component';
import { NoteItemColorChooserComponent } from './components/noteItemColorChooser/noteItemColorChooser.component';
import { NotesItemComponent } from './components/notesItem/notesItem.component';
import { ParagraphNoteCounterComponent } from './components/paragraphNoteCounter/paragraphNoteCounter.component';
import { UpsertNoteComponent } from './components/upsertNote/upsertNote.component';
import { NoteItemsComponent } from './noteItems.component';

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
    ParagraphNoteCounterComponent,
  ],
  exports: [NoteItemsComponent, ParagraphNoteCounterComponent],
})
export class NoteItemsModule {}
