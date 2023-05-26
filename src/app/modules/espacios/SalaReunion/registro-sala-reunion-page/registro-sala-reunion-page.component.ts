import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SalaReunionService } from '@modules/espacios/services/salareunion.service';
import { AdministracionService } from '@shared/services/administracion.service';
import {BootstrapNotifyBarService} from "@shared/services/bootstrap-notify.service";

@Component({
  selector: 'app-registro-sala-reunion-page',
  templateUrl: './registro-sala-reunion-page.component.html',
  styleUrls: ['./registro-sala-reunion-page.component.css']
})
export class RegistroSalaReunionPageComponent implements OnInit {
  public CodigoTabla : number = 1018; 
  constructor(private objService: SalaReunionService,
    private fb: FormBuilder,              
    private router: Router,
    private notificador: BootstrapNotifyBarService,
    private administracionService: AdministracionService) { }

  ngOnInit(): void {
  }
  crear(req: any) {   
    let lsIdsAdjuntos : number[];
    lsIdsAdjuntos=JSON.parse(localStorage.getItem("tmpAdjunto_"+this.CodigoTabla)??"[]") ;   
  
    this.objService.grabar(req).subscribe((data : any) => {
      if(data.tipoResultado==1){            
        if(lsIdsAdjuntos)
          this.administracionService.actualizarIdRegistroAdjuntos({IdRegistro:data.idRegistro,listAdjuntos:lsIdsAdjuntos}).subscribe((rsp: any) => {});           
        
        localStorage.setItem("tmpAdjunto_"+this.CodigoTabla,"[]");
        this.notificador.notifySuccess(data.mensaje);
        setTimeout(() => {this.router.navigate(['/espacios', 'bandejasala'])}, 3000)

      }else{
        this.notificador.notifyWarning(data.mensaje);
      }
    });
  }
}
