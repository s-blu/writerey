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


  onHover(event) {
    this.paragraphService.getParagraphMeta(this.document.path, this.document.name, event).subscribe(res => {
      console.log(res);
      try {
        this.notes = JSON.parse(res);
      } catch (err) {
        console.log('setting notes failed', err)
      }
    });
  }
}
