import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatChipInputEvent} from '@angular/material/chips';
export interface PeriodicElement {
  Id: number;
  Usuario: string;
  Nombre: string;
}

import {MatTableDataSource} from '@angular/material/table';
import {ResponsableService} from "@shared/services/responsable.service";
const ELEMENT_DATA: PeriodicElement[] = [
  //  {Id:65,Nombre: 'segundo mike ccarguas barddales', NombreCorto: 'segundo mike ccarguas barddales', NumeroDocumento: '70116577'},
  // {Id:66,Nombre: 'segundo mike ccarguas barddales', NombreCorto: 'segundo mike ccarguas barddales', NumeroDocumento: '70116577'},
  // {Id:67,Nombre: 'segundo mike ccarguas barddales', NombreCorto: 'segundo mike ccarguas barddales', NumeroDocumento: '70116577'},
  // {Id:68,Nombre: 'segundo mike ccarguas barddales', NombreCorto: 'segundo mike ccarguas barddales', NumeroDocumento: '70116577'},

];
@Component({
  selector: 'app-modal-busquedad-responsable',
  templateUrl: './modal-busquedad-responsable.html',
  styleUrls: ['./modal-busquedad-responsable.css']
})
export class ModalBusquedadResponsable implements OnInit {
  isLoading = false;
  displayedColumns: string[] = ['select', 'Usuario', 'Nombre'];
  listDocumentoSeleccionado: any = [];
  filtroCliente: any = [];
  inputData: string="";
  @ViewChild('paginator')paginator!: MatPaginator;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  constructor(
    private responsableService: ResponsableService,
    public dialogo: MatDialogRef<ModalBusquedadResponsable>,
    @Inject(MAT_DIALOG_DATA)
    public data: any) {
    this.listDocumentoSeleccionado = data.listSeleccionado;
    this.filtroCliente = data.filtroArray;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
   this.inputData=filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    } else {//no llega
   
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
    this.buscarCliente(this.inputData);
  }
  buscarCliente(nombre: any): void {
  
    const data ={
      page: 0,
      pageSize: 100,
      offset: 0,
      next: 0,
      filter: {
        IdCLientes: this.filtroCliente,
        dataText:nombre
      }
    }
    this.isLoading = true;
    
    this.responsableService.getResponsablePorCliente(data).then((res: any) => {
      
      this.dataSource.data=res.data;
      this.isLoading = false;

      /*Marcamos checkedamos los cliente seleccionado*/
      let ELEMENT_DATA_SELECCIONADO: PeriodicElement[] = this.dataSource.data.filter(x => {
        return this.listDocumentoSeleccionado.indexOf(x.Id) > -1
      });
      ELEMENT_DATA_SELECCIONADO.forEach(x => {this.selection.select(x);});
    }, error => this.isLoading = false);
  }
  ngOnInit() {
    this.buscarCliente(null);
  }
  close(){

  }
}
