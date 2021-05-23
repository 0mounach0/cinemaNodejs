import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QrcodeService {

  /* -------- */
  private API_URL = environment.API_URL + "/api/qrcode";


  /* ----- */
  constructor(private httpClient: HttpClient) { }


  /* ------------- */
  createQrcode(ticket) {

    return this.httpClient.post(this.API_URL ,
    JSON.stringify(ticket) ,
      {
        headers:  new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json'),
        observe: 'response'
      }
    );
    
  }

  
}
