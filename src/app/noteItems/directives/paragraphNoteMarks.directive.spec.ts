import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DocumentModeStore } from './../../stores/documentMode.store';
import { ParagraphNoteMarksDirective } from './paragraphNoteMarks.directive';

class MockDocumentModeStore {
  mode$ = of({});
}

class MockApiService {
  getParagraphCountRoute(name) {
    return 'getParagraphCountRoute/mock/call/' + name;
  }
}
@Component({
  template: `<p [wyParagraphNoteMarks]="mockDocument" class="pMockId">Annotate me</p>`,
})
class TestComponent {
  mockDocument = {
    name: 'mockDoc',
    path: 'mock/path',
  };
}

describe('Directive: ParagraphNoteMarks', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ParagraphNoteMarksDirective, TestComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiService, useClass: MockApiService },
        { provide: DocumentModeStore, useClass: MockDocumentModeStore },
      ],
    }).createComponent(TestComponent);

    fixture.detectChanges();
  });
  it('should create an instance', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
