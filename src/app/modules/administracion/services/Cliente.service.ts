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
export class ClienteService{
  private apiBase: string = environment.apiEdiUrlParking;
  private apiBaseDefault: string = environment.apiEdiUrlParking+"/Administracion/Cliente";
  constructor(
    private http: HttpClient
  ) { }

  listar(data:any){    
    var url =this.apiBaseDefault+"/Paginado";
    return this.http.post<Response>(url,data,httpOption).pipe(map((res) =>{return res;}))
  }
  obtener(id:number){
    return this.http.get<Response>(`${this.apiBaseDefault}/${id}`,httpOption).pipe(map((res) =>{return res;}));
  }


}
