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
export class InmuebleService{
  private apiBaseDefault: string = environment.apiEdiUrlParking+"/Inmueble";
  constructor(
    private http: HttpClient
  ) { }
  
  async listar(data:number): Promise<any> {    
    var url =this.apiBaseDefault+"/listar/"+data;
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