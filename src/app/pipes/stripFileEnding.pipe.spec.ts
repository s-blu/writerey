/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { StripFileEndingPipe } from './stripFileEnding.pipe';

fdescribe('Pipe: StripFileEndinge', () => {
  it('create an instance', () => {
    let pipe = new StripFileEndingPipe();
    expect(pipe).toBeTruthy();
  });

  it('should strip everything after and including the last .', () => {
    let pipe = new StripFileEndingPipe();

    expect(pipe.transform('index.html')).toEqual('index');
    expect(pipe.transform('file.with.multiple.dots.html')).toEqual('file.with.multiple.dots');
    expect(pipe.transform('file_with_scores.txt')).toEqual('file_with_scores');
    expect(pipe.transform('anotherEnding.imal')).toEqual('anotherEnding');
  });

  it('should return value as-is if there is no dot in there', () => {
    let pipe = new StripFileEndingPipe();

    expect(pipe.transform('file_without_dot')).toEqual('file_without_dot');
    expect(pipe.transform('')).toEqual('');
  });
});
