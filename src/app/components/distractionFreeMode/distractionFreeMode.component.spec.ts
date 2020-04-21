/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DistractionFreeModeComponent } from './distractionFreeMode.component';

describe('DistractionFreeModeComponent', () => {
  let component: DistractionFreeModeComponent;
  let fixture: ComponentFixture<DistractionFreeModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistractionFreeModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistractionFreeModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
