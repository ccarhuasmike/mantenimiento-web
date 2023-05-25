
import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ListavaloresService {
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
  async getListaValores(req: any): Promise<any> {

    var pIdLista = await this.encriptar(req.idlista);

    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/ADM/ListaValores/ListarActivosxIdLista?pIdLista=${pIdLista.data}&pIdCliente=${req.idcliente}`)
        .subscribe({
          next: (data:any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
}


