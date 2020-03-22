import { ParagraphService } from './services/paragraph.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { DocumentDefinition } from './interfaces/DocumentDefinition';
import { Note } from './interfaces/note.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'writerey';
  document: DocumentDefinition = { path: 'dummy/path/', name: 'DummyFile.html' };
  notes: Array<Note>;

  constructor(
    private http: HttpClient,
    private paragraphService: ParagraphService
  ) { }


  changeDoc(event) {
    console.log('ooommmgggg!!!');
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
