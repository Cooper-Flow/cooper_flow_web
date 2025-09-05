import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }


  public create(data: any): Observable<any> {
    return this.http.post(`user/profile/create`, data);
  }

  public update(data: any): Observable<any> {
    return this.http.post(`user/profile/update`, data);
  }

  public combolist(): Observable<any> {
    return this.http.get(`user/profile/combolist`);
  }

  public detail(id: string): Observable<any> {
    return this.http.get(`user/profile/detail/${id}`);
  }

  public getPermission(): Observable<any> {
    return this.http.get(`user/profile/permission`);
  }

  public checkPermission(permission: string): Observable<any> {
    return this.http.get(`user/profile/check/${permission}`);
  }

}
