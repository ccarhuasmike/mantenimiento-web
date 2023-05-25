
import {environment} from './../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class LogAccionService {
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
  async getLogAcciones(req:any): Promise<any> {
    
    var tabla = await this.encriptar( req.tabla);
    var entidad = await this.encriptar( req.entidad);
    
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/SEG/LogAccion/ListarxEntidad?CodigoTabla=${tabla.data}&IdEntidad=${entidad.data}`)
        .subscribe({
          next: (data:any) => {

            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
}


