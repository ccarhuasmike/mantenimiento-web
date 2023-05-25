import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { eLista } from "@core/types/formatos.types";
import { ListavaloresService } from "@shared/services/listavalores.service";


import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
export interface DialogData {
  titulo: string;
  mensaje: string;
  IdsSolicitud: string;
  accion: number;
}
@Component({
  selector: 'app-dialogo-tarifariomateriales',
  templateUrl: './dialogo-tarifariomateriales.component.html',
  styleUrls: ['./dialogo-tarifariomateriales.component.css']
})
export class DialogoTarifarioMaterialesComponent implements OnInit {
  @ViewChild('select') select!: MatSelect;
  mode = new UntypedFormControl('side');
  isLoading = false;
  //IdsClientes: string = "";
  IdSolicitud: number = 0;
  datosBasicosFormGroup!: UntypedFormGroup; 
  listMoneda: any = [];
  listUnidadMedida: any = [];
  material: any;
  IdTarifadoMaterial: number=0;
  constructor(
    private listavaloresService: ListavaloresService,
    private _formBuilder: UntypedFormBuilder,
    //private _authService: AuthService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    public dialogo: MatDialogRef<DialogoTarifarioMaterialesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.IdSolicitud = data.IdSolicitud;    
    this.material=  data.material;
    //this.IdsClientes = data.IdsCliente.toString();
  }
  listarUnidadMedida() {
    this.listavaloresService.getListaValores({
      idlista: eLista.UnidadMedida,
      idcliente: ""
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listUnidadMedida = respuesta.ListaEntidadComun;
      }
    });
  }

  listarMoneda() {
    this.listavaloresService.getListaValores({
      idlista: eLista.TipoMoneda,
      idcliente: ""
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listMoneda = respuesta.ListaEntidadComun;
      }
    });
  }
  onKeyUpPrecioUnitario(event: any){
    var cantidad= this.datosBasicosFormGroup.value.cantidadCtrl == null ? 0 : this.datosBasicosFormGroup.value.cantidadCtrl;
    this.datosBasicosFormGroup.patchValue({
      precioTotalCtrl: event.target.value * cantidad      
    });
  }
  onKeyUpCantidad(event: any){
    var preciounitario= this.datosBasicosFormGroup.value.preciounitarioCtrl == null ? 0 : this.datosBasicosFormGroup.value.preciounitarioCtrl;
    this.datosBasicosFormGroup.patchValue({
      precioTotalCtrl: event.target.value * preciounitario      
    });
  }
  cerrarDialogo(): void {
    
    this.dialogo.close({
      respuesta: false
    });
  }
  confirmado(): void {
    if (!this.datosBasicosFormGroup.valid)
      return;
      var request:any = {          
        IdSolicitud: this.IdSolicitud,
        nombre: this.datosBasicosFormGroup.value.materialCtrl,
        IdUnidadMedida: this.datosBasicosFormGroup.value.unidadCtrl,
        PrecioUnitario: this.datosBasicosFormGroup.value.preciounitarioCtrl,
        IdMoneda: this.datosBasicosFormGroup.value.monedaCtrl,
        Cantidad: this.datosBasicosFormGroup.value.cantidadCtrl,
        MontoTotal: this.datosBasicosFormGroup.value.precioTotalCtrl,
        descripcion: this.datosBasicosFormGroup.value.descripcionServicioCtrl
      }  
      if(this.IdTarifadoMaterial == 0){
        this.dialogo.close({
          respuesta: true,
          request:  request
        });
      }else{
        request.Id=this.IdTarifadoMaterial;
        request.ListIdGenerico=[];
        this.dialogo.close({
          respuesta: true,
          request:  request  
        });
      }
    
  }
  
  ngOnInit() {
    this.listarMoneda();
    this.listarUnidadMedida();
    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      
      materialCtrl: ['', Validators.required],
      unidadCtrl: ['', Validators.required],
      preciounitarioCtrl: ['', Validators.required],
      monedaCtrl: ['', Validators.required],
      cantidadCtrl: ['', Validators.required],
      precioTotalCtrl: ['', Validators.required],
      descripcionServicioCtrl: ['']
    });
    
    if(this.material===null){
      this.datosBasicosFormGroup.patchValue({
        unidadCtrl: 16,
        monedaCtrl: 5,
        cantidadCtrl: 1
      });
    }else{

      this.IdTarifadoMaterial = this.material.Id;
      this.datosBasicosFormGroup.patchValue({        
        materialCtrl: this.material.NombreItem,
        preciounitarioCtrl: this.material.PrecioUnitario,
        precioTotalCtrl:this.material.MontoTotal,
        descripcionServicioCtrl:this.material.Descripcion,
        unidadCtrl: this.material.IdUnidadMedida,
        monedaCtrl: this.material.IdMoneda,
        cantidadCtrl:this.material.Cantidad,
      });
    }    
  }
}
