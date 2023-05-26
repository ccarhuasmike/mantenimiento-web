import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SalaReunionService } from '@modules/espacios/services/salareunion.service';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";

@Component({
  selector: 'app-editar-sala-reunion-page',
  templateUrl: './editar-sala-reunion-page.component.html',
  styleUrls: ['./editar-sala-reunion-page.component.css']
})
export class EditarSalaReunionPageComponent implements OnInit {
  objRegistro?: any;
  constructor(private objService: SalaReunionService,
              public router: Router,
              private route: ActivatedRoute,
              private notificador: BootstrapNotifyBarService) { }

  ngOnInit(): void {
    let valor: any = this.route.snapshot.paramMap.get('id');
    this.objService.obtener(valor).subscribe((data: any) => {
      localStorage.setItem("idRegistro",valor);
      this.objRegistro=data;      
    });
  }
  actualizar(req: any) {
    this.objService.actualizar(req)
      .subscribe((data: any) => {
        if(data.tipoResultado==1){
          this.notificador.notifySuccess(data.mensaje);
          setTimeout(() => {
            this.router.navigate(['/espacios', 'bandejasala'])
          }, 3000)
        }else{
          this.notificador.notifyWarning(data.mensaje);
        }      
      });
  }
}
