import {SimpleChanges,Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import {SolicitudesService} from "@modules/solicitudes/services/solicitudes.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";

import {MatChipInputEvent} from "@angular/material/chips";
import {
  BusquedaGrupoUnidadComponent,
  GrupoUnidadElement
} from "@shared/components/multiselectgrupounidad/modal-busqueda-grupounidad/modal-busqueda-grupounidad.component";
import {MatDialog} from "@angular/material/dialog";
@Component({
  selector: 'app-multiselectgrupounidad',
  templateUrl: './multiselectgrupounidad.component.html',
})
export class MultiSelectGrupoUnidadComponent  implements  OnInit{
  @Input () value: any | undefined;
  @Input() reset: any ;
  @Output () valueResponse: EventEmitter<any> = new EventEmitter();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  clientSeleccionado: GrupoUnidadElement[] = [
    // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
  ];
  constructor(
    public dialogo: MatDialog,
    private solicitudesService: SolicitudesService,
  ) {
  }
  ngOnInit(): void {
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
  search(): void {
    this.dialogo.open(BusquedaGrupoUnidadComponent, {
      maxWidth: '70vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '70%',
      data: {
        clientChekeado : this.clientSeleccionado.map(x=>{ return x.Id}),
        IdsCliente:this.value==""? []:this.value
      }
      //data: this.clientSeleccionado.map(x=>{ return x.Id})
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if(confirmado.respuesta){
          this.clientSeleccionado = confirmado.clienteSeleccionado;
          this.valueResponse.emit(this.clientSeleccionado);
        }
      });
  }
  remove(fruit: GrupoUnidadElement): void {
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
