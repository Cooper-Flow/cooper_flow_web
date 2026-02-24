import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private http: HttpClient) { }

  public create(data: any): Observable<any> {
    return this.http.post(`product/create`, data);
  }

  public paginate(params: any): Observable<any> {
    return this.http.get(`product/paginate`, { params });
  }

  public detail(id: string): Observable<any> {
    return this.http.get(`product/detail/${id}`);
  }

  public update(data: any): Observable<any> {
    return this.http.post(`product/update`, data);
  }
}
