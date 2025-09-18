import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  public create(data: any): Observable<any> {
    return this.http.post(`location/create`, data);
  }

  public paginate(params: any): Observable<any> {
    return this.http.get(`location/paginate`, { params });
  }

  public detail(id: string): Observable<any> {
    return this.http.get(`location/detail/${id}`);
  }

  public update(data: any): Observable<any> {
    return this.http.post(`location/update`, data);
  }

  public combolistSectors(): Observable<any> {
    return this.http.get(`location/sector/combolist`);
  }

  public combolist(): Observable<any> {
    return this.http.get(`location/combolist`);
  }

  public track(params: any): Observable<any> {
    return this.http.get(`location/track`, { params });
  }

  public changeSector(data: any): Observable<any> {
    return this.http.post(`location/change-sector`, data);
  }
}
