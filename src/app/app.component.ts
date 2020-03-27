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
  document: FileInfo = { path: 'dummy/path/', name: 'DummyFile.html' };
  notes: Array<Note>;

  constructor(
    private paragraphService: ParagraphService
  ) { }


  changeDoc(event: FileInfo) {
    this.document = event;
  }

  onHover(event) {
    this.paragraphService.getParagraphMeta(this.document.path, this.document.name, event, 'notes').subscribe(res => {
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
