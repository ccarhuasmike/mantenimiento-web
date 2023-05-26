import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DialogoConfirmacionComponent } from '@shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { CookieService } from 'ngx-cookie-service';
import { EspaciosService } from '@modules/espacios/services/espacio.service';


@Component({
  selector: 'app-form-sala-reunion-page',
  templateUrl: './form-sala-reunion-page.component.html',
  styleUrls: ['./form-sala-reunion-page.component.css']
})
export class FormSalaReunionPageComponent implements OnInit {
  decryptedMessage!: string;
  formulario!: FormGroup;
  @Input() objRegistro: any;
  @Output() onGuardar: EventEmitter<any> = new EventEmitter();  
  listInmueble: any[] = [];
  listPiso: any[] = [];
  public idRegistro: number = -1;
  public CodigoTabla : number = 1018;
  public titulo : string = "Sala de reunión";
  constructor(public dialogo: MatDialog,
              private fb: FormBuilder,
              private cookieService: CookieService,
              private espaciosService: EspaciosService) {        
  }
  cargarSedeLocales() {
    var clienteSeleccion = JSON.parse(this.cookieService.get('objetoClientePorUsuario'));
    this.espaciosService.getObtenerInmuebles(clienteSeleccion.Id).then((respuesta) => {
      this.listInmueble = respuesta;
      if(!this.objRegistro)
          this.formulario.controls['idInmueble'].setValue(this.listInmueble[0].id);      
      this.cargarPisos();
    });
  }
  cargarPisos(){
    var idInmueble  = this.formulario.controls['idInmueble'].value;
    if(idInmueble>0){
        this.espaciosService.getObtenerPisos(idInmueble).then((respuesta) => {
          this.listPiso=respuesta;          
        }); 
    }
  }
  async ngOnInit() {
    this.cargarSedeLocales();
    if(this.objRegistro){ //EsEdicion            
      this.idRegistro = this.objRegistro.Id;      
      this.formulario = this.fb.group({      
        Id: [{ value: this.objRegistro.Id, disabled: false},[]],
        idInmueble: [{ value: this.objRegistro.idInmueble, disabled: false }, []],
        idPiso: [{ value: this.objRegistro.idPiso , disabled: false }, []],
        Nombre: [{ value: this.objRegistro.Nombre, disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],        
        Aforo: [{ value: this.objRegistro.aforo, disabled: false }, []],                
        tieneVideoConferencia: [{ value: this.objRegistro.tieneVideoConferencia, disabled: false }, []],        
        tieneFriobar: [{ value: this.objRegistro.tieneFriobar, disabled: false }, []],        
        tieneTv: [{ value: this.objRegistro.tieneTv, disabled: false }, []],        
        Activo: [{ value: this.objRegistro.Activo, disabled: false }, []],        
      });      
    }else{
      this.idRegistro =-1;
      this.formulario = new FormGroup({      
        idInmueble: new FormControl(0, [Validators.required]),
        idPiso : new FormControl(0, [Validators.required]),
        Nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        Aforo: new FormControl(5, [Validators.required]),
        tieneVideoConferencia:new FormControl(false,[Validators.required]),
        tieneFriobar:new FormControl(false,[Validators.required]),
        tieneTv:new FormControl(false,[Validators.required]),
        Activo:new FormControl(true,[Validators.required]),

      });
    }
  } 
  async guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    
    this.dialogo.open(DialogoConfirmacionComponent, { maxWidth: '25vw', maxHeight: 'auto', height: 'auto', width: '25%', disableClose: true,
      data: { titulo: this.titulo, mensaje: `¿Está seguro que desea grabar?` }
    }).afterClosed().subscribe(async (Ok: Boolean) => {
        if (Ok) {           
          if(!this.objRegistro){
            let lsIdsAdjuntos =  JSON.parse(localStorage.getItem("tmpAdjunto_"+this.CodigoTabla)??"[]") ;                
            this.formulario.value.listAdjuntos = lsIdsAdjuntos;
          }
          this.onGuardar.emit(this.formulario.value);
        }
      });
  }
  onSelectEventInmueble(value: any){

  }
}
