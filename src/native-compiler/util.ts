import { snake } from 'case';
import { isBoolean } from 'util';

import { IOptionalParams, IParams } from '.';

export function convertParams(params: IParams | IOptionalParams) {
  const arr = [];

  for (const [name, value] of Object.entries(params)) {
    let finalValue: any = value;

    if (isBoolean(value)) {
      finalValue = value ? 'YES' : 'NO';
    }

    arr.push(`${snake(name)}=${finalValue}`);
  }

  return arr;
}
