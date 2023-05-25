
import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UtilsService} from "@shared/services/utils.service";

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {
  private readonly URL = environment.apiUrl;
  private readonly apiEdiUrl = environment.apiEdiUrl;
  constructor(
    private http: HttpClient,
    private utilsService: UtilsService

  ) {
  }

  async getTecnicos(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SEG/Usuario/ListarTecnicos`, data)
        .subscribe({
          next: (data:any) =>{
            return resolve(JSON.parse(data))
          } ,
          error: (err) => reject(err),
        });
    });
  }
}


