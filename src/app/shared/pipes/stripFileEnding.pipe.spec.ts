// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { StripFileEndingPipe } from './stripFileEnding.pipe';

describe('Pipe: StripFileEndinge', () => {
  it('create an instance', () => {
    let pipe = new StripFileEndingPipe();
    expect(pipe).toBeTruthy();
  });

  it('should strip everything after and including the last dot', () => {
    const pipe = new StripFileEndingPipe();

    expect(pipe.transform('index.html')).toEqual('index');
    expect(pipe.transform('file.with.multiple.dots.html')).toEqual('file.with.multiple.dots');
    expect(pipe.transform('file_with_scores.txt')).toEqual('file_with_scores');
    expect(pipe.transform('anotherEnding.imal')).toEqual('anotherEnding');
  });

  it('should return value as-is if there is no dot in there', () => {
    const pipe = new StripFileEndingPipe();

    expect(pipe.transform('file_without_dot')).toEqual('file_without_dot');
    expect(pipe.transform('')).toEqual('');
  });

  it('should return empty string on invalid input', () => {
    const pipe = new StripFileEndingPipe();

    expect(pipe.transform(null)).toEqual('');
    expect(pipe.transform(undefined)).toEqual('');
    expect(pipe.transform(0)).toEqual('');
    expect(pipe.transform(123)).toEqual('');
  });
});
