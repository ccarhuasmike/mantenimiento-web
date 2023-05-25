﻿import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatChipInputEvent} from '@angular/material/chips';
export interface EstadoSolicitudElement {
  Id:number;
  Nombre: string;
}
import {MatTableDataSource} from '@angular/material/table';
import {EstadoSolService} from "@shared/services/estadosol.service";
const ELEMENT_DATA: EstadoSolicitudElement[] = [
  // {Nombre: 'segundo mike', NombreCorto: 'segundo', NumeroDocumento: '70116577'},
];
@Component({
  selector: 'app-modal-busqueda-estadosol',
  templateUrl: './modal-busqueda-estadosol.component.html',
  styleUrls: ['./modal-busqueda-estadosol.component.css']
})
export class BusquedaEstadoSolComponent implements OnInit {
  isLoading = false;
  displayedColumns: string[] = ['select', 'Nombre'];
  listDocumentoSeleccionado: any = [];
  @ViewChild('paginator')paginator!: MatPaginator;
  dataSource = new MatTableDataSource<EstadoSolicitudElement>(ELEMENT_DATA);
  selection = new SelectionModel<EstadoSolicitudElement>(true, []);
  constructor(
    private clienteService: EstadoSolService,
    public dialogo: MatDialogRef<BusquedaEstadoSolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.listDocumentoSeleccionado = data;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }else{
      /*se no se encuentra informacion en el datasource se procedera a buscar en api rest*/
      if(this.dataSource.filteredData.length==0){
      this.buscarCliente(filterValue.trim().toLowerCase());
      }
    }
  }
  filtrar():void{
    this.buscarCliente("");
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  /**Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  cerrarDialogo(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {

    this.dialogo.close({
      clienteSeleccionado: this.selection.selected,
      respuesta: true
    });
  }
  eventEmitDoubleClick(event:any){   
    /*Obtenemos registro seleccionados */
    let ELEMENT_DATA_SELECCIONADO: EstadoSolicitudElement[] = this.dataSource.data.filter(x => {
      return this.listDocumentoSeleccionado.indexOf(x.Id) > -1
    });
    /* buscamos si el registro a agregar ya esta seleccionado */
    if(!ELEMENT_DATA_SELECCIONADO.some(x=>{return x.Id ===event.Id})){
      ELEMENT_DATA_SELECCIONADO.push(event)
    }
    this.dialogo.close({
      clienteSeleccionado: ELEMENT_DATA_SELECCIONADO,
      respuesta: true
    });
  }
  buscarCliente(nombre:string): void {
    this.isLoading = true;
    this.clienteService.getEstadoSolicitudFiltro().then((res:any) => {
      this.dataSource.data=res;
      this.isLoading = false;
      /*Marcamos checkedamos los cliente seleccionado*/
      let ELEMENT_DATA_SELECCIONADO: EstadoSolicitudElement[] = this.dataSource.data.filter(x => {
        return this.listDocumentoSeleccionado.indexOf(x.Id) > -1
      });
      ELEMENT_DATA_SELECCIONADO.forEach(x => {this.selection.select(x);});
    }, error => this.isLoading = false);
  }
  ngOnInit() {
    this.buscarCliente("");
  }
}
