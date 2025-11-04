import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Calc {

  public calcTotalUnits(item: any) {
    try {
      const volume = Number(item.volume);
      const weight = Number(item.weight);

      if (!volume || !weight) return '';

      const units = weight / volume;

      const formatted = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(units);

      return `${formatted} unid.`;
    } catch {
      return '';
    }
  }




  public calcTotalWei(item: any) {
    try {
      const volume = item.volume;
      const weight = item.weight;

      const units = weight / volume;

      const formatted = parseFloat(units.toFixed(2));
      return `${formatted} unid.`;
    } catch (err) {
      return '';
    }
  }


}

