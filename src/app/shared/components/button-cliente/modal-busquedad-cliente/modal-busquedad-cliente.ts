import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatChipInputEvent} from '@angular/material/chips';
export interface PeriodicElement {
  Id: number;
  Nombre: string;
  NombreCorto: string;
  NumeroDocumento: string;
}

import {MatTableDataSource} from '@angular/material/table';
import {ClienteService} from "@shared/services/cliente.service";
const ELEMENT_DATA: PeriodicElement[] = [
  //  {Id:65,Nombre: 'segundo mike ccarguas barddales', NombreCorto: 'segundo mike ccarguas barddales', NumeroDocumento: '70116577'},
  // {Id:66,Nombre: 'segundo mike ccarguas barddales', NombreCorto: 'segundo mike ccarguas barddales', NumeroDocumento: '70116577'},
  // {Id:67,Nombre: 'segundo mike ccarguas barddales', NombreCorto: 'segundo mike ccarguas barddales', NumeroDocumento: '70116577'},
  // {Id:68,Nombre: 'segundo mike ccarguas barddales', NombreCorto: 'segundo mike ccarguas barddales', NumeroDocumento: '70116577'},

];
@Component({
  selector: 'app-modal-busquedad-cliente',
  templateUrl: './modal-busquedad-cliente.html',
  styleUrls: ['./modal-busquedad-cliente.css']
})
export class ModalBusquedadCliente implements OnInit {
  isLoading = false;
  displayedColumns: string[] = ['select', 'Nombre', 'NombreCorto', 'NumeroDocumento'];
  listDocumentoSeleccionado: any = [];
  @ViewChild('paginator')paginator!: MatPaginator;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  constructor(
    private clienteService: ClienteService,
    public dialogo: MatDialogRef<ModalBusquedadCliente>,
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
  filtrar():void{
    this.buscarCliente("");
  }
  buscarCliente(nombre:string): void {
    this.isLoading = true;
    this.clienteService.getClientesPorUsuarioFiltro(nombre).then((res:any) => {
      this.dataSource.data=res;
      this.isLoading = false;

      /*Marcamos checkedamos los cliente seleccionado*/
      let ELEMENT_DATA_SELECCIONADO: PeriodicElement[] = this.dataSource.data.filter(x => {
        return this.listDocumentoSeleccionado.indexOf(x.Id) > -1
      });
      ELEMENT_DATA_SELECCIONADO.forEach(x => {this.selection.select(x);});
    }, error => this.isLoading = false);
  }
  ngOnInit() {
    this.buscarCliente("");
  }
  close(){

  }
}
