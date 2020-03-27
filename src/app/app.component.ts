import { DocumentService } from './services/document.service';
import { ParagraphService } from './services/paragraph.service';
import { Component } from '@angular/core';
import { DocumentDefinition } from './interfaces/documentDefinition.interface';
import { Note } from './interfaces/note.interface';
import { FileInfo } from './interfaces/fileInfo.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'writerey';
  // TODO get last opened document (local storage?)
  fileInfo: FileInfo = { path: 'dummy/path/', name: 'DummyFile.html' };
  document: DocumentDefinition;
  documentContent: { content: string };
  isLoading = false;
  notes: Array<Note>;

  constructor(
    private paragraphService: ParagraphService,
    private documentService: DocumentService
  ) { }


  changeDoc(event: FileInfo) {
    console.log('change doc event received', event)
    this.fileInfo = event;
    this.isLoading = true;
    this.documentService.getDocument(event.path, event.name)
      .subscribe((res) => {
        this.isLoading = false;
        this.documentContent = { content: res.content };
        delete res.content;
        this.document = res;
        console.log('last edited is', res.last_edited);
      });
  }

  onHover(event) {
    this.paragraphService.getParagraphMeta(this.fileInfo.path, this.fileInfo.name, event, 'notes').subscribe(res => {
      try {
        console.log('on hover app', res)
        if (res && res.length) {
          this.notes = res;
        }
      } catch (err) {
        console.log('getting notes failed', err)
      }
    });
  }
}
