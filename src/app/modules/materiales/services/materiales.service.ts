import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import {ClientePorUsuario} from "../../../interfaces/ClienteDto";
import { UtilsService } from "@shared/services/utils.service";


@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  private readonly URL = environment.apiUrl;
  private readonly apiEdiUrl = environment.apiEdiUrl;  

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService
  ) {
  }
  async ListarSolicitudConsultaRestaurarEstadoPaginado(req: any): Promise<any> {
    var data = await this.utilsService.encriptarBody(req);

    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/ListarSolicitudConsultaRestaurarEstadoPaginado`, data)
        .subscribe({
          next: (data) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  async FiltroAlmacenes(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Almacenes/ListaAlmacenes`, req)
        .subscribe({
          next: (data) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
  /*
  searchTracks$(term: string): Observable<any> {
    return this.http.get(`${this.URL}/tracks?src=${term}`)
      .pipe(
        map((dataRaw: any) => dataRaw.data)
      )
  }*/

  ListarClientePorUsuario(nombre: any) {//
    return this.http.get<any>(`${this.URL}/Cliente/ListarClientePorUsuario?nombre=${nombre}`);
  }
/*
  CargaInicialSolicitudTrabajoUsuario(term: number) {
    return this.http.get(`${this.URL}/Solicitud/CargaInicialSolicitudTrabajoUsuario?id=${term}`);
  }
  */
  async postGuardarAlmacenes(data: any): Promise<any> {//
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Almacenes/RegistrarAlmacen`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }


 async getInfoBaseSolicitud(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/ObtenerInfoBaseRegistroSolicitud`, null)
        .subscribe({
          next: (data) => resolve(JSON.parse(data.toString())),
          error: (err) => reject(err),
        });
    })
  }

  async getTipoSolicitud(req: any): Promise<any> {
    req = await this.utilsService.encriptarBody(req.idcliente);
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/SOL/TipoSolicitud/ListarActivosxUsuario?pIdCliente=${req.data}`)
        .subscribe({
          next: (data) => {
            var respuesta = JSON.parse(data.toString()).ListaTipoSolicitudDto.map((x: any) => {
              return {
                id: x.Id,
                nombre: x.Nombre,
                mensaje: x.Mensaje === undefined ? "" : x.Mensaje,
                esflujorequerimiento: x.EsFlujoRequerimiento
              }
            });
            return resolve(respuesta);
          },
          error: (err) => reject(err),
        });
    });
  }


  async getClientesPorUsuario(): Promise<any> {//
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

  async getArbolInmuebles(req: any): Promise<any> {//
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


  

  async postAplicarPorcentajeServicio(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/aplicarPorcentajeServicio`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }



  async postBuscarEquipoParaElRegistro(data: any): Promise<any> {//     
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/buscarEquipoParaElRegistro`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  
  async getListarTipoEquipo(): Promise<any> {//
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/ListarTipoEquipo`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  } 


}
