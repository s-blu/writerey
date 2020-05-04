/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LabelTreeComponent } from './labelTree.component';

describe('LabelTreeComponent', () => {
  let component: LabelTreeComponent;
  let fixture: ComponentFixture<LabelTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelTreeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
