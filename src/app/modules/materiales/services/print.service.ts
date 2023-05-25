import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {environment} from "../../../../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting = false;

  constructor(private router: Router,    private http: HttpClient,) { }

  printDocument(documentName: string, documentData: any) {

    this.isPrinting = true;
    this.router.navigate(['/materiales/print', documentName, JSON.stringify(documentData)] );
  }

  onDataReady() {
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.router.navigate(['materiales/registroguias', { outlets: { print: null }}]);
    });
  }
  async RegistroGuia(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiEdiUrlParking}/Guias/RegistrarAlmacen`, req)
        .subscribe({
          next: (data) => {
            return resolve(data);
          },
          error: (err) => reject(err),
        });
    });
  }


}
