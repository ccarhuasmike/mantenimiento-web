import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from "@shared/services/utils.service";

@Injectable({
  providedIn: 'root'
})
export class RegistroConfiguracionService {
  //private readonly URL = environment.apiUrl;
  private readonly apiEdiUrl = environment.apiEdiUrl;
  private readonly apiDevTuya=environment.apiDevTuya;

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService
  ) {
  }



  async getInfoBaseSolicitud(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/ObtenerInfoBaseRegistroSolicitud`, null)
        .subscribe({
          next: (data) => resolve(JSON.parse(data.toString())),
          error: (err) => reject(err),
        });
    });
  }




  async getClientesPorUsuario(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/ADM/Cliente/ListarActivosxUsuario`)
        .subscribe({
          next: (data) => {
            var respuesta = JSON.parse(data.toString()).ListaEntidadComun.map((x: any) => {
              return { id: x.Id, nombre: x.Nombre }
            });
            return resolve(respuesta);
          },
          error: (err) => reject(err),
        });
    });
  }

  async getArbolInmuebles(req: any): Promise<any> {
    var data = await this.utilsService.encriptarBody(req);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/INM/ListarActivosEnFormatoArbol`, data)
        .subscribe({
          next: (data) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  async postGuardarDispositivo(data: any): Promise<any> {//
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiDevTuya}/Iot/Registrar`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }


}
