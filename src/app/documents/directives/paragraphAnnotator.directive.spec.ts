/* tslint:disable:no-unused-variable */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetaDatabaseService } from 'src/app/services/meta-database.service';
import { ParagraphAnnotatorDirective } from './paragraphAnnotator.directive';

class MockMetaDatabaseService {}
@Component({
  template: `<div [wyParagraphAnnotator]="mockDocument"><p class="pMockId">Annotate me</p></div>`,
})
class TestComponent {
  mockDocument = {
    name: 'mockDoc',
    path: 'mock/path',
  };
}

describe('Directive: ParagraphAnnotator', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ParagraphAnnotatorDirective, TestComponent],
      imports: [],
      providers: [{ provide: MetaDatabaseService, useClass: MockMetaDatabaseService }],
    }).createComponent(TestComponent);

    fixture.detectChanges();
  });
  it('should create an instance', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
