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
export class DistribucionesService {
  private readonly URL = environment.apiUrl;
  private readonly apiEdiUrl = environment.apiEdiUrl;

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService
  ) {
  }

  async ListarPaginado(data: any): Promise<any> {
    //data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/ListarPaginado`, data)
        .subscribe({
          next: (res: any) => {
            
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }

  async subirPlantillaCargarMasivaDistribucion(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/CargaMasivaRegistroDistribucion`, data)
        .subscribe({
          next: (res: any) => {            
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }

  async subirPlantillaCargarMasivaDistribucionOtros(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/CargaMasivaRegistroDistribucionOtros`, data)
        .subscribe({
          next: (res: any) => {            
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }

  async subirPlantillaActualizacionOE(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/ProcesarArchivoDeActualizacion`, data)
        .subscribe({
          next: (res: any) => {            
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }



  async DescargarReporteDetallado(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/DescargarReporteDetallado`, data)
        .subscribe({
          next: (res: any) => {
            
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }

  async ListarReporteOrdenesKilos(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/Reportes/ListarReporteOrdenesKilos`, data)
        .subscribe({
          next: (res: any) => {
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }

  async ListarCumplimientoxZonales(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/Reportes/ListarCumplimientoxZonales`, data)
        .subscribe({
          next: (res: any) => {
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }
  async ListarCantidadSolicitudesxEstado(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/Reportes/ListarCantidadSolicitudesxEstado`, data)
        .subscribe({
          next: (res: any) => {
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }

  async ListarCalificaciones(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/Reportes/Calificaciones`, data)
        .subscribe({
          next: (res: any) => {
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }
  async ListarBandejaProveedorPaginado(data: any): Promise<any> {
    //data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/DIS/ListarBandejaProveedorPaginado`, data)
        .subscribe({
          next: (res: any) => {
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }

  
  async DescargarArchivoProveedorDistribucion(idcliente: any): Promise<any> {      
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/DIS/DescargarArchivoProveedorDistribucion?IdDistribuciones=${idcliente}`)
        .subscribe({
          next: (res: any) => {            
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }  
  
  async obtenerCentroCosto(idCliente: number): Promise<any> {      
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/ADM/Cliente/ListarUnidadesOrganizativas?IdCliente=${idCliente}`)
        .subscribe({
          next: (res: any) => {            
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }  

  async validarCalificacion(): Promise<any> {      
     return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/DIS/ValidarPendientesCalificacion`)
        .subscribe({
          next: (res: any) => {            
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }  
  async obtenerAgencias(idCliente:any,buscar:any): Promise<any> {      
    var idCliente = await this.utilsService.encriptar(idCliente);
    var buscar = await this.utilsService.encriptar(buscar);
     return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/INM/ListarporClienteGeneral?pIdCliente=${idCliente}&Nombre=${buscar}`)
        .subscribe({
          next: (res: any) => {            
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }  
  async obtenerAlmacenes(idCliente:any): Promise<any> {      
     idCliente = await this.utilsService.encriptar(idCliente.toString());   
     return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/MAT/ListarAlmacenesActivosxCiente?IdCliente=${idCliente.data}`)
        .subscribe({
          next: (res: any) => { 
            debugger;           
            return resolve(res);
          },
          error: (err) => reject(err),
        });
    });
  }  
  

  async obtenerUsuariosPorInmueble(req:any): Promise<any> {      
    req = await this.utilsService.encriptar(req.toString());   
    return new Promise((resolve, reject) => {
     this.http
       .get(`${this.apiEdiUrl}/SEG/Usuario/ListarxInmueble?IdInmueble=${req.data}`)
       .subscribe({
         next: (res: any) => { 
           debugger;           
           return resolve(res);
         },
         error: (err) => reject(err),
       });
   });
 }  


}
