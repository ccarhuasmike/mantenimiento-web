
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public cartEvent = new Subject<any>();
  public cartEvent$ = this.cartEvent.asObservable();
  _clienteSeleccionado: any = null;
  private readonly URL = environment.apiUrl;
  private readonly apiEdiUrl = environment.apiEdiUrl;
  constructor(private http: HttpClient) {
  }
  ClienteSeleccionado(cliente: any) {
    this._clienteSeleccionado = cliente;

  }





  async getClientesPorUsuarioFiltro(nombre: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiEdiUrl}/ADM/Cliente/ListarClientesActivosxUsuarioFiltro?Nombre=${nombre}`)
        .subscribe({
          next: (data: any) => {
            return resolve(JSON.parse(data));
          },
          error: (err) => reject(err),
        });
    });
  }

  
}


