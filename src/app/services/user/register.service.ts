import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  public createEntry(data: any): Observable<any> {
    return this.http.post(`register/entry`, data);
  }

  public createExit(data: any): Observable<any> {
    return this.http.post(`register/exit`, data);
  }

  public closeExit(data: any): Observable<any> {
    return this.http.post(`register/exit/close`, data);
  }

  public paginate(params: any): Observable<any> {
    return this.http.get(`register/paginate`, { params });
  }

  public detail(id: string): Observable<any> {
    return this.http.get(`register/detail/${id}`);
  }

  public detailExit(id: number): Observable<any> {
    return this.http.get(`register/exit/detail/${id}`);
  }

  public listExits(params?: any): Observable<any> {
    return this.http.get(`register/exit`, { params });
  }

  public transformation(params: any): Observable<any> {
    return this.http.get(`register/transformation`, { params });
  }
}
