import { Injectable } from '@angular/core';
import { getHours } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateTime {

  public getDateTime() {

    const now = new Date();
    const year = now.getFullYear();
    let month = String(now.getMonth() + 1);
    month = ("0" + month).slice(-2);
    let day = String(now.getDate());
    day = ("0" + day).slice(-2);
    let hour = String(now.getHours());
    hour = ("0" + hour).slice(-2);
    let minutes = String(now.getMinutes());
    minutes = ("0" + minutes).slice(-2);

    const date_time = `${year}-${month}-${day}T${hour}:${minutes}`;

    return date_time;
  }

  public revertDateTime(dateISO: string) {

    const isoDate = new Date(dateISO);
    const hour = getHours(isoDate);
    isoDate.setHours(hour - 3);
    const final = isoDate.toISOString().replace(':00.000Z', '');
    return String(final);
  }

  public convertToBRTime(utcDateStr: any) {
    try {
      const date = new Date(utcDateStr);

      const offset = -3 * 60;
      const brtDate = new Date(date.getTime() + offset * 60000);

      const day = String(brtDate.getUTCDate()).padStart(2, '0');
      const month = String(brtDate.getUTCMonth() + 1).padStart(2, '0');
      const year = brtDate.getUTCFullYear();
      const hours = String(brtDate.getUTCHours()).padStart(2, '0');
      const minutes = String(brtDate.getUTCMinutes()).padStart(2, '0');
      const seconds = String(brtDate.getUTCSeconds()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
    catch(err) {
      return String(utcDateStr)
    }
  }

  public checkNew(date: string) {
    const now = new Date();
    const created = new Date(date);
    created.setHours(created.getHours() + 1)

    const diference = created > now;

    return diference
  }

}
