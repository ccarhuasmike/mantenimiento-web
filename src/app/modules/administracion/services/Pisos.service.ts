import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UtilsService } from "@shared/services/utils.service";
import { map } from 'rxjs/operators';

const httpOption = {
  headers: new HttpHeaders({
    "Content-Type": "application/json; charset=utf-8",
  }),
};
@Injectable({
  providedIn: 'root'
})
export class PisosService{
  private apiBaseDefault: string = environment.apiEdiUrlParking+"/Inmueble/Pisos";
  constructor(
    private http: HttpClient
  ) { }

  listar(data:any){    
    var url =this.apiBaseDefault+"/Paginado";
    return this.http.post<Response>(url,data,httpOption).pipe(map((res) =>{return res;}))
  }
  async listarEdificiosxIdInmueble(data:number): Promise<any> {    
    var url =environment.apiEdiUrlParking+"/Inmueble/EdificiosxIdInmueble/"+data;
    return new Promise((resolve, reject) => {
      this.http
    .get<Response>(url,httpOption).pipe(map((res) =>{return res;}))
    .subscribe({
      next: (data: any) => {
        return resolve(data);
      },
      error: (err) => reject(err),
    });
  });
}
}