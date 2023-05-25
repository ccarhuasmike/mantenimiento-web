import {SimpleChanges,Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import {SolicitudesService} from "@modules/solicitudes/services/solicitudes.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";

import {MatChipInputEvent} from "@angular/material/chips";
import {
  BusquedaTipoSolicitudComponent,
  TipoSolicitudElement
} from "@shared/components/multiselecttiposolicitud/modal-busqueda-tiposolicitud/modal-busqueda-tiposolicitud.component";
import {MatDialog} from "@angular/material/dialog";
@Component({
  selector: 'app-multiselecttiposolicitud',
  templateUrl: './multiselecttiposolicitud.component.html',
})
export class MultiSelectTipoSolicitudComponent  implements  OnInit{
  @Input () value: any | undefined;
  @Input() reset: any ;
  @Output () valueResponse: EventEmitter<any> = new EventEmitter();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  clientSeleccionado: TipoSolicitudElement[] = [
    // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
  ];
  constructor(
    public dialogo: MatDialog,
    private solicitudesService: SolicitudesService,
  ) {
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'reset': {
            if(this.reset.length==0){
              this.clientSeleccionado=[];
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {
  }
  search(): void {
    this.dialogo.open(BusquedaTipoSolicitudComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      data: {
        clientChekeado : this.clientSeleccionado.map(x=>{ return x.Id}),
        IdsCliente:this.value==""? []:this.value
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if(confirmado.respuesta){


          //this.clientSeleccionado=[];
          this.clientSeleccionado = confirmado.clienteSeleccionado;
          this.valueResponse.emit(this.clientSeleccionado);
        }
      });
  }
  remove(fruit: TipoSolicitudElement): void {
    const index = this.clientSeleccionado.indexOf(fruit);
    if (index >= 0) {
      this.clientSeleccionado.splice(index, 1);
    }
    this.valueResponse.emit(this.clientSeleccionado);
  }
  add(event: MatChipInputEvent): void {
    // const input = event.input;
    // const value = event.value;
    //
    // // Add our fruit
    // if ((value || '').trim()) {
    //   this.fruits.push({NombreCorto: value.trim()});
    // }
    //
    // // Reset the input value
    // if (input) {
    //   input.value = '';
    // }
  }
}
