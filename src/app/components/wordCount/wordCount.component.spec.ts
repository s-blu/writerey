/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WordCountComponent } from './wordCount.component';

describe('WordCountComponent', () => {
  let component: WordCountComponent;
  let fixture: ComponentFixture<WordCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
