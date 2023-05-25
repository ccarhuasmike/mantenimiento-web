
import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EstadoSolService {
  private readonly URL = environment.apiUrl;
  private readonly apiEdiUrl = environment.apiEdiUrl;
  constructor(private http: HttpClient) {
  }
  async getEstadoSolicitudFiltro(): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/SOL/ListarEstadosSolicitud`)
        .subscribe({
          next: (data:any) => {            
            return resolve(data.ListaEntidadComun);
          },
          error: (err) => reject(err),
        });
    });
  }
}


