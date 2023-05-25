import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
export interface AprobadoresElement {
  Id:number,
  Nombre: string;

}
import {MatTableDataSource} from '@angular/material/table';

const ELEMENT_DATA: AprobadoresElement[] = [];
@Component({
  selector: 'app-modal-busqueda-aprobadores',
  templateUrl: './modal-busqueda-aprobadores.component.html',
  styleUrls: ['./modal-busqueda-aprobadores.component.css']
})
export class DialogAprobadoresComponent implements OnInit {
  IdsClientes:string="";
  isLoading = false;
  displayedColumns: string[] = ['select', 'Nombre'];
  listDocumentoSeleccionado: any = [];
  @ViewChild('paginator')paginator!: MatPaginator;
  dataSource = new MatTableDataSource<AprobadoresElement>(ELEMENT_DATA);
  selection = new SelectionModel<AprobadoresElement>(true, []);
  constructor(   
    public dialogo: MatDialogRef<DialogAprobadoresComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dataSource.data =  data.listAprobadores;
    /*this.listDocumentoSeleccionado = data.clientChekeado;
    this.IdsClientes=data.IdsCliente.join(",");*/
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.buscarCliente(filterValue);
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
      aprobadoresSeleccionado: this.selection.selected,
      respuesta: true
    });
  }
  filtrar():void{
    this.buscarCliente("");
  }
  buscarCliente(filterValue:string): void {
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
  ngOnInit() {

  }
}
