import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { differenceInSeconds, parseISO } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public login(data: any): Observable<any> {
    return this.http.post(`user/auth`, data);
  }

  public setPassword(data: any): Observable<any> {
    return this.http.post(`user/set-password`, data);
  }

  public validatePassword(token: string): Observable<any> {
    return this.http.get(`user/validate-password/${token}`);
  }

  public resetPassword(data: any): Observable<any> {
    return this.http.post(`user/reset-password`, data);
  }

  public clearAuthData(): void {

    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('expires_in');

    this.router.navigate(['auth/login']);
  }

  public getToken(): string | null{
    const access = localStorage.getItem('access_token');
    return access;
  }

  public setUser(user: any): void {
    localStorage.setItem('user_data', btoa(JSON.stringify(user)));
  }

  public setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  public setExpires(token: string): void {
    localStorage.setItem('expires_in', btoa(token));
  }

  public isAuthenticated(): boolean {

    if (!this.getToken()) {
      return false;
    }

    const exp = this.getExpires();
    const now = new Date();
    return exp > now;
  }

  public getExpires(): Date  {
    const token = localStorage.getItem('access_token')!;
    const decoded: any = jwtDecode(token);
    const now = new Date();

    if (decoded.exp) {
      // exp is in seconds since the epoch (UTC)
      const expDate = new Date(decoded.exp * 1000);
      return expDate;
    }

    return now;
  }

  public getUser(): any {
    const token = localStorage.getItem('access_token')!;
    const decoded: any = jwtDecode(token);
    return {
      email: decoded?.email,
      id: decoded?.id,
      name: decoded?.name,
      role: decoded?.role,
    };
  }
}
