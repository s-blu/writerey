import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripFileEnding'
})
export class StripFileEndingPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log('pipe', value)
    return value.replace(/\.[^\./s]+$/, '');
  }

}
