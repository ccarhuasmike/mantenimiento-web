import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DialogoConfirmacionComponent } from '@shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { FormGroup,FormBuilder,FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PisosService } from '@modules/administracion/services/Pisos.service';
import { CookieService } from "ngx-cookie-service";
import { EspaciosService } from '@modules/espacios/services/espacio.service';
import { InmuebleService } from '@modules/administracion/services/Inmueble.service';
import { DialogAdjuntoUtilComponent } from '@shared/components/dialog-adjunto-util/dialog-adjunto-util.component';

@Component({
  selector: 'app-bandeja-pisos-page',
  templateUrl: './bandeja-pisos-page.component.html',
  styleUrls: ['./bandeja-pisos-page.component.css']
})
export class BandejaPisosPageComponent implements OnInit {
  isLoading = false;
  columnas = ['codigo','nombre','inmueble', 'edificio','fechaRegistro','fotos'];
  listarDto: any = {};
  formulario!: FormGroup;
  Nuevo:boolean=false;
  Editar:boolean=false;
  listInmueble: any[] = [];
  listEdificios: any[] = [];
  constructor(
    public dialogo: MatDialog,
    private inmService:InmuebleService,
    private objService: PisosService,
    private router: Router,
    public dialog: MatDialog,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private espaciosService: EspaciosService,
    
  ) {
  }
  inicializaControles(){
    this.cargarInmueble();
    this.formulario = new FormGroup({
      idInmueble: new FormControl(0, []),
      idEdificio: new FormControl(0, []),
      nombre: new FormControl(null, []),      
      page : new FormControl(1, []),
      size : new FormControl(100, []),          
    });
  }
  ngOnInit() {
    this.inicializaControles();
     //this.listar();
  }
  listar(){
    this.objService.listar(this.formulario.value).subscribe((data: any)=>{                 
      this.listarDto = data;
      this.isLoading = false;
    });
  }
  Buscar() {
    this.listar();
  }
  Limpiar() {
    this.inicializaControles();
  }
  onPaginateChange(event: PageEvent) {
    const pageIndex = event.pageIndex + 1;
    const pageSize = event.pageSize;

    this.formulario.controls['page'].setValue(pageIndex);          
    this.formulario.controls['size'].setValue(pageSize);          
    this.listar();
 }



 cargarInmueble() {
   var clienteSeleccion = JSON.parse(this.cookieService.get('objetoClientePorUsuario'));
   this.inmService.listar(clienteSeleccion.Id).then((respuesta) => {
    console.log(respuesta);
     this.listInmueble = respuesta;
     this.formulario.controls['idInmueble'].setValue(this.listInmueble[0].id);      
     this.cargarEdificios();
   });
 }
 cargarEdificios(){
  this.objService.listarEdificiosxIdInmueble(this.formulario.controls['idInmueble'].value).then((respuesta) => {    
    this.listEdificios = respuesta.data;
    this.formulario.controls['idEdificio'].setValue(this.listEdificios[0].id);          
  });
 }
 onSelectEventInmueble(value: any) {
  this.cargarEdificios();
 }
 adjuntos(id:any){

  const dialogRef = this.dialog.open(DialogAdjuntoUtilComponent,
     {
    data: {idRegistro: id, CodigoTabla: 239},
    maxWidth: '30vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '30%',
      disableClose: false,
  });
  dialogRef.afterClosed().subscribe(result => {});
 }
}