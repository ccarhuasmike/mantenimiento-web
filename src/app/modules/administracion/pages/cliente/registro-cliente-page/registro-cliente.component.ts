import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ClienteService } from '@modules/administracion/services/Cliente.service';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
})
export class RegistroClienteComponent implements OnInit {
  constructor(
    private clienteService: ClienteService,
    public router: Router,
    private route: ActivatedRoute,
    private bootstrapNotifyBarService: BootstrapNotifyBarService
  ) {
  }
  ngOnInit(): void {
  }
  crear(req: any) {
  }
}

