import {SimpleChanges,Component, OnInit, Input, Output,EventEmitter, ElementRef} from '@angular/core';
import {SolicitudesService} from "@modules/solicitudes/services/solicitudes.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {
  ModalBusquedadUbigeoComponent,
  SolicitanteElement
} from "@shared/components/button-ubigeo/modal-busquedad-ubigeo/modal-busqueda-ubigeo";
import {MatDialog} from "@angular/material/dialog";
import { Console } from 'console';
@Component({
  selector: 'app-button-ubigeo',
  templateUrl: './button-ubigeo.html',
})
export class ButtonUbigeoComponent  implements  OnInit{
  /*@Input () value: any | undefined;
  @Input () titulo?: string;
  //@Input () etiqueta?: string;
  @Input() setDefault: any | undefined;
  @Input() reset: any ;*/
  @Output () valueResponse: EventEmitter<any> = new EventEmitter();

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  clientSeleccionado: SolicitanteElement[] = [
    // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
  ];
  inputTxtDepartamento:string="";
  constructor(
    public dialogo: MatDialog,
    private solicitudesService: SolicitudesService,
    elementRef:ElementRef
  ) {


  }

  ngOnInit(): void {
/*
    if(this.setDefault!=null){
      //Cuando se carga por primera vez el conntrol y se setear en automtico el cliente
      var InicializarCliente = this.setDefault.map((x:any)=>{return x.Id});
      let existeCliente = this.clientSeleccionado.some(x => {
        return InicializarCliente.indexOf(x.Id) > -1
      });
      if(!existeCliente){
        this.clientSeleccionado=this.setDefault;
      }
    } */

  }




  ngOnChanges(changes: SimpleChanges) {
  /*  for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'reset': {
            if(this.reset.length==0){
              this.clientSeleccionado=[];
            }
          }
        }
      }
    }*/
  }
  search(): void {

    this.dialogo.open(ModalBusquedadUbigeoComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      data: {
       /* clientChekeado : this.clientSeleccionado.map(x=>{ return x.Id}),
        IdsCliente:this.value==""? []:this.value,
        titulo:this.titulo===undefined ||  this.titulo===null || this.titulo===""?"Buscar Solicitante":this.titulo*/

      }
      //data: this.clientSeleccionado.map(x=>{ return x.Id})
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if(confirmado.respuesta){
          this.clientSeleccionado = confirmado.clienteSeleccionado;

         this.inputTxtDepartamento=confirmado.clienteSeleccionado[0].departamento

          this.valueResponse.emit(this.clientSeleccionado);


        }
      });


  }
focusInput(e:any){
e.target.blur()
return  this.search()


}
  remove(fruit: SolicitanteElement): void {
    const index = this.clientSeleccionado.indexOf(fruit);
    if (index >= 0) {
      this.clientSeleccionado.splice(index, 1);
    }
    this.valueResponse.emit(this.clientSeleccionado);
  }

}
