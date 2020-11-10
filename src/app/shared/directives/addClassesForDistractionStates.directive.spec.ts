import { DistractionFreeStore } from 'src/app/stores/distractionFree.store';
import { Component, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { DISTRACTION_FREE_STATES } from '../models/distractionFreeStates.enum';
import { AddClassesForDistractionStatesDirective } from './addClassesForDistractionStates.directive';

class MockDistractionFreeStore {
  private readonly _distractionFreeSubject = new BehaviorSubject<DISTRACTION_FREE_STATES>(DISTRACTION_FREE_STATES.NONE);
  readonly distractionFree$ = this._distractionFreeSubject.asObservable().pipe(distinctUntilChanged());

  private get distractionFreeSubject(): any {
    return this._distractionFreeSubject.getValue();
  }

  private set distractionFreeSubject(val: any) {
    this._distractionFreeSubject.next(val);
  }

  public setDistractionFree(status: DISTRACTION_FREE_STATES) {
    this.distractionFreeSubject = status;
  }
}

@Component({
  template: `
    <p wyAddClassesForDistractionStates>Only with directive</p>
    <p class="with-custom-class" wyAddClassesForDistractionStates>With directive and custom class</p>
    <p>No directive</p>
  `,
})
class TestComponent {}

describe('Directive: AddClassesForDistractionStates', () => {
  let fixture;
  let distractionFreeStore;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [AddClassesForDistractionStatesDirective, TestComponent],
      providers: [{ provide: DistractionFreeStore, useClass: MockDistractionFreeStore }],
    }).createComponent(TestComponent);

    distractionFreeStore = TestBed.inject(DistractionFreeStore);
  });
  it('should add classes to elements if distraction free mode is half', () => {
    distractionFreeStore.setDistractionFree(DISTRACTION_FREE_STATES.HALF);
    fixture.detectChanges();
    const elements = fixture.nativeElement.querySelectorAll('p');
    expect(elements[0].classList).toContain('distraction-free-half');
    expect(elements[1].classList).toContain('distraction-free-half');
    expect(elements[2].classList).not.toContain('distraction-free-half');
  });

  it('should add classes to elements if distraction free mode is full', () => {
    distractionFreeStore.setDistractionFree(DISTRACTION_FREE_STATES.FULL);
    fixture.detectChanges();
    const elements = fixture.nativeElement.querySelectorAll('p');
    expect(elements[0].classList).toContain('distraction-free-full');
    expect(elements[1].classList).toContain('distraction-free-full');
    expect(elements[2].classList).not.toContain('distraction-free-full');
  });

  it('should not add any classes to elements if distraction free mode is none', () => {
    distractionFreeStore.setDistractionFree(DISTRACTION_FREE_STATES.NONE);
    fixture.detectChanges();
    const elements = fixture.nativeElement.querySelectorAll('p');
    expect(elements[0].classList.length).toEqual(0);
    expect(elements[1].classList.length).toEqual(1);
    expect(elements[2].classList.length).toEqual(0);
  });
});
