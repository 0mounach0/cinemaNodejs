import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  /* -------- */
  private API_URL = environment.API_URL + "/api/cities";


  /* ----- */
  constructor(private httpClient: HttpClient) { }

  /* ------------- */
  getAllCities() {
    
    return this.httpClient.get(this.API_URL,
      {
        headers:  new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json'),
        observe: 'response',
        withCredentials: true
      }
    );
    
  }

  /* ------------- */
  createCity(city) {

    return this.httpClient.post(this.API_URL ,
    JSON.stringify(city) ,
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
