/**
 * Copyright (c) 2021 s-blu
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoTestingModule } from 'src/app/transloco-test.module';
import { NoteItemColorChooserComponent } from './noteItemColorChooser.component';

describe('NoteItemColorChooserComponent', () => {
  let component: NoteItemColorChooserComponent;
  let fixture: ComponentFixture<NoteItemColorChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoTestingModule()],
      declarations: [NoteItemColorChooserComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteItemColorChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a square for every configured color and one default', () => {
    const colorSquares = fixture.nativeElement.querySelectorAll('.color-square');
    expect(colorSquares?.length).toEqual(component.colors.length + 1);
  });

  it('should reset color when clicking reset square', () => {
    const changeColorSpy = spyOn(component, 'changeColor');
    const colorSquare = fixture.nativeElement.querySelector('.color-square.default');
    expect(colorSquare).not.toBe(null);
    colorSquare.click();
    expect(changeColorSpy).toHaveBeenCalledWith(null);
  });

  it('should mark initial color as active', () => {
    component.initialColor = component.colors[2];
    fixture.detectChanges();
    // get third (index + 1), the first one is the reset square
    const colorSquare = fixture.nativeElement.querySelectorAll('.color-square').item(3);
    expect(colorSquare).not.toBeUndefined();
    expect(colorSquare.className).toMatch('active');
  });

  it('should emit event when and only when color is changed', () => {
    const emitSpy = spyOn(component.colorChanged, 'emit');
    component.initialColor = component.colors[4];
    component.changeColor(component.colors[4]);
    expect(emitSpy).not.toHaveBeenCalled();
    component.changeColor(component.colors[0]);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenLastCalledWith(component.colors[0]);
    component.changeColor(component.colors[0]);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    component.changeColor(null);
    expect(emitSpy).toHaveBeenCalledTimes(2);
    expect(emitSpy).toHaveBeenLastCalledWith(null);
  });
});
