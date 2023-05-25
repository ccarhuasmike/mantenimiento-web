import {SimpleChanges,Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import {SolicitudesService} from "@modules/solicitudes/services/solicitudes.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatDialog} from "@angular/material/dialog";
import {BusquedaTecnicoComponent,TecnicoElement} from "@shared/components/multiselecttecnico/modal-busqueda-tenico/modal-busqueda-tecnico.component";
@Component({
  selector: 'app-multiselecttecnico',
  templateUrl: './multiselecttecnico.component.html',
})
export class MultiSelectTecnicoComponent  implements  OnInit{
  @Input () value: any | undefined;
  @Input () valueIdsProveedor: any | undefined;
  @Input () titulo?: string;
  @Input () etiqueta?: string;
  @Input () setDefault: any | undefined;
  @Input() reset: any ;
  @Output () valueResponse: EventEmitter<any> = new EventEmitter();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  clientSeleccionado: TecnicoElement[] = [
    // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
  ];
  constructor(
    public dialogo: MatDialog,
    private solicitudesService: SolicitudesService,
  ) {
  }
  ngOnInit(): void {

    this.etiqueta = (this.etiqueta===undefined || this.etiqueta ==="" || this.etiqueta===null) ?  "Solicitante":this.etiqueta;
    if(this.setDefault!=null){
      /*Cuando se carga por primera vez el conntrol y se setear en automtico el cliente*/
      var InicializarCliente = this.setDefault.map((x:any)=>{return x.Id});
      let existeCliente = this.clientSeleccionado.some(x => {
        return InicializarCliente.indexOf(x.Id) > -1
      });
      if(!existeCliente){
        this.clientSeleccionado=this.setDefault;
      }
    }
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
    this.dialogo.open(BusquedaTecnicoComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      data: {
        clientChekeado : this.clientSeleccionado.map(x=>{ return x.Id}),
        IdsCliente:this.value==""? []:this.value,
        IdsProveedor:this.valueIdsProveedor==""? []:this.valueIdsProveedor,
        titulo:this.titulo===undefined ||  this.titulo===null || this.titulo===""?"Buscar Solicitante":this.titulo
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
  remove(fruit: TecnicoElement): void {
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
