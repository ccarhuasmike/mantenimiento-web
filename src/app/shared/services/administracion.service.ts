
import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UtilsService} from "@shared/services/utils.service";
//
@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  private readonly URL = environment.apiUrl;
  private readonly apiEdiUrl = environment.apiEdiUrl;
  constructor(
    private http: HttpClient,
    private utilsService: UtilsService
  ) {
  }
  async getListarAdjunto(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/ADM/Adjunto/ListarJson`, data)
        .subscribe({
          next: (data:any) =>{

            return resolve(data)
          } ,
          error: (err) => reject(err),
        });
    });
  }
  async getListarArchivoAdjuntoCloud(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/ADM/Adjunto/ListarArchivoAdjuntoCloud`, data)
        .subscribe({
          next: (data:any) =>{
            return resolve(JSON.parse(data))
          } ,
          error: (err) => reject(err),
        });
    });
  }
  async getGrabarAdjuntoCloud(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/ADM/AdjuntoCloud/GrabarAdjuntoCloud`, data)
        .subscribe({
          next: (data:any) =>{
            return resolve(JSON.parse(data))
          } ,
          error: (err) => reject(err),
        });
    });
  }
  async getEliminarAdjuntoCloud(nombreInterno: string): Promise<any> {
    var pnombreInterno = await this.utilsService.encriptar(nombreInterno);
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/ADM/AdjuntoCloud/EliminarAdjuntoCloud?pIds=${pnombreInterno.data}`)
        .subscribe({
          next: (data:any) =>{
            return resolve(JSON.parse(data))
          } ,
          error: (err) => reject(err),
        });
    });
  }
  async getElminarAdjunto(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/ADM/Adjunto/EliminarAdjunto`, data)
        .subscribe({
          next: (data:any) =>{

            return resolve(JSON.parse(data))
          } ,
          error: (err) => reject(err),
        });
    });
  }

  async DescargarArchivoAdjunto(nombreInterno:string): Promise<any> {
    var pnombreInterno = await this.utilsService.encriptar(nombreInterno);
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/ADM/Adjunto/DescargarArchivoAdjunto?pnombreInterno=${pnombreInterno.data}`)
        .subscribe({
          next: (data:any) => {
            return resolve(JSON.parse(data).ListaInmueble);
          },
          error: (err) => reject(err),
        });
    });
  }
}


