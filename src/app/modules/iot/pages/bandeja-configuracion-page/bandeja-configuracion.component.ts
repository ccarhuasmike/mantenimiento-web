import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from "@angular/material/dialog";

import { BandejaConfiguracionService } from '../../services/bandeja-configuracion.services';
import { Device } from '@core/iot/iot.type';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DialogoDispositivoComponent } from '@shared/components/dialogo-dispositivo/dialogo-dispositivo.component';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';





/*
import { CookieService } from 'ngx-cookie-services';
import { BootstrapNotifyBarService } from '@shared/services/bootstrap-notify.services';
*/
@Component({
  selector: 'app-bandeja-configuracion-page',
  templateUrl: './bandeja-configuracion.component.html',
  styleUrls: ['./bandeja-configuracion.component.css'],
})
export class BandejaConfiguracionPageComponent implements OnInit, OnDestroy {
  progressRef!: NgProgressRef;
  value: number = 0;
  matexpansionpanelfiltro: boolean = false;
  public dataSource: Array<Device> = [];
  public environment: string = "";
  public displayedColumns: string[] =//columnas mostradas en la tabla
    [
      //"active_time",
      //"asset_id",
      "icon",
      "uuid",//using column for actions
      "id",
      "product_id",
      "category",
      "category_name",
      //"create_time",
      //"gateway_id",

      //"ip",
      //"lat",
      "local_key",
      //"lon",
      //"model",
      "name",
      "online",
      "product_name",
      "sub",
      "agregado"
      //"time_zone",
      //"update_time",
      //'menu'
    ];
  isLoading = false;

  public itemsPerPage: number = 10
  public totalRegistros: number = 0;



  class = "table-column-130 text-justify-content"

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;

  constructor(
    public dialogo: MatDialog,
    private bandejaConfiguracionService: BandejaConfiguracionService,
    private router: Router,
    private     ngProgress:NgProgress  ) {

  }

  // Row action
 async rowControled(dispositive: any) {


      //let inputDate=this.datosBasicosFormGroup.get("FechaInicioTraslado")?.value

          this.dialogo.open(DialogoDispositivoComponent, {
            maxWidth: '80vw',
            maxHeight: 'auto',
            height: 'auto',
            width: '80%',
            disableClose: true,
            data:dispositive

          })
            .afterClosed()
            .subscribe(async (confirmado: Boolean) => {
              if (confirmado) {
                this.progressRef.start()


                try {
                //  let response = await this.printService.RegistroGuia(data)



                this.progressRef.complete()

                } catch (err) {

                  this.progressRef.complete()
                  console.log(err, "Error inesperado;")
                }


                /*{
                  "success": true,
                  "body": "Guía Registrado Correctamente",
                  "error": null,
                  "entidad": 0,
                  "errors": null,
                  "code": 200,
                  "message": null
                }*/


              }
            });



  }

  rowEdit(dispositive: any) {
    this.router.navigate([`iot/editarIot/${dispositive.id}`]);



  }


  // Row action






  loadDatos(): void {
    this.isLoading = true;
    this.dataSource = [];
    this.matexpansionpanelfiltro = false;


    this.bandejaConfiguracionService.ListarDevices().subscribe(

      {
        next: (res) => {

          this.dataSource = res
          this.isLoading = false;
          this.totalRegistros = res.length;
        },

        error: (err) => {
          this.isLoading = false;
          return reject(err)
        },
      }
    )
  }
  pageChanged(event: any): void {

  };
  //#endregion

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.environment = environment.apiImageTuya;
    this.progressRef = this.ngProgress.ref();
    this.loadDatos();
  }


}
function reject(err: any): void {
  throw new Error('Function not implemented.');
}

