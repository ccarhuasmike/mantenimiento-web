import {SimpleChanges,Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import {SolicitudesService} from "@modules/solicitudes/services/solicitudes.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {
  BusquedaClienteComponent,
  PeriodicElement
} from "@shared/components/multiselectcliente/modal-busqueda-cliente/modal-busqueda-cliente.component";
import {MatDialog} from "@angular/material/dialog";
@Component({
  selector: 'app-multiselectclient',
  templateUrl: './multiselectcliente.component.html',
})
export class MultiSelectClienteComponent  implements  OnInit{
  @Input () value: any | undefined;
  @Input() reset: any ;
  @Output () valueResponse: EventEmitter<any> = new EventEmitter();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  clientSeleccionado: PeriodicElement[] = [
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
            break;
          }
          case 'value': {
            this.ngOnInit();
          }
        }
      }
    }
  }
  ngOnInit(): void {
    
    if(this.value!=null){
      /*Cuando se carga por primera vez el conntrol y se setear en automtico el cliente*/
      var InicializarCliente = this.value.map((x:any)=>{return x.Id});
      let existeCliente = this.clientSeleccionado.some(x => {
        return InicializarCliente.indexOf(x.Id) > -1
      });
      if(!existeCliente){
        this.clientSeleccionado=this.value;
      }
    }
  }
  search(): void {

    this.dialogo.open(BusquedaClienteComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: this.clientSeleccionado.map(x=>{ return x.Id})
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
  remove(fruit: PeriodicElement): void {
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
