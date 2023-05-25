﻿
import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SolicitanteService {
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
  async getSolicitante(req: any): Promise<any> {

    var idcliente = await this.encriptar(req.idcliente);
    var nombre = await this.encriptar(req.nombre);
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/SEG/Usuario/ListarActivosXClienteyNombreFiltro?pIdCliente=${idcliente.data}&pNombre=${nombre.data}`)
        .subscribe({
          next: (data:any) => {
            var respuesta = JSON.parse(data.toString()).ListaUsuarios.map((x: any) => {
              return {
                Id: x.Id,
                Nombre: x.Nombre
              }
            });
            return resolve(respuesta );
          },
          error: (err) => reject(err),
        });
    });
  }
}


