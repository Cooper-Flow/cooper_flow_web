import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Calc {

  public calcTotalUnits(item: any) {
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

