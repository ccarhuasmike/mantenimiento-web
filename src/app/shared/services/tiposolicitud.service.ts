﻿
import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TipoSolicitudService {
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
  async getTipoSolicitudFiltro(req: any): Promise<any> {
    
    var idcliente = await this.encriptar(req.idcliente);
    //var nombre = await this.encriptar(req.nombre);
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/SOL/TipoSolicitud/ListarTipoSolicitudActivosxUsuariossss?pIdCliente=${idcliente.data}&pNombre=${req.nombre}`)
        .subscribe({
          next: (data:any) => {
            
            return resolve(JSON.parse(data));
          },
          error: (err) => reject(err),
        });
    });
  }
}


