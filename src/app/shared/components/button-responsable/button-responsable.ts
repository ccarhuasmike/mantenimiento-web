import {SimpleChanges,Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import {SolicitudesService} from "@modules/solicitudes/services/solicitudes.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {
  ModalBusquedadResponsable,
  PeriodicElement
} from "@shared/components/button-responsable/modal-busqueda-responsable/modal-busquedad-responsable";
import {MatDialog} from "@angular/material/dialog";
@Component({
  selector: 'button-responsable',
  templateUrl: './button-responsable.html',
})
export class ButtonResponsableComponent  implements  OnInit{
  @Input () value: any | undefined;
  @Input() arrayClient: any;

  @Output () valueResponse: EventEmitter<any> = new EventEmitter();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  responsableSeleccionado: PeriodicElement[] = [
    // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
  ];
  constructor(
    public dialogo: MatDialog,
    private solicitudesService: SolicitudesService,
  ) {
  }

  ngOnInit(): void {

    if(this.value!=null){
      /*Cuando se carga por primera vez el conntrol y se setear en automtico el cliente*/
      var InicializarResponsable = this.value.map((x:any)=>{return x.Id});
      let existeCliente = this.responsableSeleccionado.some(x => {
        return InicializarResponsable.indexOf(x.Id) > -1
      });
      if(!existeCliente){
        this.responsableSeleccionado=this.value;
      }
    }
  }




  search(): void {

    this.dialogo.open(ModalBusquedadResponsable, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        filtroArray: this.arrayClient.map((x:any)=>{return x.Id}),
        listSeleccionado: this.responsableSeleccionado.map(x => { return x.Id })
      }

    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if(confirmado.respuesta){


          //this.clientSeleccionado=[];
          this.responsableSeleccionado = confirmado.clienteSeleccionado;
          this.valueResponse.emit(this.responsableSeleccionado);
        }
      });
  }
  remove(fruit: PeriodicElement): void {
    const index = this.responsableSeleccionado.indexOf(fruit);
    if (index >= 0) {
      this.responsableSeleccionado.splice(index, 1);
    }
    this.valueResponse.emit(this.responsableSeleccionado);
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
