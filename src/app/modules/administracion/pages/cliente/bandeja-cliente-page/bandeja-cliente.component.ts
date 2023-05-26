import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {ClienteService} from '../../../services/Cliente.service';
import {Router} from '@angular/router';
import {DialogoConfirmacionComponent} from '@shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import {BootstrapNotifyBarService} from "@shared/services/bootstrap-notify.service";
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';

const _ = require('lodash');

@Component({
  selector: 'app-bandeja-cliente',
  templateUrl: './bandeja-cliente.component.html'
})
export class BandejaClienteComponent implements OnInit {
  isLoading = false;
  columnas = ['Codigo', 'Nombre', 'Estado', 'descripcionLogo'];
  listarDto: any = {};
  formulario!: FormGroup;
  Nuevo: boolean = false;
  Editar: boolean = false;

  constructor(
    public dialogo: MatDialog,
    private clienteService: ClienteService,
    private router: Router,
    public dialog: MatDialog,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private fb: FormBuilder,
  ) {
  }

  inicializaControles() {
    this.formulario = new FormGroup({
      Nombre: new FormControl(null, []),
      page: new FormControl(1, []),
      size: new FormControl(10, []),
    });
  }

  ngOnInit() {
    this.inicializaControles();
    this.listar();
  }

  listar() {
    this.clienteService.listar(this.formulario.value).subscribe((data: any) => {
      console.log(data.data);
      this.listarDto = data;
      this.isLoading = false;
    });
  }

  Buscar() {
    this.listar();
  }

  Limpiar() {
    this.inicializaControles();
  }

  onPaginateChange(event: PageEvent) {
    const pageIndex = event.pageIndex + 1;
    const pageSize = event.pageSize;
  }
}
