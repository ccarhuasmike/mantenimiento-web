import {Component, OnInit, OnDestroy} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
  FormBuilder,
  FormArray,
  FormGroup,
  FormControl
} from '@angular/forms';


import {AuthService} from "../../../../core/auth/auth.service";
import {PrintService} from "@modules/materiales/services/print.service";

import {MatDialog} from "@angular/material/dialog";

import {NgProgress, NgProgressRef} from '@ngx-progressbar/core';
import {
  MatTableDataSource
} from '@angular/material/table';
import {DialogoConfirmacionComponent} from "@shared/components/dialogo-confirmacion/dialogo-confirmacion.component";
import {Router} from "@angular/router";


// https://angular.io/guide/reactive-forms#dynamic-forms
export class Employee {
  photo!: string;
  name!: string;
  email!: string;
  address!: string;
  dob!: string;
  gender!: string;
}

@Component({
  selector: 'app-registro-guias',
  templateUrl: './registroguias.component.html',
  styleUrls: ['./registroguias.component.css'],
  providers: []
})
export class RegistroGuiasComponent implements OnInit, OnDestroy {

  elistMatTableDataSource = new MatTableDataSource<Employee>();
  displayedColumns: string[] = [];
  datosEdi: any = {};
  todaysDate!: Date;
  datosBasicosFormGroup!: UntypedFormGroup;
  progressRef!: NgProgressRef;
  value: number = 0;
  mode = new UntypedFormControl('side');
  isLoading = false;
  isSubmitted: boolean = false;


  isHovering: boolean = false;
  files: any[] = [];
  allFiles: File[] = [];

  basicDatepicker: string = "";

  dataUbigeoPartida: any = [];
  dataUbigeoDestino: any = [];
  IdUbigeoDestino: number = 0;
  IdUbigeoPartida: number = 0;
  DataListBody: any = [];

  constructor(
    private router: Router,
    private ngProgress: NgProgress,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    //private solicitudesService: SolicitudesService
    public printService: PrintService,
    public dialogo: MatDialog,
  ) {
    this.displayedColumns = ['Item', 'Descripcion', 'Cantidad', 'Unidad', 'Documento', 'Observaciones', 'Acciones'];
    this.todaysDate = new Date();
  }


  private eData: Employee[] = [];


  ngOnDestroy(): void {
    this.ngProgress.destroyAll();
  }

  async ngOnInit() {
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.progressRef = this.ngProgress.ref();
    this.progressRef.state.subscribe((state: any) => {
      this.value = state.value;
    });


    this.datosBasicosFormGroup = this._formBuilder.group({
      DatosDestinatario: '',
      Nombre: ['', Validators.required],
      DomicilioDestino: ['', Validators.required],
      DomicilioPartida: ['', Validators.required],
      FechaInicioTraslado: ['', Validators.required],

      Provincia: ['', Validators.required],
      Distrito: ['', Validators.required],
      Provincia1: ['', Validators.required],
      Distrito1: ['', Validators.required],
      DataListBody: this._formBuilder.array([
        this._formBuilder.group
        ({
          Item: '',
          Descripcion: '',
          Cantidad: '',
          Unidad: '',
          Documento: '',
          Observaciones: '',
        })
      ]),


    });

    this.datosBasicosFormGroup.controls["Provincia"].disable();
    this.datosBasicosFormGroup.controls["Distrito"].disable();
    this.datosBasicosFormGroup.controls["Distrito1"].disable();
    this.datosBasicosFormGroup.controls["Provincia1"].disable();
  }

  get aliases() {
    return this.datosBasicosFormGroup.get('DataListBody') as FormArray;
  }

  /*addAlias() {
   this.aliases.push(this.fb.control(''));
 } */

  addAlias() {
    if (this.aliases.controls.length === 20) return;
    this.aliases.push(this._formBuilder.group({
      Item: '',
      Descripcion: '',
      Cantidad: '',
      Unidad: '',
      Documento: '',
      Observaciones: '',
    }));
  }

  deleteAlias(id: number) {
    const datos = this.datosBasicosFormGroup.get('DataListBody') as FormArray
    if (datos.length > 1) {
      datos.removeAt(id)
    } else {
      datos.reset()
    }
  }


  async FinalizarRegistroSolicitud() {

//let inputDate=this.datosBasicosFormGroup.get("FechaInicioTraslado")?.value

    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Mensaje de Confirmación`,
        mensaje: `Se grabara la solicitud. Desea continuar?`

      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {

          this.progressRef.start()
          const data = {
            IdUbigeoDestino: this.IdUbigeoDestino,
            IdUbigeoPartida: this.IdUbigeoPartida,
            usuarioRegistro: this.datosEdi.Id,
            ...this.datosBasicosFormGroup.value
          }

          try {
            let response = await this.printService.RegistroGuia(data)

            if (response.success) {
              this.progressRef.complete()
              this.dialogo.open(DialogoConfirmacionComponent, {
                maxWidth: '25vw',
                maxHeight: 'auto',
                height: 'auto',
                width: '25%',
                disableClose: true,
                data: {
                  titulo: `Mensaje de Confirmación`,
                  mensaje: `Imprimir, Desea continuar?`
                }
              })
                .afterClosed()
                .subscribe(async (confirmado: Boolean) => {
                  if (confirmado) {
                    this.printData()
                  }
                });
            }
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

    /*
  */

    //console.log(data);

  }

  recibirRespuestaUbigeo(event: any): void {

    this.dataUbigeoPartida = event.map((x: any) => {
      return x
    });
    this.IdUbigeoPartida = this.dataUbigeoPartida[0].id;

    this.datosBasicosFormGroup.patchValue({Provincia: this.dataUbigeoPartida[0].provincia})

    this.datosBasicosFormGroup.patchValue({Distrito: this.dataUbigeoPartida[0].distrito})
  }

  recibirRespuestaUbigeo1(event: any): void {


    this.dataUbigeoDestino = event.map((x: any) => {
      return x
    });
    this.IdUbigeoDestino = this.dataUbigeoDestino[0].id;
    this.datosBasicosFormGroup.patchValue({Provincia1: this.dataUbigeoDestino[0].provincia})

    this.datosBasicosFormGroup.patchValue({Distrito1: this.dataUbigeoDestino[0].distrito})

  }

  printData() {

    const data = {
      IdUbigeoDestino: this.IdUbigeoDestino,
      IdUbigeoPartida: this.IdUbigeoPartida,
      ...this.datosBasicosFormGroup.value,
      dataUbigeoPartida: this.dataUbigeoPartida,
      dataUbigeoDestino: this.dataUbigeoDestino
    }

    //console.log(data)
    this.printService
      .printDocument('invoice', data);
  }


}
