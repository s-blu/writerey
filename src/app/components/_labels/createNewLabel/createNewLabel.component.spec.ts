/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateNewLabelComponent } from './createNewLabel.component';

describe('CreateNewLabelComponent', () => {
  let component: CreateNewLabelComponent;
  let fixture: ComponentFixture<CreateNewLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewLabelComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
