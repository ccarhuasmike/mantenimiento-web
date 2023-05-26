import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from "@shared/services/utils.service";

@Injectable({
  providedIn: 'root'
})
export class EspaciosService {
  private readonly apiEdiUrl = environment.apiEdiUrlParking;
  constructor(
    private http: HttpClient,
    private utilsService: UtilsService
  ) {
  }


  async getAreasTrabajo(idcliente:number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        //.get(`${environment.apiEdiUrlParking}/Administracion/ObtenerZonas/${inmueble}`)
        .get(`${environment.apiEdiUrlParking}/Mantenimiento/ListarAreaTrabajo/${idcliente}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  async getEmpresa(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrlParking}/Mantenimiento/ListarEmpresa`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
  async postInsertarConfigUsuariosEspacios(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Mantenimiento/InsertarConfigUsuariosEspacios`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async postCheckingReserva(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Mantenimiento/CheckingReserva`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async postCancelarReserva(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Mantenimiento/CancelarReserva`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async ValidaExisteUsuario(data: any): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this.http
        //.post(`${environment.apiEdiUrlParking}/Mantenimiento/ValidaExisteUsuario`, data)
        .get(`${environment.apiEdiUrlParking}/Mantenimiento/ValidaExisteUsuario/${data.IdUsuario}`)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }



  
  async postObtenerAforoPorInmueble(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Mantenimiento/ObtenerAforoPorInmueble`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async postMantenimientoReserva(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Mantenimiento/MantenimientoReserva`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async getObtenerZonas(inmueble: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrlParking}/Administracion/ObtenerZonas/${inmueble}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
  async getObtenerInmuebles(idCliente:number): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrlParking}/Administracion/ObtenerInmuebles/${idCliente}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
  async getObtenerPisos(idInmueble:number): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrlParking}/Administracion/ObtenerPisos/${idInmueble}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  async getObtenerPersonas(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrlParking}/Administracion/ObtenerPersonas`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }



  async postTokenBI(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrlParking}/Powerbi/GetEmbedInfo`)
        .subscribe({
          next: (data:any) => {      
                
            return resolve(data );
          },
          error: (err) => reject(err),
        });
    });
  }

  async BandejaReservaPaginado(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Mantenimiento/BandejaReserva`, req)
        .subscribe({
          next: (data) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }



}
