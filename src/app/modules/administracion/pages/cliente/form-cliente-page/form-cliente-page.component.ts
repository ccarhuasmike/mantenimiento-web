import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '@shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { ClienteService } from '../../../services/Cliente.service';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente-page.component.html',

})
export class FormClienteComponent implements OnInit {
  @Input() objRegistro: any;
  @Output() onGuardar: EventEmitter<any> = new EventEmitter();
  // @ts-ignore
  formulario: FormGroup;
  controlsRoles: any;


  //Registro de Expresiones
  RegEx_mailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(
    private clienteService: ClienteService,
    public dialogo: MatDialog,
    public router: Router,
    private fb: FormBuilder
  ) {
  }
  async ngOnInit() {
        if(this.objRegistro){ //EsEdicion

            this.formulario = this.fb.group({
              id: [{ value: this.objRegistro.id},[]],
              login: [{ value: this.objRegistro.login, disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
              Nombre: [{ value: this.objRegistro.nombre, disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
              apellidoPaterno: [{ value: this.objRegistro.apellidoPaterno, disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
              apellidoMaterno: [{ value: this.objRegistro.apellidoMaterno, disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
              email: [{ value: this.objRegistro.correo, disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
              ListRoles: this.fb.array([],[Validators.required]),
              recibeNotificacion: [{ value: this.objRegistro.recibeNotificacion, disabled: false }, []],
            });
         }else{
            this.formulario = new FormGroup({
            id: new FormControl(0),
            login: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            Nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            apellidoPaterno: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            apellidoMaterno: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            email: new FormControl('', [Validators.required, Validators.pattern(this.RegEx_mailPattern), Validators.minLength(3), Validators.maxLength(100)]),
            ListRoles: new FormArray([], [Validators.required]),
            recibeNotificacion:new FormControl(false,[]),
          });
       }
  }
  guardar() {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.dialogo.open(DialogoConfirmacionComponent, { maxWidth: '25vw', maxHeight: 'auto', height: 'auto', width: '25%', disableClose: true,
      data: { titulo: `Registro de Usuario`, mensaje: `¿Está seguro que desea grabar?` }
    }).afterClosed().subscribe(async (Ok: Boolean) => {
        if (Ok) {

          let request: any = {
              Id : this.objRegistro ? this.objRegistro.id : 0,
              login : this.objRegistro.login,
              Nombre : this.formulario.value.Nombre,
              apellidoPaterno : this.formulario.value.apellidoPaterno,
              apellidoMaterno : this.formulario.value.apellidoMaterno,
              email : this.formulario.value.email,
              recibeNotificacion: this.formulario.value.recibeNotificacion
            };
           this.onGuardar.emit(request);
          }
        });
    }
}

