import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kg'
})
export class KgPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    decimals: number = 2
  ): string {
    if (value === null || value === undefined) return '---';

    return `${value.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })} kg`;
  }
}
