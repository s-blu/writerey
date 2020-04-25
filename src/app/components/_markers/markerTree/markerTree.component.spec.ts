/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MarkerTreeComponent } from './markerTree.component';

describe('MarkerTreeComponent', () => {
  let component: MarkerTreeComponent;
  let fixture: ComponentFixture<MarkerTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarkerTreeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
