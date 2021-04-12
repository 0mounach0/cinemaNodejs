import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  private API_URL = environment.API_URL + '/api/users';

  login (user) {
    const body = {
      'username': user.username,
      'password': user.password
    };

    return this.httpClient.post(this.API_URL + '/login',
        JSON.stringify(body),
        {
          headers:  new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json'),
          observe: 'response',
          withCredentials: true
        }
    );
  }

  getUser() {
    return this.httpClient.get(this.API_URL + "/isLogged",
      {
        headers:  new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json'),
        observe: 'response',
        withCredentials: true
      }
    );
  }

  logout() {
    return this.httpClient.post(this.API_URL + "/logout",
    null,
    {
      headers:  new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json'),
      observe: 'response',
      withCredentials: true
    }
    );
  }
  

}
