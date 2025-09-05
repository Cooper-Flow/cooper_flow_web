import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  constructor(private http: HttpClient) { }

  public getVoluesByProducer(params: any): Observable<any> {
    return this.http.get(`pricing/volumes`, { params });
  }

  public create(data: any): Observable<any> {
    return this.http.post(`pricing/create`, data);
  }

  public paginate(params: any): Observable<any> {
    return this.http.get(`pricing/paginate`, { params });
  }

  public detail(id: number): Observable<any> {
    return this.http.get(`pricing/detail/${id}`);
  }

  public closePricing(data: any): Observable<any> {
    return this.http.post(`pricing/close`, data);
  }

  public sendObservation(data: any): Observable<any> {
    return this.http.post(`pricing/observation`, data);
  }

}
