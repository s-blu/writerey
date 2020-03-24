import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripFileEnding'
})
export class StripFileEndingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.replace(/\.[^\./s]+$/, '');
  }

}
