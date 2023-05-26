import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TmAdjunto } from '@core/models/TmAdjunto-interface';
import { map } from 'rxjs/operators';
const httpOption = {
  headers: new HttpHeaders({
    "Content-Type": "application/json; charset=utf-8",
  }),
};
@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private apiBase = environment.apiEdiUrl;

  constructor(
    private http: HttpClient
  ) { }
    subirArchivoAzureIndividual(form: any) {
      return this.http.post(`${this.apiBase}/ADM/Adjunto/GuardarArchivoAdjuntoIndividualAzure`, form);
    }

    // subirArchivo(form: FormData) {
    //   return this.http.post(`${this.apiBase}/ADM/Adjunto/cargar-archivo`, form);
    // }
    // descargarArchivo(stNombreArchivoRuta: string) {
    //   return this.http.get(`${this.apiBase}/Negocio/descargar-archivo/${stNombreArchivoRuta}`, {
    //     responseType: 'blob'
    //   });
    // }
    // deleteArchivo(ruta: string) {
    //   let params = new HttpParams();
    //   params = params.append('rutaArchivo', ruta);
    //   return this.http.get(`${this.apiBase}/Negocio/eliminar-archivo`, { params });
    // }
    // deleteTmAdjunto(idAdjunto: number) {
    //   return this.http.delete(`${this.apiBase}/Negocio/tmAdjunto/${idAdjunto}`);
    // }
    // postTmAdjunto(adj: TmAdjunto) {
    //   return this.http.post<TmAdjunto>(`${this.apiBase}/Negocio/tmAdjunto`, adj);
    // }
    // listarAdjuntos(nombreTabla:string,idRegistro:number){
    //   let params = new HttpParams();
    //   params = params.append('nombreTabla', nombreTabla);
    //   params = params.append('idRegistro', idRegistro);
    //   return this.http.get<Response>(`${this.apiBase}/Negocio/tmAdjunto`, { params });
    // }
    // listarLogAccion(stNombreTabla: string,IdRegistro:number) {  
    //   return this.http.get<Response>(`${this.apiBase}/Negocio/LogAccion/${stNombreTabla}/${IdRegistro}`);
    // }
    // listarLogAccionUsuario(stNombreTabla: string,IdRegistro:number) {  
    //   return this.http.get<Response>(`${this.apiBase}/Negocio/LogAccionUsuario/${stNombreTabla}/${IdRegistro}`);
    // }
}
