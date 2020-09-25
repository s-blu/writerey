import { from, interval, Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

export function delayValues(values: any, delay: number = 100) {
  if (!(values instanceof Observable)) values = from(values);

  return zip(values, interval(delay)).pipe(map(([val, _]) => val));
}
