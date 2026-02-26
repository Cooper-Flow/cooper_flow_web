import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TypesService {


  constructor() { }

  public exitType(type: string) {

    switch (type) {
      case 'wholesale': return 'Atacado';
      case 'retail': return 'Varejo';
      case 'consumer': return 'Consumidor'
    }
    return ''
  }

  public exitClientName(type: string, data: any) {

    switch (type) {
      case 'wholesale': return data.Person.name ?? '';
      case 'retail': return data.Person.name ?? '';
      case 'consumer': return data.observation ?? '';
    }
    return ''
  }
}

