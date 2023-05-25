
import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
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
  encriptarBody(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/Usuario/Encriptar`, {
          Body: JSON.stringify(data),
          Token: "MIw3lILd1k4GwoAuelSGjwPVepY"
        })
        .subscribe({
          next: (data) => resolve({"data": data}),
          error: (err) => reject(err),
        });
    });
  }
  TamanioArchivoPermitido(size: any): boolean {
      let isFileSizeAllowed = false;
      if (size < 2000000) {
        isFileSizeAllowed = true;
      }
      return isFileSizeAllowed;
  }
}


