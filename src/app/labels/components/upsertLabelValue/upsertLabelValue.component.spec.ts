/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { UpsertLabelValueComponent } from './upsertLabelValue.component';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { TranslocoRootModule } from '../../../transloco-root.module';
import { translate, TranslocoModule } from '@ngneat/transloco';

describe('UpsertLabelValueComponent', () => {
  let component: UpsertLabelValueComponent;
  let fixture: ComponentFixture<UpsertLabelValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoRootModule, getTranslocoTestingModule(), TranslocoModule],
      declarations: [UpsertLabelValueComponent],
      //providers: [{provide: translate, useValue: translate}],
      providers: [translate],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertLabelValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
