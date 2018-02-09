// Quick pipe to turn strings like "-40" into "(40)".
// Can be used like: {{ -4249 | MinusSignToParens }} within an HTML file.

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minusSignToParens'
})
export class MinusSignToParens implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.charAt(0) === '-' ?
    '(' + value.substring(1, value.length) + ')' :
    value;
  }
}