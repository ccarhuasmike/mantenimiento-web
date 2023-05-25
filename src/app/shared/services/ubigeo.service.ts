
import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  private readonly URL = environment.apiUrl;
  private readonly apiEdiUrl = environment.apiEdiUrl;
  
  constructor(private http: HttpClient) {
  }
  encriptar(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/Usuario/Encriptar`, {
          Body: data.toString(),
          Token: "MIw3lILd1k4GwoAuelSGjwPVepY"
        })
        .subscribe({
          next: (data) => resolve({"data": data}),
          error: (err) => reject(err),
        });
    });
  }
  async getUbigeo(data: Object): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Almacenes/ListarUbicacion`,data)
        .subscribe({
            next: (res: any) => {
            return resolve(res);
          },
          error: (err) => reject(err),
        });


    });
  }
}


