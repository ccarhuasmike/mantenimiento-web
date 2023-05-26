import {environment} from '../../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
// import {ClientePorUsuario} from "../../../interfaces/ClienteDto";
import {UtilsService} from "@shared/services/utils.service";


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly base = environment.apiEdiUrlParking;

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService
  ) {
  }

  async ObtenerDashboard(): Promise<any> {
    // var data = await this.utilsService.encriptarBody(req);
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.base}/Seguridad/ObtenerDashboard`)
        .subscribe({
          next: (data) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }
}
