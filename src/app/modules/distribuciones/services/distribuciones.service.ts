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
  

  searchTracks$(term: string): Observable<any> {
    return this.http.get(`${this.URL}/tracks?src=${term}`)
      .pipe(
        map((dataRaw: any) => dataRaw.data)
      )
  }

  ListarClientePorUsuario(nombre: any) {
    return this.http.get<any>(`${this.URL}/Cliente/ListarClientePorUsuario?nombre=${nombre}`);
  }

  CargaInicialSolicitudTrabajoUsuario(term: number) {
    return this.http.get(`${this.URL}/Solicitud/CargaInicialSolicitudTrabajoUsuario?id=${term}`);
  }
  async postGuardarSolicitud(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/Grabar`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async postObtenerAprobadores(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/ReglaAsignacion/ObtenerAprobadoresRequerimiento`, data)
        .subscribe({
          next: (res: any) => {

            return resolve(JSON.parse(res));
          },
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
    });
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

  async getSolicitante(req: any): Promise<any> {
    var idcliente = await this.utilsService.encriptar(req.idcliente);
    var nombre = await this.utilsService.encriptar(req.nombre);
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/SEG/Usuario/ListarActivosXClienteyNombreFiltro?pIdCliente=${idcliente.data}&pNombre=${nombre.data}`)
        .subscribe({
          next: (data: any) => {
            var respuesta = JSON.parse(data.toString()).ListaUsuarios.map((x: any) => {
              return {
                id: x.Id,
                nombre: x.Nombre,
                email: x.email,
                telefono: x.Telefono
              }
            });
            return resolve(respuesta);
          },
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

  async getArbolGrupoUnidad(req: any): Promise<any> {
    var data = await this.utilsService.encriptarBody(req);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/ADM/UnidadMantenimiento/BuscarGrupoUnidadMantenimientoArbolActivos`, data)
        .subscribe({
          next: (data) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
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

  async BuscarSolicitudPorId(req: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/ObtenerPorId/${req}`)
        .subscribe({
          next: (data: any) => {

            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }



  async postSolicitarAprobacionPresupuesto(data: any): Promise<any> {
    //data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/SolicitarAprobacionPresupuesto`, data)
        .subscribe({
          next: (data) => {

            return resolve(data)
          },
          error: (err) => reject(err),
        });
    });
  }

  async BuscarAprobadorPresupuestoPorSolicitud(req: any): Promise<any> {
    //req = await this.encriptarBody(req.idcliente);
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/SOL/BuscarAprobadorPresupuestoPorSolicitud?IdSolicitud=${req}`)
        .subscribe({
          next: (data: any) => {

            return resolve(JSON.parse(data));
          },
          error: (err) => reject(err),
        });
    });
  }


  async postDarConformidad(data: any): Promise<any> {

    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        //.post(`${this.apiEdiUrl}/SOL/DarConformidadServicio`, data)
        .post(`${this.apiEdiUrl}/SOL/DarConformidad`, data)        
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  async postAprobarRequerimientoSolicitud(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/Aprobar`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async postMarcarLlegadaASitio(data: any): Promise<any> {     
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/MarcarLlegadaASitio`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async postSolicitarParadaReloj(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/SolicitarParadaReloj`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async getReactivarParadaReloj(IdSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/ReactivarParadaReloj/${IdSolicitud}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  async getListarTarifarioServicio(IdSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/ListarTarifarioServicio/${IdSolicitud}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }  
  async getListarServiciosDelTarifario(IdTarifario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http                                           
        .get(`${environment.apiEdiUrl}/SOL/ListarServiciosDelTarifario/${IdTarifario}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }  
  async postTarifadoServicioDesdeTarifario(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/TarifadoServicioDesdeTarifario`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  
  
  async getListarTarifarioMaterial(IdSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/ListarTarifarioMaterial/${IdSolicitud}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
    
  }  
  async getListarMaterialesDelTarifario(IdTarifario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/ListarMaterialesDelTarifario/${IdTarifario}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }    
  async postTarifadoMaterialDesdeTarifario(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/TarifadoMaterialDesdeTarifario`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }


  async getEnviarAprobarelTarifado(IdSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/EnviarAprobarelTarifado/${IdSolicitud}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }  

  async getListarNuevosEstado(idEstado: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/listarEstadosRestaurarEstados?idEstado=${idEstado}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }  

  async postTarifadoServicios(data: any): Promise<any> {    
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/TarifadoServicio`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  
  async postGrabarActualizarGastoServicio(data: any): Promise<any> {    
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/Gastos/grabarActualizarGastoServicio`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }


  async postActualizarTarifadoServicios(data: any): Promise<any> {       
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/actualizarTarifadoServicio`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  async getListarTarifadoServicioxSt(IdSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/ListarTarifadoServicioxSt/${IdSolicitud}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
  deleteTarifadoServicio(listIds: any) {    
    return this.http.get(`${environment.apiEdiUrl}/SOL/eliminarTarifadoServicio?ids=${listIds}`);
   //return this.http.get(`${environment.apiEdiUrl}/SOL/eliminarTarifadoServicio`, listIds);
  }
  /*
  POST /SOL/actualizarTarifadoServicio
  GET /SOL/eliminarTarifadoServicio
  GET /SOL/eliminarTarifadoMaterial

  POST /SOL/actualizarTarifadoMaterial
  
  */
  async postTarifadoMateriales(data: any): Promise<any> {   
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/TarifadoMaterial`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  async postActualizarTarifadoMateriales(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/actualizarTarifadoMaterial`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  async getListarTarifadoMaterialesxSt(IdSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/ListarTarifadoMaterialxSt/${IdSolicitud}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
  deleteTarifadoMateriales(listIds: any) {
   
    return this.http.get(`${environment.apiEdiUrl}/SOL/eliminarTarifadoMaterial?ids=${listIds}`);
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
  
  async postAplicarPorcentajeMaterial(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/aplicarPorcentajeMaterial`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }



  async postFranquearSolicitud(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/FranquearSolicitud`, data)
        //.post(`${environment.apiEdiUrlLocal}/SOL/FranquearSolicitud`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  async FranqueoSolicitud(data: any): Promise<any> {
    //data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/FranqueoSolicitud`, data)
        //.post(`${environment.apiEdiUrlLocal}/SOL/FranquearSolicitud`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async ModificarAccionesPendientes(req: any): Promise<any> {
    var data = await this.utilsService.encriptarBody(req);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/ModificarAccionesPendientes`, data)
        .subscribe({
          next: (data) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  async ObtenerTipoSolicitudPorId(req: number): Promise<any> {
    var idTipoSolicitud = await this.utilsService.encriptar(req);
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/SOL/TipoSolicitud/ObtenerTipoSolicitudPorId?pTipoSolicitud=${idTipoSolicitud.data}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  async ListarTarifadosServicios(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);

    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/ListarTarifadosServicios`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  async ListarTarifadosMateriales(data: any): Promise<any> {
    data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/ListarTarifadosMateriales`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async RegistrarFechaAtencionSolicitud(data: any): Promise<any> {    
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrl}/SOL/RegistrarFechaAtencionSolicitud`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async postAtenderSolicitudNvo(data: any): Promise<any> {
    //data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrl}/SOL/atenderSolicitudNvo`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  async EnviarAlProveedor(data: any): Promise<any> {
    //data = await this.utilsService.encriptarBody(data);
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrl}/SOL/EnviarAlProveedor`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }

  async getTiempos(IdSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/Tiempos/${IdSolicitud}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  async getListarPreciarios(IdSolicitud: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/Gastos/ListarPreciarios/${IdSolicitud}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
  
  async getListarGastoServicioxSt(IdSolicitud: number): Promise<any> {    
    return new Promise((resolve, reject) => {
      this.http
        .get(`${environment.apiEdiUrl}/SOL/ListarGastoServicioxSt/${IdSolicitud}`)
        .subscribe({
          next: (data: any) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }

  
  deleteGastoServicio(listIds: any) {    
    return this.http.get(`${environment.apiEdiUrl}/SOL/Gastos/eliminarGastoServicio?ids=${listIds}`);
   //return this.http.get(`${environment.apiEdiUrl}/SOL/eliminarTarifadoServicio`, listIds);
  }

  async postBuscarEquipoParaElRegistro(data: any): Promise<any> {     
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/buscarEquipoParaElRegistro`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  
  async getListarTipoEquipo(): Promise<any> {
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
  
  
  async postAnularSolicitudes(data: any): Promise<any> {    
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/AnularSolicitudes`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  
  async postCambiarTipoSolicitud(data: any): Promise<any> {    
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/cambiarTipoSolicitud`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  async postRestaurarEstado(data: any): Promise<any> {    
    return new Promise((resolve, reject) => {
      this.http
        .post(`${this.apiEdiUrl}/SOL/restaurarEstado`, data)
        .subscribe({
          next: (data) => resolve(data),
          error: (err) => reject(err),
        });
    });
  }
  


}
